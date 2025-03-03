import { fakerVI as faker } from '@faker-js/faker';
import { formatDate } from '@utils/dateUtils';

export const role = 'admin';

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

// Generate mock data
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
      username: user.username,
      password: user.password,
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


    const getMockStudents = () => {
      // Kiểm tra xem đã có dữ liệu trong localStorage chưa
      const storedData = localStorage.getItem("mockStudents");
      if (storedData) return JSON.parse(storedData);
    
      // Nếu chưa có, tạo mới
      const newStudents = Array.from({ length: 30 }).map(() => ({
        id: faker.string.uuid(),
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        dateOfBirth: formatDate(faker.date.birthdate()),
        address: faker.address.city(),
        photo: faker.image.avatar(),
        gender: faker.person.sex(),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      }));
    
      // Lưu vào localStorage
      localStorage.setItem("mockStudents", JSON.stringify(newStudents));
    
      return newStudents;
    };
    
    // Gọi hàm để lấy dữ liệu
    const mockStudents = getMockStudents();

const mockCourses = Array.from({ length: 5 }).map(() => ({
  id: faker.string.uuid(),
  coursename: faker.helpers.arrayElement(majors),
  description: faker.lorem.paragraph(),
  duration: faker.number.int({ min: 1, max: 6 }), // 1 - 6 tháng
  fee: faker.number.int({ min: 1000000, max: 5000000 }), // 1.000.000 - 5.000.000 VND
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));

const mockClasses = Array.from({ length: 20 }).map(() => ({
  id: faker.string.uuid(),
  courseId: faker.helpers.arrayElement(mockCourses).id,
  teacherId: faker.helpers.arrayElement(mockTeachers).userId,
  className: majors, // Chọn tên lớp từ danh sách majors
  capacity: faker.number.int({ min: 10, max: 30 }), // Sức chứa lớp từ 10 - 30 học viên
  startDate: faker.date.future().toISOString(),
  endDate: faker.date.future().toISOString(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));


const mockSchedules = Array.from({ length: 30 }).map(() => ({
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

// Export mock data
export {
  mockUsers,
  mockTeachers,
  mockStudents,
  mockCourses,
  mockClasses,
  mockSchedules,
  mockClassStudents,
  mockLessons,
  mockExams,
};
