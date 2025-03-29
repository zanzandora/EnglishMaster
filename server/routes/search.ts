import { Router } from 'express';
import { asc, eq, and, sql, or, like } from 'drizzle-orm';

import { db } from '../database/driver';
import {
  Attendances,
  Classes,
  ClassStudents,
  Courses,
  Results,
  Schedule,
  Students,
  Teachers,
  Users,
} from '../database/entity';
import { getTeacherIdByUserId } from '../helper/getTeacherID';

const expressRouter = Router();

expressRouter.get('/global', async (req, res) => {
  const { user_id, role } = req.user;
    const teacherID = await getTeacherIdByUserId(Number(user_id));
  
  const { q: searchQuery, page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    if (!searchQuery || typeof searchQuery !== 'string') {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const searchPattern = `%${searchQuery}%`;

    const classSchedule = db
      .select({
        classID: Schedule.classID,
        startDate: sql<Date>`MIN(${Schedule.startDate})`.as('startDate'),
        endDate: sql<Date>`MIN(${Schedule.endDate})`.as('endDate'),
      })
      .from(Schedule)
      .groupBy(Schedule.classID)
      .as('classSchedule');

    // Tối ưu bằng Promise.all và thêm các trường tìm kiếm
    if (role === 'admin') {
      const [students, teachers, classes, courses] = await Promise.all([
        // Students
        db
          .select()
          .from(Students)
          .where(
            or(
              like(Students.id, searchPattern),
              like(Students.name, searchPattern),
              like(Students.email, searchPattern)
            )
          )
          .limit(Number(limit))
          .offset(offset),

        // Teachers
        db
          .select({
            teacher: Teachers,
            user: Users,
          })
          .from(Teachers)
          .innerJoin(Users, eq(Teachers.userID, Users.id))
          .where(
            or(
              like(Teachers.id, searchPattern),
              like(Users.name, searchPattern),
              like(Users.email, searchPattern)
            )
          )
          .limit(Number(limit))
          .offset(offset),

        // Classes
        db
          .select({
            id: Classes.id,
            name: Classes.name,
            startDate: classSchedule.startDate,
            endDate: classSchedule.endDate,
          })
          .from(Classes)
          .leftJoin(classSchedule, eq(classSchedule.classID, Classes.id))
          .where(
            or(
              like(Classes.id, searchPattern),
              like(Classes.name, searchPattern)
            )
          )
          .limit(Number(limit))
          .offset(offset),

        // Courses
        db
          .select()
          .from(Courses)
          .where(
            or(
              like(Courses.id, searchPattern),
              like(Courses.name, searchPattern)
            )
          )
          .limit(Number(limit))
          .offset(offset),
      ]);

      res.json({
        meta: {
          page,
          limit,
          total:
            students.length + teachers.length + classes.length + courses.length,
        },
        results: { students, teachers, classes, courses },
      });
    } else {
      const [students, classes] = await Promise.all([
        // Students in teacher's classes
        db
          .select({name: Students.name, id: Students.id, email: Students.email})
          .from(Students)
          .innerJoin(ClassStudents, eq(Students.id, ClassStudents.studentID))
          .innerJoin(
            Classes,
            and(
              eq(ClassStudents.classID, Classes.id),
              eq(Classes.teacherID, teacherID)
            )
          )
          .where(
            or(
              like(Students.id, searchPattern),
              like(Students.name, searchPattern)
            )
          ),

        // Teacher's classes
        db
          .select({
            id: Classes.id,
            name: Classes.name,
            startDate: classSchedule.startDate,
            endDate: classSchedule.endDate,
          })
          .from(Classes)
          .leftJoin(classSchedule, eq(classSchedule.classID, Classes.id))
          .where(
            and(
              eq(Classes.teacherID, teacherID),
              or(
                like(Classes.id, searchPattern),
                like(Classes.name, searchPattern)
              )
            )
          ),
      ]);

      res.json({
        meta: {
          page,
          limit,
          total:
            students.length + classes.length 
        },
        results: { students,  classes },
      });
    }
  } catch (err) {
    console.error('Global search error:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : null,
    });
  }
});

export const router = expressRouter;
