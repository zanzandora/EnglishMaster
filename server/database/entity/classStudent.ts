import {  date, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { Students } from './student';
import { Classes } from './class';

export const ClassStudents = mysqlTable('class_students', {
  studentId:varchar('studentId', { length: 36 }).primaryKey().references(() => Students.id, { onDelete: "cascade" }).notNull(),
  classId: varchar('classId', { length: 36 }).references(() => Classes.id, { onDelete: "cascade" }).notNull(),
  createdAt: date().default(new Date()),
});