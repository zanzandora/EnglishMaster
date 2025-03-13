import { Router } from 'express'
import { eq, not, inArray, isNull, sql,notExists } from 'drizzle-orm'

import { Students, Classes, ClassStudents, Courses  } from '../../database/entity'
import { db } from '../../database/driver'

const expressRouter = Router()

expressRouter.get('/list', async (req, res) => {
  try {
    const allStudents = await db
    .select({
      id: Students.id,
      name: Students.name,
      email: Students.email,
      phoneNumber: Students.phoneNumber,
      address: Students.address,
      photo: Students.photo,
      dateOfBirth: Students.dateOfBirth,
      gender: Students.gender,
      className: Classes.name,
      courseName: Courses.name
    })
    .from(Students)
    .leftJoin(ClassStudents, eq(ClassStudents.studentID, Students.id))
    .leftJoin(Classes, eq(ClassStudents.classID, Classes.id))
    .leftJoin(Courses, eq(Classes.courseID, Courses.id));
    
    res.json(allStudents)
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  
  
  const missingFields: string[] = []
  if (!id) missingFields.push('id')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    const selectedStudent = await db
      .select({
        id: Students.id,
        name: Students.name,
        email: Students.email,
        phoneNumber: Students.phoneNumber,
        address: Students.address,
        photo: Students.photo,
        dateOfBirth: Students.dateOfBirth,
        gender: Students.gender,
        className: Classes.name,
        courseName: Courses.name

      })
      .from(Students)
      .leftJoin(ClassStudents, eq(ClassStudents.studentID, Students.id))
      .leftJoin(Classes, eq(ClassStudents.classID, Classes.id))
      .leftJoin(Courses, eq(Classes.courseID, Courses.id))
      .where(eq(Students.id, Number(id)));

    if (selectedStudent.length === 0) {
      res.status(404).send(`Student "${id}" not found`)
      return
    }

    res.send({
      ...selectedStudent[0]
    })
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/add', async (req, res) => {
  const name = req.body.name
  const phoneNumber = req.body.phoneNumber
  const email = req.body.email
  const dateOfBirth = req.body.dateOfBirth
  const gender = req.body.gender
  const address = req.body.address
  const photo = req.body.photo

  const missingFields: string[] = []
  if (!name) missingFields.push('name')
  if (!phoneNumber) missingFields.push('phoneNumber')
  if (!email) missingFields.push('email')
  if (!dateOfBirth) missingFields.push('dateOfBirth')
  if (!gender) missingFields.push('gender')
  if (!address) missingFields.push('address')
  if (!photo) missingFields.push('photo')

  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    await db.insert(Students).values({
      name,
      phoneNumber,
      email,
      dateOfBirth,
      gender,
      address,
      photo
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

  const name = req.body.name
  const phoneNumber = req.body.phoneNumber
  const email = req.body.email
  const dateOfBirth = req.body.dateOfBirth
  const gender = req.body.gender
  const address = req.body.address
  const photo = req.body.photo

  const set = {}
  if (email) set['email'] = email
  if (name) set['name'] = name
  if (dateOfBirth) set['dateOfBirth'] = dateOfBirth
  if (gender) set['gender'] = gender
  if (phoneNumber) set['phoneNumber'] = phoneNumber
  if (address) set['address'] = address
  if (photo) set['photo'] = photo

  try {
    if (Object.keys(set).length > 0) await db.update(Students).set(set).where(eq(Students.id, id))

    res.send('Student updated')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.delete('/delete/:id', async (req, res) => {
  const id = req.params.id

  if (!id) {
    res.status(400).send('ID is required')
    return
  }

  try {
    await db.delete(Students).where(eq(Students.id, Number(id)))

    res.send('Student deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

// *get students per classID
expressRouter.get('/students/:classID', async (req, res) => {
  const { classID } = req.params;

  try {
    const students = await db
      .select({
        studentID: Students.id,
        studentName: Students.name,
        email: Students.email,
        phone: Students.phoneNumber,
        gender: Students.gender,
        dateOfBirth: Students.dateOfBirth,
      })
      .from(ClassStudents)
      .innerJoin(Students, eq(ClassStudents.studentID, Students.id))
      .where(eq(ClassStudents.classID, Number(classID)));

    res.send(students);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// expressRouter.get('/unassigned-students', async (_, res) => {
//   try {
//     const unassignedStudents = await db
//       .select()
//       .from(Students)
//       .leftJoin(ClassStudents, eq(Students.id, ClassStudents.studentID))
//       .where(notExists(ClassStudents.studentID));

//     res.send(unassignedStudents);
//   } catch (err) {
//     res.status(500).send(err.toString());
//   }
// });

export const router = expressRouter