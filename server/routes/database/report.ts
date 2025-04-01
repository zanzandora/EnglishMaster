import { Router } from 'express';
import { asc, eq, sql } from 'drizzle-orm';

import { db } from '../../database/driver';
import {
  Attendances,
  Classes,
  ClassStudents,
  Courses,
  Results,
  Students,
  Teachers,
  Users,
} from '../../database/entity';
import { getTeacherIdByUserId } from '../../helper/getTeacherID';

const expressRouter = Router();

expressRouter.get('/list', async (req, res) => {
  const { user_id, role } = req.user;
  const { options, classID } = req.query;

  const teacherID = await getTeacherIdByUserId(Number(user_id));

  try {
    let allReports;

    if (role === 'teacher') {
      // Nếu là admin, trả về tất cả học viên từ tất cả giáo viên
      if (options === 'student') {
        allReports = db
          .select({
            student: {
              studentID: ClassStudents.studentID,
              studentName: Students.name,
              dateOfBirth: Students.dateOfBirth,
              email: Students.email,
            },
            class: {
              classID: Classes.id,
              className: Classes.name,
            },
            score: {
              totalScore: Results.score,
              MT: Results.MT,
              FT: Results.FT,
              status: Results.status,
            },
            attendance: {
              totalCheckins:
                sql`COALESCE(COUNT(${Attendances.studentID}), 0)`.as(
                  'totalCheckins'
                ),
              totalAbsences:
                sql`COALESCE(SUM(CASE WHEN ${Attendances.status} = false THEN 1 ELSE 0 END), 0)`.as(
                  'totalAbsences'
                ),
            },
          })
          .from(ClassStudents)
          .innerJoin(Students, eq(ClassStudents.studentID, Students.id))
          .innerJoin(Classes, eq(ClassStudents.classID, Classes.id))
          .innerJoin(Results, eq(ClassStudents.studentID, Results.studentID))
          .leftJoin(
            Attendances,
            eq(ClassStudents.studentID, Attendances.studentID)
          )
          .where(eq(Classes.teacherID, Number(teacherID)))

          .groupBy(
            ClassStudents.studentID,
            ClassStudents.classID,
            Students.name,
            Students.dateOfBirth,
            Students.email,
            Classes.id,
            Classes.name
          )
          .orderBy(asc(ClassStudents.studentID));
      }
    } else if (options === 'student') {
      allReports = db
        .select({
          student: {
            studentID: ClassStudents.studentID,
            studentName: Students.name,
            dateOfBirth: Students.dateOfBirth,
            email: Students.email,
          },
          class: {
            classID: Classes.id,
            className: Classes.name,
          },
          score: {
            totalScore: Results.score,
            MT: Results.MT,
            FT: Results.FT,
            status: Results.status,
          },
          attendance: {
            totalCheckins: sql`COALESCE(COUNT(${Attendances.studentID}), 0)`.as(
              'totalCheckins'
            ),
            totalAbsences:
              sql`COALESCE(SUM(CASE WHEN ${Attendances.status} = false THEN 1 ELSE 0 END), 0)`.as(
                'totalAbsences'
              ),
          },
        })
        .from(ClassStudents)
        .leftJoin(Students, eq(ClassStudents.studentID, Students.id))
        .leftJoin(Classes, eq(ClassStudents.classID, Classes.id))
        .leftJoin(Results, eq(ClassStudents.studentID, Results.studentID))
        .leftJoin(
          Attendances,
          eq(ClassStudents.studentID, Attendances.studentID)
        )
        .groupBy(
          ClassStudents.studentID,
          ClassStudents.classID,
          Students.name,
          Students.dateOfBirth,
          Students.email,
          Classes.id,
          Classes.name
        )
        .orderBy(asc(ClassStudents.studentID));
    } else if (options === 'course') {
      allReports = db
        .select({
          course: {
            courseID: Courses.id,
            courseName: sql`COALESCE(${Courses.name}, 'No course name')`,
          },
          class: {
            classID: Classes.id,
            classNames:
              sql`GROUP_CONCAT(DISTINCT ${Classes.name} SEPARATOR ', ')`.as(
                'classNames'
              ),
            totalStudents: sql`COUNT(DISTINCT ${ClassStudents.studentID})`.as(
              'totalStudents'
            ),
            teacherNames:
              sql`GROUP_CONCAT(DISTINCT ${Users.name} SEPARATOR  ', ')`.as(
                'teacherNames'
              ),
          },
        })
        .from(Courses)
        .leftJoin(Classes, eq(Courses.id, Classes.courseID))
        .leftJoin(ClassStudents, eq(Classes.id, ClassStudents.classID))
        .leftJoin(Teachers, eq(Classes.teacherID, Teachers.id))
        .leftJoin(Users, eq(Users.id, Teachers.userID))
        .groupBy(Courses.id)
        .orderBy(asc(Courses.id));
    } else {
      return res.status(400).send('Invalid options parameter');
    }

    if (classID) {
      allReports = allReports.where(eq(Classes.id, Number(classID)));
    }

    const results = await allReports;
    res.send(results);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

export const router = expressRouter;
