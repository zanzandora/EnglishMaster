import { Router } from 'express'
import { and, eq } from 'drizzle-orm'

import { Courses } from '../../database/entity'
import { db } from '../../database/driver'

const expressRouter = Router()

expressRouter.get('/', async (req, res) => {
  const name = req.body.name
  const teacherID = req.body.teacherID

  let missingFields: string[] = []
  if (!name) missingFields.push('name')
  if (!teacherID) missingFields.push('teacherID')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    let selectedCourses = await db.select().from(Courses).where(and(eq(Courses.name, name), eq(Courses.teacherID, teacherID)))

    if (selectedCourses.length === 0) {
      res.status(404).send(`Course "${name}" not found`)
      return
    }

    res.send({
      ...selectedCourses[0]
    })
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/add', async (req, res) => {
  const name = req.body.name
  const description = req.body.description
  const duration = req.body.duration
  const fee = req.body.fee
  const teacherID = req.body.teacherID

  let missingFields: string[] = []
  if (!name) missingFields.push('name')
  if (!description) missingFields.push('description')
  if (!duration) missingFields.push('duration')
  if (!fee) missingFields.push('fee')
  if (!teacherID) missingFields.push('teacherID')

  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    await db.insert(Courses).values({
      name,
      description,
      duration,
      fee,
      teacherID,
    })

    res.send('Course added')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }

})

expressRouter.post('/edit', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('Course id is required')
    return
  }

  const name = req.body.name
  const description = req.body.description
  const duration = req.body.duration
  const fee = req.body.fee
  const teacherID = req.body.teacherID

  let set1 = {}
  if (name) set1['name'] = name
  if (description) set1['description'] = description
  if (duration) set1['duration'] = duration
  if (fee) set1['fee'] = fee
  if (teacherID) set1['teacherID'] = teacherID

  try {
    if (Object.keys(set1).length > 0) await db.update(Courses).set(set1).where(eq(Courses.id, id))

    res.send('Course updated')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/delete', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('Course id is required')
    return
  }

  try {
    await db.delete(Courses).where(eq(Courses.id, id))

    res.send('Course deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

export const router = expressRouter