import { Router } from 'express';
import { eq,and, sql } from 'drizzle-orm';

import {
  Schedule,
  Classes,
  Users,
  Teachers,
  Courses,
} from '../../database/entity';
import { db } from '../../database/driver';

const expressRouter = Router();

expressRouter.get('/list', async (req, res) => {
  try {
    let allSchedule = await db
      .select({
        id: Schedule.id,
        classID: Schedule.classID,
        type: Schedule.type,
        repeatRule: Schedule.repeatRule,
        daysOfWeek: Schedule.daysOfWeek,
        startTime: Schedule.startTime,
        endTime: Schedule.endTime,
        startDate: Schedule.startDate,
        endDate: Schedule.endDate,
        room: Schedule.room,
        class: {
          classID: Classes.id,
          className: Classes.name,
          teacherID: Classes.teacherID,
        },
        teacher: {
          userID: Teachers.userID,
          teacherName: Users.name,
        },
        course: {
          courseID: Courses.id,
          courseName: Courses.name,
        },
      })
      .from(Schedule)
      .leftJoin(Classes, eq(Schedule.classID, Classes.id))
      .leftJoin(Teachers, eq(Classes.teacherID, Teachers.id))
      .leftJoin(Users, eq(Teachers.userID, Users.id))
      .leftJoin(Courses, eq(Classes.courseID, Courses.id));

    res.send(allSchedule);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/check-conflict', async (req, res) => {
  const { classID, startDate, endDate, startTime, endTime, type } = req.body;

  if (!classID || !startDate || !endDate || !startTime || !endTime) {
    return res.status(400).send('Thiếu thông tin yêu cầu');
  }

  try {
    const conflicts = await db
      .select()
      .from(Schedule)
      .where(
        and(
          eq(Schedule.classID, classID),
          and(
            sql`${Schedule.startDate} <= ${endDate}`,
            sql`${Schedule.endDate} >= ${startDate}`
          ),
          and(
            sql`${Schedule.startTime} <= ${endTime}`,
            sql`${Schedule.endTime} >= ${startTime}`
          )
        )
      );

    if (conflicts.length > 0) {
      return res.status(409).send(`Lớp này đã có lịch ${conflicts[0].type === 'exam' ? 'thi' : 'học'} trong khoảng thời gian này!`);
    }

    res.send({ message: 'Không có xung đột' });
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
    let selectedSchedule = await db
      .select()
      .from(Schedule)
      .where(eq(Schedule.id, id));

    if (selectedSchedule.length === 0) {
      res.status(404).send(`Student "${id}" not found`);
      return;
    }

    res.send({
      ...selectedSchedule[0],
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/add', async (req, res) => {
  const {
    classID,
    type,
    repeatRule,
    daysOfWeek,
    startDate,
    endDate,
    startTime,
    endTime,
    room,
  } = req.body;

  // Kiểm tra thiếu trường
  const missingFields: string[] = [];
  if (!classID) missingFields.push('classID');
  if (!type) missingFields.push('type');
  if (!repeatRule) missingFields.push('repeatRule');
  if (!daysOfWeek) missingFields.push('daysOfWeek');
  if (!startDate) missingFields.push('startDate');
  if (!endDate) missingFields.push('endDate');
  if (!startTime) missingFields.push('startTime');
  if (!endTime) missingFields.push('endTime');
  if (!room && room !== 0) missingFields.push('room');
  // (trường hợp room = 0 vẫn hợp lệ, nên check kỹ)

  if (missingFields.length > 0) {
    return res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
  }

  try {
    await db.insert(Schedule).values({
      classID,
      type,
      repeatRule,
      daysOfWeek,
      startDate,
      endDate,
      startTime,
      endTime,
      room,
    });

    res.send('Schedule added successfully');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/edit', async (req, res) => {
  const {
    id,
    classID,
    type,
    repeatRule,
    daysOfWeek,
    startDate,
    endDate,
    startTime,
    endTime,
    room,
  } = req.body;

  const missingFields: string[] = [];
  if (!id) missingFields.push('id');
  if (!classID) missingFields.push('classID');
  if (!type) missingFields.push('type');
  if (!repeatRule) missingFields.push('repeatRule');
  if (!daysOfWeek) missingFields.push('daysOfWeek');
  if (!startDate) missingFields.push('startDate');
  if (!endDate) missingFields.push('endDate');
  if (!startTime) missingFields.push('startTime');
  if (!endTime) missingFields.push('endTime');
  if (!room && room !== 0) missingFields.push('room');

  if (missingFields.length > 0) {
    return res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
  }

  let set: any = {};
  if (classID) set['classID'] = classID;
  if (type) set['type'] = type;
  if (repeatRule) set['repeatRule'] = repeatRule;
  if (daysOfWeek) set['daysOfWeek'] = daysOfWeek;
  if (startDate) set['startDate'] = startDate;
  if (endDate) set['endDate'] = endDate;
  if (startTime) set['startTime'] = startTime;
  if (endTime) set['endTime'] = endTime;
  if (room || room === 0) set['room'] = room;

  try {
    if (Object.keys(set).length > 0)
      await db.update(Schedule).set(set).where(eq(Schedule.id, id));

    res.send('Schedule updated');
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
    await db.delete(Schedule).where(eq(Schedule.id, Number(id)));

    res.send('Schedule deleted');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});




export const router = expressRouter;
