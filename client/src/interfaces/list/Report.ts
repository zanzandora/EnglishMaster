export interface Report {
  student: {
    studentID: number;
    studentName: string;
    dateOfBirth: Date;
    email: string;
  };
  class: {
    classID: number;
    className: string;
    classNames: string;
    totalStudents: number;
    teacherNames: string;
};
  score: {
    totalScore: number;
    MT: number;
    FT: number;
    status: boolean;
  };
  attendance: {
    totalCheckins: number;
    totalAbsences: number;
  };
  course: {
    courseID: number;
    courseName: string;
  };
}
