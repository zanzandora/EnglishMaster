import { fakerVI as faker } from '@faker-js/faker'
import { db } from './database/driver'
import {
  Users,
  Teachers,
  Students,
  Courses,
  Classes,
  ClassStudents,
  Schedule,
  Lessons,
  Exams,
  Attendances,
  CourseTeachers,
  Results
} from './database/entity'

const mockClasses=[
  'ENG-B1 ',
  'ENG-B2 ',
  'ENG-I1 ',
  'ENG-I2 ',
  'ENG-A1 ',
  'ENG-A2',
  'KIDS-1 ',
  'KIDS-2 ',
  'TEENS-1',
  'TEENS-2 ',
  'ADLT-1 ',
  'ADLT-2 ',
  'IELTS-5',
  'IELTS-6',
  'TOEIC-4',
  'TOEIC-600',
  'SPK-1 ',
  'WRT-1 ',
  'BIZ-1 ',
  'TRVL-1',
  'TRVL-2',
]
const majors = [
  'ENG-B1 English Beginner Level 1',
  'ENG-B2 English Beginner Level 2',
  'ENG-I1 English Intermediate Level 1',
  'ENG-I2 English Intermediate Level 2',
  'ENG-A1 English Advanced Level 1',
  'ENG-A2 English Advanced Level 2',
  'KIDS-1 English for Kids Level 1',
  'KIDS-2 English for Kids Level 2',
  'TEENS-1 English for Teens Level 1',
  'TEENS-2 English for Teens Level 2',
  'ADLT-1 English for Adults Level 1',
  'ADLT-2 English for Adults Level 2',
  'IELTS-5 IELTS Band 5 Preparation',
  'IELTS-6 IELTS Band 6 Preparation',
  'TOEIC-450 TOEIC Preparation 450+',
  'TOEIC-600 TOEIC Preparation 600+',
  'SPK-1 Speaking Class Level 1',
  'WRT-1 Writing Class Level 1',
  'BIZ-1 Business English Level 1',
  'TRVL-1 English for Travel',
  'TRVL-2 English for Travel',
]
const mockLessons = [
  "Introduction to English Grammar",
  "Basic Vocabulary Building",
  "Everyday Conversations",
  "Pronunciation Practice",
  "Reading Comprehension",
  "Writing Simple Sentences",
  "Listening Skills Development",
  "Speaking Fluency Exercises",
  "Intermediate Grammar Rules",
  "Advanced Vocabulary Expansion",
  "Business English Basics",
  "English for Travel",
  "Phrasal Verbs and Idioms",
  "Academic Writing Skills",
  "Public Speaking in English",
  "English for Job Interviews",
  "Understanding English Movies",
  "English for Kids: Fun Activities",
  "TOEFL/IELTS Preparation",
  "English for Specific Purposes (ESP)"
]

const lessonTypes = [
  "TOEIC Preparation",
  "IELTS Speaking",
  "Business English",
  "Conversational English",
  "Pronunciation Practice"
];

// function generateTimeRange() {
//   const startHour = faker.number.int({ min: 0, max: 22 })
//   const startMinute = faker.number.int({ min: 0, max: 59 })

//   const endHour = faker.number.int({ min: startHour + 1, max: 23 })
//   const endMinute = faker.number.int({ min: 0, max: 59 })

//   const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`
//   const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`

//   return { startTime, endTime }
// }

// const generateTimeRange = () => {
//   const timeSlots = [
//     { startTime: '17:30:00', endTime: '19:30:00' }, // Ca 1
//     { startTime: '19:30:00', endTime: '21:30:00' }, // Ca 2
//   ];
//   return faker.helpers.arrayElement(timeSlots);
// };

// const generateDaysOfWeek = () => {
//   const rules = ['1,3', '2,4', '3,5', '4,6']; // Một số mẫu lịch
//   return faker.helpers.arrayElement(rules);
// };

// // Seed Users
// const users = Array.from({ length: 20 }, () => ({
//   username: faker.internet.username(),
//   password: faker.internet.password(),
//   email: faker.internet.email(),
//   name: faker.person.fullName(),
//   dateOfBirth: faker.date.birthdate(),
//   gender: faker.helpers.arrayElement(['male', 'female']),
//   phoneNumber: faker.phone.number(),
//   address: faker.location.streetAddress(),
//   photo: faker.image.avatar(),
//   role: faker.helpers.arrayElement(['teacher', 'admin']),
//   createdAt: new Date(),
//   updatedAt: new Date(),
// }))
// const userIDs = await db.insert(Users).values(users).$returningId()

// // Separate users into teachers and students
// const teachers = userIDs.filter((_, i) => users[i].role === 'teacher')

// // Seed Teachers
// const teacherEntries = teachers.map(({ id }) => ({
//   userID: id,
//   experience: faker.number.int({ min: 1, max: 20 }),
//   specialization: faker.person.jobType(),
//   createdAt: new Date(),
//   updatedAt: new Date(),
// }))
// const teacherIDs = await db.insert(Teachers).values(teacherEntries).$returningId()

// // Seed Students
// const studentEntries = Array.from({ length: 50 }).map((_, i) => ({
//   name: faker.person.fullName(),
//   phoneNumber: faker.phone.number(),
//   email: faker.internet.email(),
//   dateOfBirth: faker.date.birthdate(),
//   gender: faker.helpers.arrayElement(['male', 'female']),
//   address: faker.location.streetAddress(),
//   photo: faker.image.avatar(),
// }))
// const studentIDs = await db.insert(Students).values(studentEntries).$returningId()

