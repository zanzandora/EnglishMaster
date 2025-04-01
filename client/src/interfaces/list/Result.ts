export interface Result {
    id: number;
    title: string;
    className: string;
    courseName: string;
    MT: number ;
    FT: number ;
    score: number | undefined;
    status: 'passed' | 'failed';
    student:{
        studentID: number;
        studentName: string;
        email: string;
        phone: string;
        class: string;
    }
}
  