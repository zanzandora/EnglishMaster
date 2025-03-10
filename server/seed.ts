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
  CourseTeachers
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

function generateTimeRange() {
  const startHour = faker.number.int({ min: 0, max: 22 })
  const startMinute = faker.number.int({ min: 0, max: 59 })

  const endHour = faker.number.int({ min: startHour + 1, max: 23 })
  const endMinute = faker.number.int({ min: 0, max: 59 })

  const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`
  const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`

  return { startTime, endTime }
}

// Seed Users
const users = Array.from({ length: 20 }, () => ({
  username: faker.internet.username(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  dateOfBirth: faker.date.birthdate(),
  gender: faker.helpers.arrayElement(['male', 'female']),
  phoneNumber: faker.phone.number(),
  address: faker.location.streetAddress(),
  photo: faker.image.avatar(),
  role: faker.helpers.arrayElement(['teacher', 'admin']),
  createdAt: new Date(),
  updatedAt: new Date(),
}))
const userIDs = await db.insert(Users).values(users).$returningId()

// Separate users into teachers and students
const teachers = userIDs.filter((_, i) => users[i].role === 'teacher')

// Seed Teachers
const teacherEntries = teachers.map(({ id }) => ({
  userID: id,
  experience: faker.number.int({ min: 1, max: 20 }),
  specialization: faker.person.jobType(),
  createdAt: new Date(),
  updatedAt: new Date(),
}))
const teacherIDs = await db.insert(Teachers).values(teacherEntries).$returningId()

// Seed Students
const studentEntries = Array.from({ length: 20 }).map((_, i) => ({
  name: faker.person.fullName(),
  phoneNumber: faker.phone.number(),
  email: faker.internet.email(),
  dateOfBirth: faker.date.birthdate(),
  gender: faker.helpers.arrayElement(['male', 'female']),
  address: faker.location.streetAddress(),
  photo: faker.image.avatar(),
}))
const studentIDs = await db.insert(Students).values(studentEntries).$returningId()

// Seed Courses
const courses = majors.map((course) => ({
  name: course,
  description: faker.lorem.paragraph(),
  duration: faker.number.int({ min: 1, max: 6 }),
  fee: faker.number.int({ min: 100, max: 1000 }),
  teacherID: faker.helpers.arrayElement(teacherIDs.map(({ id }) => id)),
  createdAt: new Date(),
  updatedAt: new Date(),
}))
const courseIDs = await db.insert(Courses).values(courses).$returningId()

// Seed Classes
const classes = Array.from({ length: 20 }, () => ({
  teacherID: faker.helpers.arrayElement(teacherIDs.map(({ id }) => id)),
  courseID: faker.helpers.arrayElement(courseIDs.map(({ id }) => id)),
  name: faker.helpers.arrayElement(mockClasses),
  description: faker.lorem.paragraph(),
  capacity: faker.number.int({ min: 20, max: 60, multipleOf: 5 }),
  startTime: new Date(),
  endTime: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}));
const classIDs = await db.insert(Classes).values(classes).$returningId();

// Seed ClassStudents
const classStudents = studentIDs.map(studentID => ({
  studentID: studentID.id,
  classID: faker.helpers.arrayElement(classIDs.map(({ id }) => id)),
  createdAt: new Date(),
}))
await db.insert(ClassStudents).values(classStudents).$returningId()

// Seed Course_Teachers
const courseTeachers = courseIDs.flatMap(({ id: courseID }) => {
  const assignedTeachers = faker.helpers.arrayElements(teacherIDs, faker.number.int({ min: 1, max: 3 }))
  return assignedTeachers.map(({ id: teacherID }) => ({
    courseID,
    teacherID,
    createdAt: new Date(),
  }))
})
await db.insert(CourseTeachers).values(courseTeachers)

// Seed Schedule
let time = generateTimeRange()
const schedules = classIDs.map((classID) => ({
  classID: classID.id,
  sessionDate: faker.date.future(),
  startTime: time.startTime,
  endTime: time.endTime,
  location: faker.location.city(),
  createdAt: new Date(),
  updatedAt: new Date(),
}))
const scheduleIDs = await db.insert(Schedule).values(schedules).$returningId()

// Seed Lessons
const lessons = classIDs.map((classID) => ({
  classID: classID.id,
  teacherID: faker.helpers.arrayElement(teacherIDs.map(({ id }) => id)),
  title: faker.word.words(4),
  description: faker.lorem.paragraph(),
  file_url: faker.internet.url(),
  file_type: faker.helpers.arrayElement(['pdf', 'docx', 'pptx']),
  file_size: faker.number.int({ min: 100, max: 10000 }),
  createdAt: new Date(),
  updatedAt: new Date(),
}))
await db.insert(Lessons).values(lessons).$returningId()

// Seed Exams
const exams = classIDs.map((classID) => ({
  classID: classID.id,
  teacherID: faker.helpers.arrayElement(teacherIDs.map(({ id }) => id)),
  title: faker.word.words(5),
  description: faker.lorem.paragraph(),
  file_url: faker.internet.url(),
  file_type: faker.helpers.arrayElement(['pdf', 'docx', 'pptx']),
  file_size: faker.number.int({ min: 100, max: 5000 }),
  date: faker.date.future(),
  createdAt: new Date(),
  updatedAt: new Date(),
}))
await db.insert(Exams).values(exams).$returningId()

// Seed Attendances
const attendances = classIDs.flatMap((classID) =>
  studentIDs.map((studentID) => ({
    classID: classID.id,
    studentID: studentID.id,
    scheduleID: faker.helpers.arrayElement(scheduleIDs).id,
    teacherID: faker.helpers.arrayElement(teacherIDs).id,
    date: faker.date.recent(),
    status: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
)
await db.insert(Attendances).values(attendances).$returningId()

console.log('Database seeding completed!')
process.exit(0)
