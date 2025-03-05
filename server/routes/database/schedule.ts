import { Router } from 'express'
import { eq } from 'drizzle-orm'

import { Schedule } from '../../database/entity'
import { db } from '../../database/driver'

const expressRouter = Router()

expressRouter.get('/list', async (req, res) => {
  try {
    let allSchedule = await db.select().from(Schedule)

    res.send(allSchedule)
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
    let selectedSchedule = await db.select().from(Schedule).where((eq(Schedule.id, id)))

    if (selectedSchedule.length === 0) {
      res.status(404).send(`Student "${id}" not found`)
      return
    }

    res.send({
      ...selectedSchedule[0]
    })
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/add', async (req, res) => {
  const classID = req.body.classID
  const sessionDate = req.body.sessionDate
  const startTime = req.body.startTime
  const endTime = req.body.endTime
  const location = req.body.location

  let missingFields: string[] = []
  if (!classID) missingFields.push('classID')
  if (!sessionDate) missingFields.push('sessionDate')
  if (!startTime) missingFields.push('startTime')
  if (!endTime) missingFields.push('endTime')
  if (!location) missingFields.push('location')

  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    await db.insert(Schedule).values({
      classID,
      sessionDate,
      startTime,
      endTime,
      location,
    })

    res.send('Student added')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }

})

expressRouter.post('/edit', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('ID is required')
    return
  }

  const classID = req.body.classID
  const sessionDate = req.body.sessionDate
  const startTime = req.body.startTime
  const endTime = req.body.endTime
  const location = req.body.location

  let set = {}
  if (classID) set['classID'] = classID
  if (sessionDate) set['sessionDate'] = sessionDate
  if (startTime) set['startTime'] = startTime
  if (endTime) set['endTime'] = endTime
  if (location) set['location'] = location

  try {
    if (Object.keys(set).length > 0) await db.update(Schedule).set(set).where(eq(Schedule.id, id))

    res.send('Student updated')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/delete', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('ID is required')
    return
  }

  try {
    await db.delete(Schedule).where(eq(Schedule.id, id))

    res.send('Student deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

export const router = expressRouter