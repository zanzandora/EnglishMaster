export interface Attendance {
  id: number;
  checkInTime: string;
  note: string;
  status: boolean;
  student: {
    studentID: number;
    studentName: string;
    dateOfBirth: string;
  };
  class: {
    classID: number;
    className: string;
  };
  teacher: {
    teacherID: number;
    teacherName: string;
  };
  totalCheckins: number;
}

export interface CurrentTeacher {
  teacherID: number;
  teacherName: string;
}
