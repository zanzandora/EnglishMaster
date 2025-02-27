import { faker } from "@faker-js/faker";

export const role = 'admin'

// Interface definitions
interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  }
  
  interface Teacher {
    user_id: string;
    teacher_code: string;
    full_name: string;
    phone?: string | null;
    address?: string | null;
    created_at: string;
    updated_at: string;
  }
  
  interface Student {
    student_code: string;
    full_name: string;
    phone?: string | null;
    date_of_birth?: string | null;
    photo?: string | null;
    created_at: string;
    updated_at: string;
  }
  
  interface Course {
    id: string;
    course_name: string;
    description?: string | null;
    created_at: string;
    updated_at: string;
  }
  
  interface Class {
    id: string;
    course_id: string;
    teacher_id: string;
    class_name: string;
    description?: string | null;
    created_at: string;
    updated_at: string;
  }
  
  interface Schedule {
    id: string;
    class_id: string;
    session_date: string;
    start_time: string;
    end_time: string;
    location?: string | null;
    created_at: string;
  }
  
  interface ClassStudent {
    id: string;
    class_id: string;
    student_id: string;
    created_at: string;
  }
  
  interface Lesson {
    id: string;
    class_id: string;
    teacher_id: string;
    title: string;
    description?: string | null;
    file_url: string;
    file_type: string;
    file_size: number;
    created_at: string;
    updated_at: string;
  }
  
  interface Exam {
    id: string;
    class_id: string;
    uploaded_id: string;
    title: string;
    description?: string | null;
    exam_file_url: string;
    exam_file_type: string;
    exam_file_size: number;
    exam_date: string;
    created_at: string;
    updated_at: string;
  }
  
// Generate mock data
const mockUsers: User[] = Array.from({ length: 10 }).map(() => ({
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['admin', 'teacher', 'student']),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }));
  
  const mockTeachers: Teacher[] = mockUsers
    .filter(user => user.role === 'teacher')
    .map(user => ({
      user_id: user.id,
      teacher_code: faker.string.alphanumeric(10),
      full_name: faker.person.fullName(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    }));
  
  const mockStudents: Student[] = Array.from({ length: 30 }).map(() => ({
    student_code: faker.string.alphanumeric(10),
    full_name: faker.person.fullName(),
    phone: faker.phone.number(),
    date_of_birth: faker.date.past().toISOString(),
    address: faker.address.city(),
    photo: faker.image.avatar(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }));
  
  const mockCourses: Course[] = Array.from({ length: 5 }).map(() => ({
    id: faker.string.uuid(),
    course_name: faker.company.buzzPhrase(),
    description: faker.lorem.paragraph(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }));
  
  const mockClasses: Class[] = Array.from({ length: 10 }).map(() => ({
    id: faker.string.uuid(),
    course_id: faker.helpers.arrayElement(mockCourses).id,
    teacher_id: faker.helpers.arrayElement(mockTeachers).user_id,
    class_name: faker.company.buzzPhrase(),
    description: faker.lorem.paragraph(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }));
  
  const mockSchedules: Schedule[] = Array.from({ length: 30 }).map(() => ({
    id: faker.string.uuid(),
    class_id: faker.helpers.arrayElement(mockClasses).id,
    session_date: faker.date.future().toISOString(),
    start_time: faker.date.recent().toISOString(),
    end_time: faker.date.future().toISOString(),
    location: faker.location.streetAddress(),
    created_at: faker.date.past().toISOString(),
  }));
  
  const mockClassStudents: ClassStudent[] = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    class_id: faker.helpers.arrayElement(mockClasses).id,
    student_id: faker.helpers.arrayElement(mockStudents).student_code,
    created_at: faker.date.past().toISOString(),
  }));
  
  const mockLessons: Lesson[] = Array.from({ length: 20 }).map(() => ({
    id: faker.string.uuid(),
    class_id: faker.helpers.arrayElement(mockClasses).id,
    teacher_id: faker.helpers.arrayElement(mockTeachers).user_id,
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    file_url: faker.internet.url(),
    file_type: faker.helpers.arrayElement(['pdf', 'docx', 'pptx']),
    file_size: faker.number.int({ min: 1000, max: 1000000 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }));
  
  const mockExams: Exam[] = Array.from({ length: 10 }).map(() => ({
    id: faker.string.uuid(),
    class_id: faker.helpers.arrayElement(mockClasses).id,
    uploaded_id: faker.helpers.arrayElement(mockTeachers).user_id,
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    exam_file_url: faker.internet.url(),
    exam_file_type: faker.helpers.arrayElement(['pdf', 'docx', 'pptx']),
    exam_file_size: faker.number.int({ min: 1000, max: 1000000 }),
    exam_date: faker.date.future().toISOString(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
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