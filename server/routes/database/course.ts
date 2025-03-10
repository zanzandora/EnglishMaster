import { Router } from 'express'
import { and, eq } from 'drizzle-orm'

import { Courses, Teachers, Users, CourseTeachers } from '../../database/entity'
import { db } from '../../database/driver'

const expressRouter = Router()

expressRouter.get('/list', async (req, res) => {
  try {
    // Lấy danh sách khóa học
    const allCourses = await db
      .select()
      .from(Courses);

    // Lấy danh sách giáo viên theo từng khóa học từ bảng CourseTeachers
    
    const teachersData = await db
      .select({
        courseID: CourseTeachers.courseID,
        teacherId: Teachers.id,
        teacherName: Users.name,
      })
      .from(CourseTeachers)
      .leftJoin(Teachers, eq(CourseTeachers.teacherID, Teachers.id))
      .leftJoin(Users, eq(Teachers.userID, Users.id));

    // Nhóm giáo viên theo courseID
    const teachersGrouped = teachersData.reduce((acc, teacher) => {
      if (!acc[teacher.courseID]) acc[teacher.courseID] = [];
      if (!acc[teacher.courseID].some(t => t.teacherId === teacher.teacherId)) {
        acc[teacher.courseID].push(teacher);
      }
      return acc;
    }, {});

    // Gộp dữ liệu khóa học với giáo viên
    const coursesWithTeachers = allCourses.map((course) => ({
      ...course,
      teachers: teachersGrouped[course.id] || [],
    }));

    res.send(coursesWithTeachers);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.get('/', async (req, res) => {
  const name = req.body.name

  let missingFields: string[] = []
  if (!name) missingFields.push('name')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    let selectedCourses = await db.select().from(Courses).where(and(eq(Courses.name, name)))

    if (selectedCourses.length === 0) {
      res.status(404).send(`Course "${name}" not found`)
      return
    }

    res.send({
      ...selectedCourses[0]
    })
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/add', async (req, res) => {
  const { name, description, duration, fee, teachers } = req.body;

  const missingFields: string[] = [];
  if (!name) missingFields.push('name');
  if (!duration) missingFields.push('duration');
  if (!fee) missingFields.push('fee');
  if (!teachers) missingFields.push('teachers');

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
  }

  try {
    // *1️ Thêm khóa học vào bảng COURSE và lấy courseID
    const [newCourse] = await db.insert(Courses).values({
      name,
      description,
      duration,
      fee,
    }).$returningId();

    const courseID = newCourse.id;

    // *2️ Nếu có danh sách giáo viên, thêm vào COURSETEACHERS
    if (teachers && teachers.length > 0) {
      // Tạo dữ liệu để thêm vào bảng CourseTeachers
      const courseTeachersData = teachers.map((teacherID) => ({
        courseID,
        teacherID,
      }));

      // Thêm dữ liệu vào bảng CourseTeachers
      await db.insert(CourseTeachers).values(courseTeachersData);
    }

    res.json({ message: 'Course added successfully', courseID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

expressRouter.post('/edit', async (req, res) => {
  const { id, name, description, duration, fee, teachers } = req.body;
  // !console.log('🔴 API Received:', req.body);
  // Kiểm tra id có tồn tại không
  if (!id) {
    res.status(400).send('Course id is required');
    return;
  }

  try {
    // *1️ Cập nhật thông tin khóa học
    const set1 = {};
    if (name) set1['name'] = name;
    if (description) set1['description'] = description;
    if (duration) set1['duration'] = duration;
    if (fee) set1['fee'] = fee;

    if (Object.keys(set1).length > 0) {
      await db.update(Courses).set(set1).where(eq(Courses.id, id));
    }

    // *2️ Cập nhật danh sách giáo viên (nếu có)
    if (teachers !== undefined) {
      if (Array.isArray(teachers)) {
        // Chỉ cập nhật nếu teachers có phần tử
        if (teachers.length > 0) {
          // Xóa các bản ghi cũ
          await db.delete(CourseTeachers).where(eq(CourseTeachers.courseID, id));
          
          // Thêm các bản ghi mới
          const courseTeachersData = teachers.map((teacherID) => ({
            courseID: id,
            teacherID: teacherID
          }));
          await db.insert(CourseTeachers).values(courseTeachersData);
        }
        // Nếu teachers là mảng rỗng, không làm gì cả
      } else {
        res.status(400).send('Teachers must be an array');
        return;
      }
    }

    res.send('Course updated successfully');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    // Kiểm tra xem Course có tồn tại không
    const course = await db.select().from(Courses).where(eq(Courses.id, Number(id)));
    if (!course.length) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Xóa Course (CASCADE sẽ tự động xóa dữ liệu liên quan)
    await db.delete(Courses).where(eq(Courses.id, Number(id)));

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// expressRouter.get('/teachers/:courseID', async (req, res) => {
//   const courseID = req.params.courseID;

//   try {
//     // Lấy danh sách giáo viên của khóa học
//     const teachers = await db
//       .select({
//         teacherId: CourseTeachers.teacherID,
//         teacherName: Users.name,
//       })
//       .from(CourseTeachers)
//       .leftJoin(Teachers, eq(CourseTeachers.teacherID, Teachers.id))
//       .leftJoin(Users, eq(Teachers.userID, Users.id))
//       .where(eq(CourseTeachers.courseID, Number(courseID)));

//     res.json(teachers);
//   } catch (err) {
//     res.status(500).json({ error: err.toString() });
//   }
// });

export const router = expressRouter