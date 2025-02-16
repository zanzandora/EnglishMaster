import { Router } from 'express'
import { and, eq } from 'drizzle-orm'

import { Classes } from '../../database/entity'
import { db } from '../../database/driver'

const expressRouter = Router()

expressRouter.get('/', async (req, res) => {
  const courseID = req.body.courseID
  const teacherID = req.body.teacherID

  let missingFields: string[] = []
  if (!courseID) missingFields.push('courseID')
  if (!teacherID) missingFields.push('teacherID')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    let selectedClasses = await db.select().from(Classes).where(and(eq(Classes.courseID, courseID), eq(Classes.teacherID, teacherID)))

    if (selectedClasses.length === 0) {
      res.status(404).send(`Class "${courseID}" with teacher "${teacherID}" not found`)
      return
    }

    res.send({
      ...selectedClasses[0]
    })
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/add', async (req, res) => {
  const teacherID = req.body.teacherID
  const courseID = req.body.courseID
  const startDate = req.body.startDate
  const endDate = req.body.endDate
  const schedule = req.body.schedule

  let missingFields: string[] = []
  if (!teacherID) missingFields.push('teacherID')
  if (!courseID) missingFields.push('courseID')
  if (!startDate) missingFields.push('startDate')
  if (!endDate) missingFields.push('endDate')
  if (!schedule) missingFields.push('schedule')

  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    await db.insert(Classes).values({
      teacherID,
      courseID,
      startDate,
      endDate,
      schedule,
    })

    res.send('Class added')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }

})

expressRouter.post('/edit', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('Class id is required')
    return
  }

  const teacherID = req.body.teacherID
  const courseID = req.body.courseID
  const startDate = req.body.startDate
  const endDate = req.body.endDate
  const schedule = req.body.schedule

  let set1 = {}
  if (teacherID) set1['teacherID'] = teacherID
  if (courseID) set1['courseID'] = courseID
  if (startDate) set1['startDate'] = startDate
  if (endDate) set1['endDate'] = endDate
  if (schedule) set1['schedule'] = schedule

  try {
    if (Object.keys(set1).length > 0) await db.update(Classes).set(set1).where(eq(Classes.id, id))

    res.send('Class updated')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/delete', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('Class id is required')
    return
  }

  try {
    await db.delete(Classes).where(eq(Classes.id, id))

    res.send('Class deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

export const router = expressRouter