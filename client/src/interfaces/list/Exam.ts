export interface Exam {
    id: number;
    title: string;
    description?: string;
    source?: string | undefined;
    course: string;
    class: string;
    teacher: string;
}
  