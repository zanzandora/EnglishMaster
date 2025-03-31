interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  role: 'teacher' | 'admin'; // Chỉ định role của người dùng
  dateOfBirth: string; // Định dạng ISO Date
  gender: 'male' | 'female'; // Giới tính của người dùng
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher {
  id: number;
  userID: number; // Liên kết với bảng User
  experience: string; // Kinh nghiệm của giáo viên
  specialization: string; // Chuyên môn của giáo viên
  createdAt: Date;
  updatedAt: Date;

  userName: string;
  password: string;
  email: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  photo?: string;
  role: 'teacher' | 'admin'; // Chỉ định role của người dùng
  dateOfBirth?: string | undefined; // Định dạng ISO Date
  gender: 'male' | 'female';  // Mối quan hệ với bảng User

  totalCourses?: number | undefined;
  totalClasses?: number | undefined;

}
