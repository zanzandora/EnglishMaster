import { Router } from 'express'
import { and, eq } from 'drizzle-orm'

import { db } from '../../database/driver'
import { Results } from '../../database/entity'

const expressRouter = Router()

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
  const resultType = req.body.resultType
  const scheduleID = req.body.scheduleID
  const examID = req.body.examID
  const classID = req.body.classID
  const studentID = req.body.studentID
  const score = req.body.score

  let missingFields: string[] = []
  if (!resultType) missingFields.push('resultType')
  if (!scheduleID) missingFields.push('scheduleID')
  if (!examID) missingFields.push('examID')
  if (!classID) missingFields.push('classID')
  if (!studentID) missingFields.push('studentID')
  if (!score) missingFields.push('score')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    await db.insert(Results).values({
      classID,
      examID,
      resultType,
      scheduleID,
      score,
      studentID
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

  const resultType = req.body.resultType
  const scheduleID = req.body.scheduleID
  const examID = req.body.examID
  const classID = req.body.classID
  const studentID = req.body.studentID
  const score = req.body.score

  let set1 = {}
  if (resultType) set1['resultType'] = resultType
  if (scheduleID) set1['scheduleID'] = scheduleID
  if (classID) set1['classID'] = classID
  if (examID) set1['examID'] = examID
  if (studentID) set1['studentID'] = studentID
  if (score) set1['score'] = score

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