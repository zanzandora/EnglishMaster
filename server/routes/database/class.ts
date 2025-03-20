import { Router } from 'express';
import { and, eq, sql, inArray, desc } from 'drizzle-orm';

import {
  Classes,
  Teachers,
  Courses,
  ClassStudents,
  Users,
  Students,
  Schedule,
  Attendances,
} from '../../database/entity';
import { db } from '../../database/driver';

const expressRouter = Router();

expressRouter.get('/list', async (req, res) => {
  try {
    const studentCounts = db
      .select({
        classID: ClassStudents.classID,
        totalStudents:
          sql<number>`COUNT(DISTINCT ${ClassStudents.studentID})`.as(
            'totalStudents'
          ),
      })
      .from(ClassStudents)
      .groupBy(ClassStudents.classID)
      .as('studentCounts');

    const classSchedule = db
      .select({
        classID: Schedule.classID,
        startDate: sql<Date>`MIN(${Schedule.startDate})`.as('startDate'),
        endDate: sql<Date>`MIN(${Schedule.endDate})`.as('endDate'),
      })
      .from(Schedule)
      .groupBy(Schedule.classID)
      .as('classSchedule');

    let allClasses = await db
      .select({
        id: Classes.id,
        name: Classes.name,
        teacherID: Classes.teacherID,
        courseID: Classes.courseID,
        capacity: Classes.capacity,
        startDate: classSchedule.startDate,
        endDate: classSchedule.endDate,
        teacherName: Users.name,
        courseName: Courses.name,
        totalStudents: studentCounts.totalStudents,
      })
      .from(Classes)
      .innerJoin(Teachers, eq(Classes.teacherID, Teachers.id))
      .innerJoin(Users, eq(Teachers.userID, Users.id))
      .innerJoin(Courses, eq(Classes.courseID, Courses.id))
      .leftJoin(studentCounts, eq(studentCounts.classID, Classes.id))
      .leftJoin(classSchedule, eq(classSchedule.classID, Classes.id))
      .orderBy(desc(Classes.id));

    // Get students assigned to this class
    const studentsData = await db
      .select({
        classID: ClassStudents.classID,
        studentID: Students.id,
        studentName: Students.name,
      })
      .from(ClassStudents)
      .leftJoin(Students, eq(ClassStudents.studentID, Students.id));

    // Group students by classID
    const studentsGrouped = studentsData.reduce((acc, student) => {
      if (!acc[student.classID]) acc[student.classID] = [];
      if (
        !acc[student.classID].some((s) => s.studentID === student.studentID)
      ) {
        acc[student.classID].push(student);
      }
      return acc;
    }, {});

    // Combine class details with students
    const classWithStudents = allClasses.map((cls) => ({
      ...cls,
      students: studentsGrouped[cls.id] || [],
    }));

    res.send(classWithStudents);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.get('/options', async (req, res) => {
  try {
    const classOptions = await db
      .select({
        id: Classes.id,
        name: Classes.name,
      })
      .from(Classes);

    res.send(classOptions);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.get('/', async (req, res) => {
  const courseID = req.body.courseID;
  const teacherID = req.body.teacherID;

  let missingFields: string[] = [];
  if (!courseID) missingFields.push('courseID');
  if (!teacherID) missingFields.push('teacherID');
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
    return;
  }

  try {
    let selectedClasses = await db
      .select()
      .from(Classes)
      .where(
        and(eq(Classes.courseID, courseID), eq(Classes.teacherID, teacherID))
      );

    if (selectedClasses.length === 0) {
      res
        .status(404)
        .send(`Class "${courseID}" with teacher "${teacherID}" not found`);
      return;
    }

    res.send({
      ...selectedClasses[0],
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/add', async (req, res) => {
  const { courseID, teacherID, name, capacity, students } = req.body;

  const missingFields: string[] = [];
  if (!courseID) missingFields.push('courseID');
  if (!teacherID) missingFields.push('teacherID');
  if (!name) missingFields.push('name');
  if (!capacity) missingFields.push('capacity');
  if (!students) missingFields.push('students');

  if (missingFields.length > 0) {
    return res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
  }

  try {
    // Chuyển mảng students từ request thành mảng studentIDs (số)
    const studentIDs = students
      .map((student) => Number(student.studentID || student))
      .filter((id) => !isNaN(id));
    // console.log("Student IDs from request:", studentIDs);

    // Lấy danh sách học viên đã được gán lớp
    const assignedRows = await db
      .select({ studentID: ClassStudents.studentID })
      .from(ClassStudents)
      .where(inArray(ClassStudents.studentID, studentIDs));
    const assignedIDs = assignedRows.map((row) => row.studentID);
    // console.log("Already assigned student IDs:", assignedIDs);

    // Nếu có học viên đã được gán lớp, trả về lỗi để client hiển thị thông báo
    if (assignedIDs.length > 0) {
      return res.status(400).json({
        error: `Students with IDs ${assignedIDs.join(', ')} had assigned`,
      });
    }

    const result = await db
      .insert(Classes)
      .values({
        courseID,
        teacherID,
        name,
        capacity,
      })
      .execute();

    const classID = result[0].insertId;
    // Nếu không có, thêm các bản ghi vào bảng ClassStudents
    await db.insert(ClassStudents).values(
      studentIDs.map((id) => ({
        classID: classID,
        studentID: id,
      }))
    );

    // **🔥 Cập nhật ATTENDANCE cho ngày hiện tại nếu chưa có**
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00

    const todayString = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    for (const studentID of studentIDs) {
      const existingAttendance = await db
        .select()
        .from(Attendances)
        .where(
          and(
      eq(Attendances.studentID, studentID),
      sql`DATE(${Attendances.checkInTime}) = ${todayString}`
          )
        );

      if (existingAttendance.length === 0) {
        // Nếu chưa có bản ghi attendance cho ngày hiện tại
        await db.insert(Attendances).values({
          studentID,
          status: null, // Mặc định là null khi chưa điểm danh
          checkInTime: new Date(todayString),
          createdAt: new Date(),
        });
      } 
    }

    res.send('Class added');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/edit', async (req, res) => {
  const { id, courseID, teacherID, name, capacity, students } = req.body;
  console.log('🔴 API Received:', req.body);

  if (!id) {
    res.status(400).send('Class id is required');
    return;
  }

  const set1 = {};
  if (courseID) set1['courseID'] = courseID;
  if (teacherID) set1['teacherID'] = teacherID;
  if (name) set1['name'] = name;
  if (capacity) set1['capacity'] = capacity;

  try {
    if (Object.keys(set1).length > 0) {
      await db.update(Classes).set(set1).where(eq(Classes.id, id));
    }

    // *2️ Cập nhật danh sách học viên (nếu có)
    if (students !== undefined) {
      if (Array.isArray(students)) {
        // Chuyển mảng students từ request thành mảng studentIDs (số)
        const studentIDs = students
          .map((student) => Number(student.studentID || student))
          .filter((id) => !isNaN(id));

        // Lấy danh sách học viên đã được gán lớp
        const assignedRows = await db
          .select({
            studentID: ClassStudents.studentID,
            classID: ClassStudents.classID,
          })
          .from(ClassStudents)
          .where(inArray(ClassStudents.studentID, studentIDs));
        const assignedOutsideClass = assignedRows
          .filter((row) => row.classID !== id)
          .map((row) => row.studentID);

        // Nếu có học viên đã được gán lớp ngoài class đang edit, trả về lỗi để client hiển thị thông báo
        if (assignedOutsideClass.length > 0) {
          return res.status(400).json({
            error: `Students with IDs ${assignedOutsideClass.join(
              ', '
            )} had assigned`,
          });
        }

        // Get current students in the class
        const currentStudentsRows = await db
          .select({ studentID: ClassStudents.studentID })
          .from(ClassStudents)
          .where(eq(ClassStudents.classID, id));
        const currentStudentIDs = currentStudentsRows.map(
          (row) => row.studentID
        );

        // Determine which students to add and which to remove
        const studentsToAdd = studentIDs.filter(
          (id) => !currentStudentIDs.includes(id)
        );
        const studentsToRemove = currentStudentIDs.filter(
          (id) => !studentIDs.includes(id)
        );

        // Remove students that are no longer in the class
        if (studentsToRemove.length > 0) {
          await db
            .delete(ClassStudents)
            .where(
              and(
                eq(ClassStudents.classID, id),
                inArray(ClassStudents.studentID, studentsToRemove)
              )
            );
        }

        // Add new students to the class
        if (studentsToAdd.length > 0) {
          const newClassStudentsData = studentsToAdd.map((studentID) => ({
            classID: id,
            studentID: studentID,
          }));
          await db.insert(ClassStudents).values(newClassStudentsData);
        }

        // **🔥 Cập nhật ATTENDANCE cho ngày hiện tại nếu chưa có**
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00

        const todayString = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        for (const studentID of studentIDs) {
          const existingAttendance = await db
            .select()
            .from(Attendances)
            .where(
              and(
          eq(Attendances.studentID, studentID),
          sql`DATE(${Attendances.checkInTime}) = ${todayString}`
              )
            );

          if (existingAttendance.length === 0) {
            // Nếu chưa có bản ghi attendance cho ngày hiện tại
            await db.insert(Attendances).values({
              studentID,
              status: null, // Mặc định là null khi chưa điểm danh
              checkInTime: new Date(todayString),
              createdAt: new Date(),
            });
          } 
        }
      } else {
        res.status(400).send('Students must be an array');
        return;
      }
    }

    res.send('Class updated');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send('Class id is required');
    return;
  }

  try {
    await db.delete(Classes).where(eq(Classes.id, Number(id)));

    res.send('Class deleted');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

export const router = expressRouter;
