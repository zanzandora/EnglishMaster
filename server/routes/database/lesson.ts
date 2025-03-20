import { Router } from 'express'
import multer from 'multer'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { eq } from 'drizzle-orm'

import { Lessons } from '../../database/entity'
import { db } from '../../database/driver'

const multerStorage = multer.memoryStorage()
const upload = multer({ storage: multerStorage })

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.BUCKET_PRIVATE_ACCESS_KEY!
  },
  region: process.env.BUCKET_REGION!
})

const expressRouter = Router()

expressRouter.get('/list', async (req, res) => {
  try {
    let allLessons = await db.select().from(Lessons)

    res.send(allLessons)
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.get('/', async (req, res) => {
  const id = req.body.id

  let missingFields: string[] = []
  if (!id) missingFields.push('id')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    let selectedLessons = await db.select().from(Lessons).where(eq(Lessons.id, id))

    if (selectedLessons.length === 0) {
      res.status(404).send(`Lesson "${id}" not found`)
      return
    }

    res.send({
      ...selectedLessons[0]
    })
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/add', upload.single('file'), async (req, res) => {
  const title = req.body.title
  const description = req.body.description
  const type = req.body.type
  const file = req.file

  let missingFields: string[] = []
  if (!title) missingFields.push('title')
  if (!description) missingFields.push('description')
  if (!type) missingFields.push('type')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  if (!file) {
    res.status(400).send(`Please specific a file`)
    return
  }

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype
    })
    await s3.send(command)

    await db.insert(Lessons).values({
      title,
      description,
      type,
      file_size: +file.size!,
      file_type: 'docx',
      file_url: `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${req.file?.originalname}`
    })

    res.send('Lesson added')
  }
  catch (err) {
    console.log(err)
    res.status(500).send(err.toString())
  }

})

expressRouter.post('/edit', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('Lesson id is required')
    return
  }

  const title = req.body.title
  const description = req.body.description
  const type = req.body.type

  let set1 = {}
  if (title) set1['title'] = title
  if (description) set1['description'] = description
  if (type) set1['type'] = type

  try {
    if (Object.keys(set1).length > 0) await db.update(Lessons).set(set1).where(eq(Lessons.id, id))

    res.send('Lesson updated')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.delete('/delete/:id', async (req, res) => {
  const id = req.params.id

  if (!id) {
    res.status(400).send('Lesson id is required')
    return
  }

  try {
    await db.delete(Lessons).where(eq(Lessons.id, Number(id)))

    res.send('Lesson deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

export const router = expressRouter