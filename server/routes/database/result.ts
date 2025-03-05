import { Router } from 'express'
import { eq } from 'drizzle-orm'

import { db } from '../../database/driver'
import { Results } from '../../database/entity'

const expressRouter = Router()

expressRouter.get('/list', async (req, res) => {
  try {
    let allResults = await db.select().from(Results)

    res.send(allResults)
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
    let selectedResults = await db.select().from(Results).where(eq(Results.id, id))

    if (selectedResults.length === 0) {
      res.status(404).send(`Result "${id}" not found`)
      return
    }

    res.send({
      ...selectedResults[0]
    })
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/add', async (req, res) => {
  const examID = req.body.examID
  const studentID = req.body.studentID
  const score = req.body.score
  const status = req.body.status

  let missingFields: string[] = []
  if (!examID) missingFields.push('examID')
  if (!studentID) missingFields.push('studentID')
  if (!score) missingFields.push('score')
  if (!status) missingFields.push('status')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    await db.insert(Results).values({
      examID,
      studentID,
      score,
      status
    })

    res.send('Result added')
  }
  catch (err) {
    console.log(err)
    res.status(500).send(err.toString())
  }

})

expressRouter.post('/edit', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('Result id is required')
    return
  }

  const examID = req.body.examID
  const studentID = req.body.studentID
  const score = req.body.score
  const status = req.body.status

  let set1 = {}
  if (examID) set1['examID'] = examID
  if (studentID) set1['studentID'] = studentID
  if (score) set1['score'] = score
  if (status) set1['status'] = status

  try {
    if (Object.keys(set1).length > 0) await db.update(Results).set(set1).where(eq(Results.id, id))

    res.send('Result updated')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/delete', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('Result id is required')
    return
  }

  try {
    await db.delete(Results).where(eq(Results.id, id))

    res.send('Result deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

export const router = expressRouter