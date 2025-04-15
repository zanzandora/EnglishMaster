import { Router } from 'express';
import { eq, not, inArray, isNull, sql, notExists } from 'drizzle-orm';

import {
  Students,
  Classes,
  ClassStudents,
  Courses,
  Teachers,
  Attendances,
} from '../../database/entity';
import { db } from '../../database/driver';

import { authenticateToken } from '../middleware';
import { getTeacherIdByUserId } from '../../helper/getTeacherID';

const expressRouter = Router();

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
        courseName: Courses.name,
      })
      .from(Students)
      .leftJoin(ClassStudents, eq(ClassStudents.studentID, Students.id))
      .leftJoin(Classes, eq(ClassStudents.classID, Classes.id))
      .leftJoin(Courses, eq(Classes.courseID, Courses.id));

    res.json(allStudents);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Thêm endpoint lọc học sinh theo teacher đăng nhập
expressRouter.get('/by-teacher', authenticateToken, async (req, res) => {
  try {
    // Lấy teacherID từ middleware xác thực (đã thêm trước đó)
    const teacherID = req.user.user_id;

    const id = await getTeacherIdByUserId(Number(teacherID));

    // Truy vấn học sinh thuộc các lớp của teacher
    const students = await db
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
        courseName: Courses.name,
      })
      .from(Students)
      .leftJoin(ClassStudents, eq(ClassStudents.studentID, Students.id))
      .leftJoin(Classes, eq(ClassStudents.classID, Classes.id))
      .leftJoin(Teachers, eq(Classes.teacherID, Teachers.id))
      .leftJoin(Courses, eq(Classes.courseID, Courses.id))
      .where(eq(Teachers.id, id));

    res.json(students);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.get('/:id', async (req, res) => {
  const id = req.params.id;

  const missingFields: string[] = [];
  if (!id) missingFields.push('id');
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
    return;
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
        courseName: Courses.name,
        totalAbsences: sql`
        COALESCE(
          (SELECT SUM(CASE WHEN ${Attendances.status} = false THEN 1 ELSE 0 END)
           FROM ${Attendances}
           JOIN ${ClassStudents} ON ${ClassStudents.studentID} = ${Attendances.studentID}
           WHERE ${ClassStudents.studentID} = ${Students.id}),
          0
        )`.as('totalAbsences'),
      })
      .from(Students)
      .leftJoin(ClassStudents, eq(ClassStudents.studentID, Students.id))
      .leftJoin(Classes, eq(ClassStudents.classID, Classes.id))
      .leftJoin(Courses, eq(Classes.courseID, Courses.id))
      .where(eq(Students.id, Number(id)));

    if (selectedStudent.length === 0) {
      res.status(404).send(`Student "${id}" not found`);
      return;
    }

    res.send({
      ...selectedStudent[0],
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/add', async (req, res) => {
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const dateOfBirth = req.body.dateOfBirth;
  const gender = req.body.gender;
  const address = req.body.address;
  const photo = req.body.photo;

  const missingFields: string[] = [];
  if (!name) missingFields.push('name');
  if (!phoneNumber) missingFields.push('phoneNumber');
  if (!email) missingFields.push('email');
  if (!dateOfBirth) missingFields.push('dateOfBirth');
  if (!gender) missingFields.push('gender');
  if (!address) missingFields.push('address');
  if (!photo) missingFields.push('photo');

  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
    return;
  }

  try {
    await db.insert(Students).values({
      name,
      phoneNumber,
      email,
      dateOfBirth,
      gender,
      address,
      photo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.send('Student added');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/edit', async (req, res) => {
  const id = req.body.id;

  if (!id) {
    res.status(400).send('ID is required');
    return;
  }

  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const dateOfBirth = req.body.dateOfBirth;
  const gender = req.body.gender;
  const address = req.body.address;
  const photo = req.body.photo;

  const set = {};
  if (email) set['email'] = email;
  if (name) set['name'] = name;
  if (dateOfBirth) set['dateOfBirth'] = dateOfBirth;
  if (gender) set['gender'] = gender;
  if (phoneNumber) set['phoneNumber'] = phoneNumber;
  if (address) set['address'] = address;
  if (photo) set['photo'] = photo;

  try {
    if (Object.keys(set).length > 0)
      await db.update(Students).set(set).where(eq(Students.id, id));

    res.send('Student updated');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send('ID is required');
    return;
  }

  try {
    const studentInClass = await db
    .select({ className: Classes.name })
    .from(ClassStudents)
    .innerJoin(Classes, eq(ClassStudents.classID, Classes.id))
    .where(eq(ClassStudents.studentID, Number(id)));

  // Nếu học sinh đang trong một lớp nào đó, không cho phép xóa và gửi thông báo
  if (studentInClass.length > 0) {
    res.status(400).send(`Can't delete because this student is enrolled in ${studentInClass[0].className} class.`);
    return;
  }
    await db.delete(Students).where(eq(Students.id, Number(id)));

    res.send('Student deleted');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

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


export const router = expressRouter;
