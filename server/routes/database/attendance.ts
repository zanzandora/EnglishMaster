import { Router } from 'express'
import { and, eq } from 'drizzle-orm'

import { Attendances, Classes, ClassStudents, Schedule, Students, Teachers, Users } from '../../database/entity'
import { db } from '../../database/driver'

const expressRouter = Router()

expressRouter.get('/list', async (req, res) => {
  try {
    const allAttendances = await db
  .select({
    id: Attendances.id,
    scheduleID: Attendances.scheduleID,
    checkInTime: Attendances.checkInTime,
    note: Attendances.note,
    status: Attendances.status,
    student: {
      studentID: ClassStudents.studentID,  
      studentName: Students.name,
      dateOfBirth: Students.dateOfBirth,
    },
    class:{
      classID: ClassStudents.classID,
      className: Classes.name,
    },
    teacher: {
      teacherID: Classes.teacherID,
      teacherName: Users.name,
    }
  })
  .from(Attendances)
  .leftJoin(ClassStudents, eq(Attendances.studentID, ClassStudents.studentID))
  .leftJoin(Students, eq(ClassStudents.studentID, Students.id))
  .leftJoin(Schedule, eq(Attendances.scheduleID, Schedule.id))
  .leftJoin(Classes, eq(Schedule.classID, Classes.id))
  .leftJoin(Teachers, eq(Classes.teacherID, Teachers.id))
  .leftJoin(Users, eq(Teachers.userID, Users.id));

    res.send(allAttendances)
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.get('/', async (req, res) => {
  const classID = req.body.classID
  const studentID = req.body.studentID

  let missingFields: string[] = []
  if (!classID) missingFields.push('classID')
  if (!studentID) missingFields.push('studentID')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    let selectedAttendances = await db.select().from(Attendances).where(and(eq(Attendances.classID, classID), eq(Attendances.studentID, studentID)))

    if (selectedAttendances.length === 0) {
      res.status(404).send(`Attendance with "${classID}" and student "${studentID}" not found`)
      return
    }

    res.send({
      ...selectedAttendances[0]
    })
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/add', async (req, res) => {
  const classID = req.body.classID
  const studentID = req.body.studentID
  const status = req.body.status
  const scheduleID = req.body.scheduleID
  const teacherID = req.body.teacherID
  const checkInTime = req.body.checkInTime

  let missingFields: string[] = []
  if (!classID) missingFields.push('classID')
  if (!studentID) missingFields.push('studentID')
  if (!scheduleID) missingFields.push('scheduleID')
  if (!teacherID) missingFields.push('teacherID')
  if (!status) missingFields.push('status')
  if (!checkInTime) missingFields.push('checkInTime')

  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    await db.insert(Attendances).values({
      classID,
      studentID,
      scheduleID,
      teacherID,
      checkInTime,
      status,
    })

    res.send('Attendance added')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }

})

expressRouter.post('/edit', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('Attendance id is required')
    return
  }

  const classID = req.body.classID
  const studentID = req.body.studentID
  const status = req.body.status
  const scheduleID = req.body.scheduleID
  const teacherID = req.body.teacherID
  const checkInTime = req.body.checkInTime

  let set1 = {}
  if (classID) set1['classID'] = classID
  if (studentID) set1['studentID'] = studentID
  if (status) set1['status'] = status
  if (scheduleID) set1['scheduleID'] = scheduleID
  if (teacherID) set1['teacherID'] = teacherID
  if (checkInTime) set1['checkInTime'] = checkInTime

  try {
    if (Object.keys(set1).length > 0) await db.update(Attendances).set(set1).where(eq(Attendances.id, id))

    res.send('Attendance updated')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/delete', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('Attendance id is required')
    return
  }

  try {
    await db.delete(Attendances).where(eq(Attendances.id, id))

    res.send('Attendance deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

export const router = expressRouter