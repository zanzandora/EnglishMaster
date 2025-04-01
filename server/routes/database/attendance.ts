import { Router } from 'express'
import { and, eq,sql  } from 'drizzle-orm'

import { Attendances, Classes, ClassStudents, Students, Teachers, Users } from '../../database/entity'
import { db } from '../../database/driver'
import { getTeacherIdByUserId } from '../../helper/getTeacherID'
import { authenticateToken } from '../middleware'

const expressRouter = Router()

expressRouter.get('/current-teacher', async (req, res) => {
  console.log("User from token:", req.user);
  const userID = req.user.user_id;
  console.log(userID);

  if (!userID || isNaN(Number(userID))) {
    return res.status(400).send("Invalid user ID");
  }
  
  let teacherRecords = await getTeacherIdByUserId(userID);
  console.log(teacherRecords);
  
  if (!teacherRecords || isNaN(Number(teacherRecords))) {
    return res.status(404).send("Teacher not found or invalid teacher ID");
  }

  

  try {
    const teacher = await db
      .select({
        teacherID: Teachers.id,
        teacherName: Users.name,
      })
      .from(Teachers)
      .leftJoin(Users, eq(Teachers.userID, Users.id))
      .where(eq(Teachers.id, Number(teacherRecords)));

    if (teacher.length === 0) {
      return res.status(404).send(`No teacher found with ID "${teacherRecords}"`);
    }

    res.send({ 
      teacher: {
        teacherID: teacher[0].teacherID,
        teacherName: teacher[0].teacherName
      }
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.get('/list', async (req, res) => {
  try {
    const allAttendances = await db
      .select({
        id: Attendances.id,
        checkInTime: Attendances.checkInTime,
        note: Attendances.note,
        status: Attendances.status,
        student: {
          studentID: Students.id,
          studentName: Students.name,
          dateOfBirth: Students.dateOfBirth,
        },
        class: {
          classID: Classes.id,
          className: Classes.name,
        },
        teacher: {
          teacherID: Teachers.id,
          teacherName: Users.name,
        },
        totalCheckins: sql`COALESCE(COUNT(${sql.raw('att_check.studentID')}), 0)`.as("totalCheckins"),
        
      })
      .from(ClassStudents) 
      .leftJoin(Students, eq(ClassStudents.studentID, Students.id)) 
      .leftJoin(Classes, eq(ClassStudents.classID, Classes.id)) 
      .leftJoin(Teachers, eq(Classes.teacherID, Teachers.id)) 
      .leftJoin(Users, eq(Teachers.userID, Users.id)) 
      .leftJoin(Attendances, eq(ClassStudents.studentID, Attendances.studentID)) 
      .leftJoin(
        db
          .select({
            studentID: Attendances.studentID,
          })
          .from(Attendances)
          .where(eq(Attendances.status, true))
          .as("att_check"),
        eq(ClassStudents.studentID, sql`att_check.studentID`)
      )
      .groupBy(
        ClassStudents.studentID,
        ClassStudents.classID,
        Students.id,
        Classes.id,
        Teachers.id,
        Users.id,
        Attendances.id
      );

    res.send(allAttendances);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.get('/list-today',authenticateToken, async (req, res) => {
  try {
    const userID = req.user.user_id; 

    let teacherID = await getTeacherIdByUserId(Number(userID));
      
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00 để so sánh ngày
    console.log(today);

    // Lấy ngày hiện tại theo định dạng yyyy-mm-dd
    const todayString = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0]; // Adjust for timezone offset
    console.log(todayString);

    // Kiểm tra xem có attendance cho ngày hôm nay không
    const existingAttendances = await db
      .select({
        id: Attendances.id,
      })
      .from(Attendances)
      .where(sql`DATE(${Attendances.checkInTime}) = DATE(${sql.param(todayString)})`); // So sánh chỉ ngày

      if (existingAttendances.length === 0) {
      // Lọc students theo teacher (nếu có)
      let studentsQuery = db
        .select({ id: Students.id })
        .from(Students)
        .leftJoin(ClassStudents, eq(Students.id, ClassStudents.studentID))
        .leftJoin(Classes, eq(ClassStudents.classID, Classes.id))
        .where(eq(Classes.teacherID, teacherID));

      const students = await studentsQuery.execute();

      const newAttendances = students.map(student => ({
        studentID: student.id,
        checkInTime: new Date(todayString), // Đảm bảo checkInTime là ngày hiện tại
        status: null, // Đặt status là NULL khi chưa điểm danh
        note: '',
      }));

      await db.insert(Attendances).values(newAttendances);
    }

    const todayAttendances = await db
      .select({
        id: Attendances.id,
        checkInTime: Attendances.checkInTime,
        note: Attendances.note,
        status: Attendances.status,
        student: {
          studentID: Students.id,
          studentName: Students.name,
          dateOfBirth: Students.dateOfBirth,
        },
        class: {
          classID: Classes.id,
          className: Classes.name,
        },
        teacher: {
          teacherID: Teachers.id,
          teacherName: Users.name,
        },
      })
      .from(ClassStudents)
      .leftJoin(Students, eq(ClassStudents.studentID, Students.id))
      .leftJoin(Classes, eq(ClassStudents.classID, Classes.id))
      .leftJoin(Teachers, eq(Classes.teacherID, Teachers.id))
      .leftJoin(Users, eq(Teachers.userID, Users.id))
      .leftJoin(Attendances, eq(ClassStudents.studentID, Attendances.studentID))
      .where(
        and(
          sql`DATE(${Attendances.checkInTime}) = DATE(${sql.param(todayString)})`, // Lọc theo ngày hôm nay
          eq(Classes.teacherID, teacherID) // Lọc theo teacherID
        )
      );

    res.send(todayAttendances);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});


expressRouter.get('/:studentID', async (req, res) => {
  const studentID = req.params.studentID;

  if (!studentID) {
    res.status(400).send('Student ID is required');
    return;
  }

  try {
    const attendanceRecords = await db
      .select({
        id: Attendances.id,
        checkInTime: Attendances.checkInTime,
        status: sql`COALESCE(Attendances.status, NULL)`.as("status"), 
        note: Attendances.note,
        student: {
          studentID: Students.id,
          studentName: Students.name,
          dateOfBirth: Students.dateOfBirth,
        },
      })
      .from(ClassStudents) 
      .leftJoin(Students, eq(ClassStudents.studentID, Students.id)) 
      .leftJoin(Attendances, eq(ClassStudents.studentID, Attendances.studentID)) 
      .where(eq(ClassStudents.studentID, Number(studentID)));

    if (attendanceRecords.length === 0) {
      res.status(404).send(`No attendance records found for student ID "${studentID}"`);
      return;
    }

    res.send(attendanceRecords);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.post('/add', async (req, res) => {
  const { studentID, status, note } = req.body;

  if (!studentID || typeof status !== 'boolean') {
    return res.status(400).send('Thiếu dữ liệu');
  }

  try {
    await db.insert(Attendances).values({
      studentID,
      checkInTime: new Date(), // Tạo thời gian mới
      status,
      note: note || "",
    });

    res.send('Điểm danh thành công');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});


expressRouter.post('/edit', async (req, res) => {
  const { studentID, status, note } = req.body;

  if (!studentID || !status) {
    return res.status(400).send('Student ID và Status là bắt buộc');
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00 for date comparison

    await db.update(Attendances)
      .set({ status, note })
      .where(and(
        eq(Attendances.studentID, studentID),
        sql`DATE(${Attendances.checkInTime}) = DATE(NOW())`
      ));

    res.send('Attendance updated');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});


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

function partitionBy(studentID: MySqlColumn<{ name: "studentID"; tableName: "class_students"; dataType: "number"; columnType: "MySqlInt"; data: number; driverParam: string | number; notNull: true; hasDefault: false; isPrimaryKey: true; isAutoincrement: false; hasRuntimeDefault: false; enumValues: undefined; baseColumn: never; identity: undefined; generated: undefined }, {}, {}>): any {
  throw new Error('Function not implemented.')
}
