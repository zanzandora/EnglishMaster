import { Router } from 'express'
import { and, eq } from 'drizzle-orm'

import { Classes, Teachers, Courses, ClassStudents, Users } from '../../database/entity'
import { db } from '../../database/driver'


const expressRouter = Router()

expressRouter.get('/list', async (req, res) => {
  try {
    let allClasses = await db
      .select({
        id: Classes.id,
        className: Classes.name,
        capicity: Classes.capacity,
        startTime: Classes.startTime,
        endTime: Classes.endTime,
        teacherName: Users.name, 
        courseName: Courses.name,
        totalStudents: db.$count(ClassStudents, eq(ClassStudents.classID, Classes.id))
      })
      .from(Classes)
      .innerJoin(Teachers, eq(Classes.teacherID, Teachers.id)) 
      .innerJoin(Users, eq(Teachers.userID, Users.id))
      .innerJoin(Courses, eq(Classes.courseID, Courses.id));

    res.send(allClasses)
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

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
  let courseID = req.body.courseID
  let teacherID = req.body.teacherID
  let name = req.body.name
  let capacity = req.body.capacity
  let startTime = req.body.startTime
  let endTime = req.body.endTime

  let missingFields: string[] = []
  if (courseID) missingFields.push('courseID')
  if (teacherID) missingFields.push('teacherID')
  if (name) missingFields.push('name')
  if (capacity) missingFields.push('capacity')
  if (startTime) missingFields.push('startTime')
  if (endTime) missingFields.push('endTime')

  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    await db.insert(Classes).values({
      courseID,
      teacherID,
      name,
      capacity,
      startTime,
      endTime
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

  const courseID = req.body.courseID
  const teacherID = req.body.teacherID
  const name = req.body.name
  const capacity = req.body.capacity
  const startTime = req.body.startTime
  const endTime = req.body.endTime

  let set1 = {}
  if (courseID) set1['courseID'] = courseID
  if (teacherID) set1['teacherID'] = teacherID
  if (name) set1['name'] = name
  if (capacity) set1['capacity'] = capacity
  if (startTime) set1['startTime'] = startTime
  if (endTime) set1['endTime'] = endTime

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