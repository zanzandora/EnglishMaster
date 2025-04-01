export interface Course {
  id: number;
  name: string;
  description?: string;
  duration?: number | undefined;
  fee?: number | undefined;
  teachers: {
    courseId: number;
    teacherId: number;
    teacherName?: string;
  }[];
}
