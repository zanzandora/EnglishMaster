import { db } from './database/driver'; // Import kết nối database
import { Users,Teachers,Students,Courses,Classes,Schedule,ClassStudents,Lessons,Exams } from './database/entity'; // Import schema
import { fakerVI as faker } from '@faker-js/faker';


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
];
// Tạo mảng `mockUsers`
const mockUsers = Array.from({ length: 10 }).map(() => ({
  id: faker.string.uuid(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  dateOfBirth: faker.date.birthdate().toISOString().split('T')[0], // YYYY-MM-DD
  gender: faker.helpers.arrayElement(['male', 'female']),
  phoneNumber: faker.phone.number(),
  photo: faker.image.avatar(),
  address: faker.location.streetAddress(),
  role: 'teacher',
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));

 const mockTeachers = mockUsers.map((user) => ({
      id: faker.string.uuid(),
      userId: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      photo: user.photo,
      experience: faker.number.int({ min: 1, max: 5 }), 
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));


const mockStudents = Array.from({ length: 20 }).map(() => ({
  id: faker.string.uuid(),
  fuleName: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  dateOfBirth: faker.date.birthdate().toISOString().split('T')[0],
  address: faker.address.city(),
  photo: faker.image.avatar(),
  gender: faker.person.gender(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));

const mockCourses = majors.map((major) => ({
  id: faker.string.uuid(),
  coursename: major, // Thuộc tính major
  description: faker.lorem.paragraph(),
  duration: faker.number.int({ min: 1, max: 6 }), // 1 - 6 tháng
  fee: faker.number.int({ min: 1000000, max: 5000000 }), // 1.000.000 - 5.000.000 VND
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));

const mockClasses = Array.from({ length: 15 }).map(() => {
  const course = faker.helpers.arrayElement(mockCourses); // Chọn ngẫu nhiên một khóa học
  return {
    id: faker.string.uuid(),
    courseId: course.id, // Liên kết với courseId
    teacherId: faker.helpers.arrayElement(mockTeachers).userId,
    className: course.coursename, // className được lấy từ major của khóa học
    capacity: faker.number.int({ min: 10, max: 30 }), // Sức chứa lớp từ 10 - 30 học viên
    startDate: faker.date.future().toISOString(),
    endDate: faker.date.future().toISOString(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };
});


const mockSchedules = Array.from({ length: 15 }).map(() => ({
  id: faker.string.uuid(),
  classId: faker.helpers.arrayElement(mockClasses).id,
  sessionDate: faker.date.future().toISOString(),
  startTime: faker.date.recent().toISOString(),
  endTime: faker.date.future().toISOString(),
  location: faker.location.streetAddress(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));

const mockClassStudents = mockStudents.map((student) => ({
  classId: faker.helpers.arrayElement(mockClasses).id, // Gán lớp ngẫu nhiên
  studentId: student.id,
  createdAt: faker.date.past().toISOString(),
}));




const mockLessons = Array.from({ length: 20 }).map(() => ({
  id: faker.string.uuid(),
  classId: faker.helpers.arrayElement(mockClasses).id,
  teacherId: faker.helpers.arrayElement(mockTeachers).userId,
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  file_url: faker.internet.url(),
  file_type: faker.helpers.arrayElement(['pdf', 'docx', 'pptx']),
  file_size: faker.number.int({ min: 1000, max: 1000000 }),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));

const mockExams = Array.from({ length: 10 }).map(() => ({
  id: faker.string.uuid(),
  classId: faker.helpers.arrayElement(mockClasses).id,
  uploaderId: faker.helpers.arrayElement(mockTeachers).userId,
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  exam_file_url: faker.internet.url(),
  exam_file_type: faker.helpers.arrayElement(['pdf', 'docx', 'pptx']),
  exam_file_size: faker.number.int({ min: 1000, max: 1000000 }),
  exam_date: faker.date.future().toISOString(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));

const seedDB = async () => {
  console.log('🔄 Seeding ...');

  await db.insert(Users).values(mockUsers);
  await db.insert(Teachers).values(mockTeachers);
  await db.insert(Students).values(mockStudents);
  await db.insert(Courses).values(mockCourses);
  await db.insert(Classes).values(mockClasses);
  await db.insert(Schedule).values(mockSchedules);
  await db.insert(ClassStudents).values(mockClassStudents);
  await db.insert(Lessons).values(mockLessons);
  await db.insert(Exams).values(mockExams);



  console.log('✅ Seeding completed!');
  process.exit(); // Thoát process sau khi hoàn tất
};

seedDB().catch(console.error);
