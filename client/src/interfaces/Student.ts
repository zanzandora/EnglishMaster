export interface Student {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string; 
    gender: "male" | "female";
    address?: string;
    photo?: string;
    className: string;
    courseName: string;
    createdAt: Date; 
    updatedAt: Date; 
  }
  