// // Seed Courses
// const courses = majors.map((course) => ({
//   name: course,
//   description: faker.lorem.paragraph(),
//   duration: faker.number.int({ min: 1, max: 6 }),
//   fee: faker.number.int({ min: 100, max: 1000 }),
//   teacherID: faker.helpers.arrayElement(teacherIDs.map(({ id }) => id)),
//   createdAt: new Date(),
//   updatedAt: new Date(),
// }))
// const courseIDs = await db.insert(Courses).values(courses).$returningId()

// // Seed Classes
// const classes = mockClasses.map((className) => ({
//   teacherID: faker.helpers.arrayElement(teacherIDs.map(({ id }) => id)),
//   courseID: faker.helpers.arrayElement(courseIDs.map(({ id }) => id)),
//   name: className,
//   description: faker.lorem.paragraph(),
//   capacity: faker.number.int({ min: 20, max: 60, multipleOf: 5 }),
//   createdAt: new Date(),
//   updatedAt: new Date(),
// }));
// const classIDs = await db.insert(Classes).values(classes).$returningId();

// // Seed ClassStudents
// const classStudents = studentIDs.map(studentID => ({
//   studentID: studentID.id,
//   classID: faker.helpers.arrayElement(classIDs.map(({ id }) => id)),
//   createdAt: new Date(),
// }))
// await db.insert(ClassStudents).values(classStudents).$returningId()

// // Seed Course_Teachers
// const courseTeachers = courseIDs.flatMap(({ id: courseID }) => {
//   const assignedTeachers = faker.helpers.arrayElements(teacherIDs, faker.number.int({ min: 1, max: 3 }))
//   return assignedTeachers.map(({ id: teacherID }) => ({
//     courseID,
//     teacherID,
//     createdAt: new Date(),
//   }))
// })
// await db.insert(CourseTeachers).values(courseTeachers)

// // Seed Schedule

// const schedules = classIDs.flatMap((classID) => {
//   const time = generateTimeRange();
//   const classStartDate = faker.date.future({ years: 0.5 });
//   const classEndDate = faker.date.future({ years: 1 });
//   const examDate = classEndDate;

//   return [
//     {
//       classID: classID.id,
//       type: 'class',
//       repeatRule: 'weekly',
//       daysOfWeek: generateDaysOfWeek(),
//       startDate: classStartDate,
//       endDate: classEndDate,
//       startTime: time.startTime,
//       endTime: time.endTime,
//       location: faker.location.city(),
//       room: faker.number.int({ min: 1, max: 10 }),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       classID: classID.id,
//       type: 'exam',
//       repeatRule: 'custom',
//       daysOfWeek: null, // Lịch thi không có ngày lặp
//       startDate: examDate,
//       endDate: examDate,
//       startTime: time.startTime,
//       endTime: time.endTime,
//       location: faker.location.city(),
//       room: faker.number.int({ min: 1, max: 10 }),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   ];
// });
// const scheduleIDs = await db.insert(Schedule).values(schedules).$returningId()

// // Seed Lessons
// const lessons = mockLessons.map((title) => ({
//   title: title,
//   description: faker.lorem.paragraph(),
//   type: faker.helpers.arrayElement(lessonTypes),
//   file_url: faker.internet.url(),
//   file_type: faker.helpers.arrayElement(['pdf', 'docx', 'pptx']),
//   file_size: faker.number.int({ min: 100, max: 10000 }),
//   createdAt: new Date(),
//   updatedAt: new Date(),
// }))
// await db.insert(Lessons).values(lessons).$returningId()

// // Seed Exams
// const exams = classIDs.map((classID) => ({
//   classID: classID.id,
//   title: faker.word.words(5),
//   file_url: faker.internet.url(),
//   file_type: faker.helpers.arrayElement(['pdf', 'docx', 'pptx']),
//   file_size: faker.number.int({ min: 100, max: 5000 }),
//   createdAt: new Date(),
//   updatedAt: new Date(),
// })).slice(0, classIDs.length);
// await db.insert(Exams).values(exams).$returningId()


// Seed Results

// Đọc dữ liệu từ bảng ClassStudents (để có các sinh viên đã tham gia lớp)
const classStudents = await db.select().from(ClassStudents);

// Đọc dữ liệu từ bảng Students (lấy thông tin sinh viên)
const existingStudents = await db.select().from(Students);

// Seed Results dựa trên sinh viên đã có lớp từ bảng ClassStudents
const results = classStudents.map(classStudent => {
  // Tìm thông tin sinh viên từ bảng Students
  const student = existingStudents.find(s => s.id === classStudent.studentID);

  const MT = faker.number.int({ min: 0, max: 100 });
  const FT = faker.number.int({ min: 0, max: 100 });

  const score = Math.round((MT + FT) / 2);

  const status = score >= 50 ? 'passed' : 'failed';

  return {
    studentID: student.id,        // studentID từ bảng Students
    MT: MT,   // Điểm giữa kỳ
    FT: FT,   // Điểm cuối kỳ
    score: score, // Điểm tổng kết
    status: status, // Trạng thái
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

// Chèn dữ liệu vào bảng Results
await db.insert(Results).values(results).$returningId();

// Seed Attendances
const attendances = [];

// Chỉ tạo attendance cho các classStudents


// studentIDs.forEach(student => {
//   // Lấy danh sách lớp mà sinh viên tham gia
//   const studentClasses = classStudents.filter(cs => cs.studentID === student.id);

//     studentClasses.forEach(cs => {
//       attendances.push({
//         studentID: student.id,
//         classID: cs.classID,
//         note: faker.lorem.words({ min: 1, max: 2 }),
//         checkInTime: faker.date.recent(),
//         status: faker.datatype.boolean(),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     });
//   }
// );
// await db.insert(Attendances).values(attendances).$returningId();

console.log('Database seeding completed!')
process.exit(0)
