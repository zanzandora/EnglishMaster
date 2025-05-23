import { Router } from 'express';
import multer from 'multer';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { eq } from 'drizzle-orm';
import path from 'path';

import {
  Classes,
  Courses,
  Exams,
  Teachers,
  Users,
} from '../../database/entity';
import { db } from '../../database/driver';
import { getTeacherIdByUserId } from '../../helper/getTeacherID';

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.BUCKET_PRIVATE_ACCESS_KEY!,
  },
  region: process.env.BUCKET_REGION!,
});

const expressRouter = Router();

expressRouter.get('/list', async (req, res) => {
  try {
    let allExams = await db
      .select({
        id: Exams.id,
        title: Exams.title,
        source: Exams.file_url,
        course: Courses.name,
        class: Classes.name,
        teacher: Users.name,
      })
      .from(Exams)
      .innerJoin(Classes, eq(Exams.classID, Classes.id))
      .innerJoin(Courses, eq(Classes.courseID, Courses.id))
      .innerJoin(Teachers, eq(Classes.teacherID, Teachers.id))
      .innerJoin(Users, eq(Teachers.userID, Users.id))
      .orderBy(Exams.id);

    res.send(allExams);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.get('/download/:key', async (req, res) => {
  const key = decodeURIComponent(req.params.key);

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
  });

  try {
    const { Body, ContentType } = await s3.send(command);

    // Thiết lập headers chuẩn
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${path.basename(key)}"`
    );
    res.setHeader('Content-Type', ContentType || 'application/octet-stream');

    // Stream trực tiếp từ S3 -> Client
    (Body as NodeJS.ReadableStream).pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Error downloading file');
  }
});

expressRouter.get('/:userID', async (req, res) => {
  const userID = req.params.userID;
  const teacherId = await getTeacherIdByUserId(Number(userID));

  let missingFields: string[] = [];
  if (!userID) missingFields.push('id');
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
    return;
  }

  try {
    let selectedExams = await db
      .select({
        title: Exams.title,
        source: Exams.file_url,
        course: Courses.name,
        class: Classes.name,
        teacher: Users.name,
      })
      .from(Exams)
      .where(eq(Teachers.id, teacherId))
      .innerJoin(Classes, eq(Exams.classID, Classes.id))
      .innerJoin(Courses, eq(Classes.courseID, Courses.id))
      .innerJoin(Teachers, eq(Classes.teacherID, Teachers.id))
      .innerJoin(Users, eq(Teachers.userID, Users.id));

    if (selectedExams.length === 0) {
      res.status(404).send(`Exam of user "${userID}" not found`);
      return;
    }

    res.send(selectedExams);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/add', upload.single('file'), async (req, res) => {
  const title = req.body.title;
  const classID = req.body.classID;
  const file = req.file;

  let missingFields: string[] = [];
  if (!title) missingFields.push('title');
  if (!classID) missingFields.push('classID');
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
    return;
  }

  if (!file) {
    res.status(400).send(`Please specific a file`);
    return;
  }

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: req.file?.originalname,
      Body: req.file?.buffer,
      ContentType: req.file?.mimetype,
    });
    await s3.send(command);

    await db.insert(Exams).values({
      title,
      classID,
      file_size: +file?.size!,
      file_type: path.extname(file.originalname),
      file_url: `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${req.file?.originalname}`,
    });

    res.send('Exam added');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/edit', upload.single('file'), async (req, res) => {
  const id = req.body.id;

  if (!id) {
    res.status(400).send('Exam id is required');
    return;
  }

  const title = req.body.title;
  const classID = req.body.classID;
  const file = req.file;

  let set1 = {};
  if (title) set1['title'] = title;
  if (classID) set1['classID'] = classID;

  try {
    if (Object.keys(set1).length > 0)
      await db.update(Exams).set(set1).where(eq(Exams.id, id));

    res.send('Exam updated');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send('Exam id is required');
    return;
  }

  try {
    await db.delete(Exams).where(eq(Exams.id, Number(id)));

    res.send('Exam deleted');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

export const router = expressRouter;
