import { Router } from 'express'
import { eq, sql,and, not, or } from 'drizzle-orm'

import { Classes, Courses, CourseTeachers, Teachers, Users } from '../../database/entity'
import { db } from '../../database/driver'

const expressRouter = Router()

expressRouter.get('/list', async (req, res) => {
  try {
    const allAttendances = await db
  .select({
    id: Teachers.id,
    userID: Teachers.userID,
    userName: Users.username,
    password: Users.password,
    experience: Teachers.experience,
    specialization: Teachers.specialization,
    username: Users.username,
    email: Users.email,
    name: Users.name,
    dateOfBirth: Users.dateOfBirth,
    gender: Users.gender,
    phoneNumber: Users.phoneNumber,
    address: Users.address,
    photo: Users.photo,
  })
  .from(Teachers)
  .innerJoin(Users, eq(Teachers.userID, Users.id));

    res.send(allAttendances)
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.get('/:userID', async (req, res) => {
  const userID = req.params.userID; // Lấy userID từ URL

  if (!userID) {
    return res.status(400).json({ error: "Missing userID" });
  }

  try {
    // Lấy thông tin giáo viên dựa trên userID
    const selectedTeacher = await db
      .select({
        id: Teachers.id,  // Đây là teacherID
        userID: Teachers.userID,
        password: Users.password,
        experience: Teachers.experience,
        specialization: Teachers.specialization,
        username: Users.username,
        email: Users.email,
        name: Users.name,
        dateOfBirth: Users.dateOfBirth,
        gender: Users.gender,
        phoneNumber: Users.phoneNumber,
        address: Users.address,
        photo: Users.photo,
      })
      .from(Users)
      .leftJoin(Teachers, eq(Users.id, Teachers.userID))
      .where(eq(Users.id, Number(userID)))
      .limit(1);

    if (selectedTeacher.length === 0 || !selectedTeacher[0].id) {
      return res.status(404).json({ error: `User with ID "${userID}" not found or is not a teacher` });
    }

    const teacherID = selectedTeacher[0].id; // Lấy teacherID từ kết quả truy vấn

    // Lấy số lượng lớp mà giáo viên phụ trách
    const totalClasses = await db
      .select({ count: sql<number>`COUNT(*)`.as("totalClasses") })
      .from(Classes)
      .where(eq(Classes.teacherID, teacherID));

    // Lấy tổng số khóa học mà giáo viên tham gia
    const totalCourses = await db
      .select({ count: sql<number>`COUNT(DISTINCT courseID)`.as("totalCourses") })
      .from(
        db
          .select({ courseID: Classes.courseID })
          .from(Classes)
          .where(eq(Classes.teacherID, teacherID))
          .union(
            db
              .select({ courseID: CourseTeachers.courseID })
              .from(CourseTeachers)
              .where(eq(CourseTeachers.teacherID, teacherID))
          )
          .as("teacherCourses")
      );

    // Lấy danh sách tên lớp mà giáo viên đang phụ trách
    const classNames = await db
      .select({ name: Classes.name })
      .from(Classes)
      .where(eq(Classes.teacherID, teacherID));

    // Lấy danh sách tên khóa học mà giáo viên tham gia
    const courseNames = await db
      .selectDistinct({ name: Courses.name }) // DISTINCT để loại bỏ trùng lặp
      .from(Courses)
      .leftJoin(Classes, eq(Classes.courseID, Courses.id))
      .leftJoin(CourseTeachers, eq(CourseTeachers.courseID, Courses.id))
      .where(or(eq(Classes.teacherID, teacherID), eq(CourseTeachers.teacherID, teacherID)));

    res.json({
      ...selectedTeacher[0],
      totalClasses: totalClasses[0]?.count || 0,
      totalCourses: totalCourses[0]?.count || 0,
      classNames: classNames.map((c) => c.name),
      courseNames: courseNames.map((c) => c.name),
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});



expressRouter.post('/add', async (req, res) => {
  const { 
    username, password, email, name, phoneNumber, dateOfBirth, gender, address, photo,
    experience, specialization 
  } = req.body;

  const missingFields: string[] = [];
  if (!username) missingFields.push('username');
  if (!password) missingFields.push('password');
  if (!email) missingFields.push('email');
  if (!name) missingFields.push('name');
  if (!phoneNumber) missingFields.push('phoneNumber');
  if (!dateOfBirth) missingFields.push('dateOfBirth');
  if (!gender) missingFields.push('gender');
  if (!address) missingFields.push('address');
  if (!photo) missingFields.push('photo');
  if (!experience) missingFields.push('experience');
  if (!specialization) missingFields.push('specialization');

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
  }

  try {
    // Insert user với role 'teacher' và lấy ID
    const insertedUser = await db
      .insert(Users)
      .values({
        username,
        password,
        email,
        name,
        phoneNumber,
        dateOfBirth,
        gender,
        address,
        photo,
        role: 'teacher', // Mặc định role là 'teacher'
      })
      .$returningId(); // Lấy ID của user vừa tạo

    if (!insertedUser.length) {
      throw new Error('Failed to insert user');
    }

    // Insert teacher với userID đã lấy
    await db.insert(Teachers).values({
      userID: insertedUser[0].id, // Liên kết đúng ID user
      experience,
      specialization,
    });

    res.send({ message: 'Teacher added successfully' });
  } catch (err) {
    res.status(500).send({ error: err.toString() });
  }
});


expressRouter.post('/edit', async (req, res) => {
  const { userName, email, name, age, gender, phoneNumber, address, photo, specialization, experience, password, userID } = req.body;

  if (!userID) {
    return res.status(400).json({ error: 'userID is required' });
  }

  try {
    // 🔹 Lấy thông tin user hiện tại
    const existingUser = await db.select().from(Users).where(eq(Users.id, userID)).limit(1);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = existingUser[0]; // 👉 Lấy phần tử đầu tiên

    // 🔹 Kiểm tra email có bị trùng không nếu email mới khác email cũ
    if (email && email !== user.email) {
      const emailExists = await db.select().from(Users)
        .where(and(eq(Users.email, email), not(eq(Users.id, userID))))
        .limit(1);

      if (emailExists.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // 🔹 Chuẩn bị dữ liệu cập nhật Users
    const set1 = {};
    if (userName) set1.username = userName;
    if (email) set1.email = email;  
    if (name) set1.name = name;
    if (age) set1.age = Number(age);
    if (gender) set1.gender = gender;
    if (phoneNumber) set1.phoneNumber = phoneNumber;
    if (address) set1.address = address;
    if (photo) set1.photo = photo;
    if (password && password.trim() !== "") {
      set1.password = password;
    }

    // 🔹 Chuẩn bị dữ liệu cập nhật Teachers
    const set2 = {};
    if (specialization) set2.specialization = specialization;
    if (experience) set2.experience = Number(experience);

    // 🔹 Cập nhật thông tin trong bảng Users
    if (Object.keys(set1).length > 0) {
      await db.update(Users).set(set1).where(eq(Users.id, userID));
    }

    // 🔹 Cập nhật thông tin trong bảng Teachers
    if (Object.keys(set2).length > 0) {
      await db.update(Teachers).set(set2).where(eq(Teachers.userID, userID));
    }

    res.json({ message: 'Teacher updated successfully' });
  }
  catch (err) {
    console.error('Error updating teacher:', err);
    res.status(500).json({ error: err.toString() });
  }
});


expressRouter.delete('/delete/:userID', async (req, res) => {
  const userID = req.params.userID

  if (!userID) {
    res.status(400).send('userID is required')
    return
  }

  try {
    await db.delete(Users).where(eq(Users.id, Number(userID)))    

    res.send('Teacher deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

export const router = expressRouter