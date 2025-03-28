import { Router } from 'express';
import { asc, eq, desc } from 'drizzle-orm';

import { db } from '../../database/driver';
import {
  Classes,
  ClassStudents,
  Courses,
  Results,
  Students,
} from '../../database/entity';
import { getTeacherIdByUserId } from '../../helper/getTeacherID';

const expressRouter = Router();

expressRouter.get('/list', async (req, res) => {
  const { teacherID } = req.query;
  try {
    let allResults = db
      .select({
        id: Results.id,
        student: {
          studentID: Results.studentID,
          studentName: Students.name,
          dateOfBirth: Students.dateOfBirth,
          email: Students.email,
        },
        className: Classes.name,
        courseName: Courses.name,
        score: Results.score,
        MT: Results.MT,
        FT: Results.FT,
        status: Results.status,
        createdAt: Results.createdAt,
        updatedAt: Results.updatedAt,
      })
      .from(Results)
      .orderBy(desc(Classes.id))
      .innerJoin(Students, eq(Results.studentID, Students.id))
      .innerJoin(ClassStudents, eq(Results.studentID, ClassStudents.studentID))
      .innerJoin(Classes, eq(ClassStudents.classID, Classes.id))
      .innerJoin(Courses, eq(Classes.courseID, Courses.id))

    if (teacherID) {
      const teacherId = await getTeacherIdByUserId(Number(teacherID));

      allResults = allResults.where(eq(Classes.teacherID, Number(teacherId)));
    }
    const results = await allResults;
    res.send(results);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.get('/', async (req, res) => {
  const id = req.body.id;

  let missingFields: string[] = [];
  if (!id) missingFields.push('id');
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
    return;
  }

  try {
    let selectedResults = await db
      .select()
      .from(Results)
      .where(eq(Results.id, id));

    if (selectedResults.length === 0) {
      res.status(404).send(`Result "${id}" not found`);
      return;
    }

    res.send({
      ...selectedResults[0],
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/add', async (req, res) => {
  const examID = req.body.examID;
  const studentID = req.body.studentID;
  const score = req.body.score;
  const status = req.body.status;

  let missingFields: string[] = [];
  if (!examID) missingFields.push('examID');
  if (!studentID) missingFields.push('studentID');
  if (!score) missingFields.push('score');
  if (!status) missingFields.push('status');
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
    return;
  }

  try {
    await db.insert(Results).values({
      examID,
      studentID,
      score,
      status,
    });

    res.send('Result added');
  } catch (err) {
    console.log(err);
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/edit', async (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.status(400).send('Result id is required');
  }

  try {
    // Lấy giá trị MT và FT từ request body
    const MT = parseInt(req.body.MT);
    const FT = parseInt(req.body.FT);

    // Validate MT và FT
    if (isNaN(MT)) return res.status(400).send('MT must be a number');
    if (isNaN(FT)) return res.status(400).send('FT must be a number');
    if (MT < 0 || MT > 100 || FT < 0 || FT > 100) {
      return res.status(400).send('Scores must be between 0-100');
    }

    // Tính toán score và status
    const score = Math.round((MT + FT) / 2);
    const status: 'passed' | 'failed' = score >= 50 ? 'passed' : 'failed';

    // Tạo object cập nhật
    const updateData = {
      MT,
      FT,
      score,
      status,
      updatedAt: new Date(),
    };

    // Thực hiện cập nhật
    await db.update(Results).set(updateData).where(eq(Results.id, id));

    res.send(updateData);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/delete', async (req, res) => {
  const id = req.body.id;

  if (!id) {
    res.status(400).send('Result id is required');
    return;
  }

  try {
    await db.delete(Results).where(eq(Results.id, id));

    res.send('Result deleted');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

export const router = expressRouter;
