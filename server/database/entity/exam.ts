import { mysqlTable, varchar, text, date, int } from 'drizzle-orm/mysql-core';
import { Classes } from './class';
import { Teachers } from './teacher';
import { sql } from 'drizzle-orm';

export const Exams = mysqlTable('exams', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`UUID()`),
  classId: varchar( { length: 36 }).references(() => Classes.id, { onDelete: "cascade" }).notNull(),
  uploaderId: varchar( { length: 36 }).references(() => Teachers.userId, { onDelete: "cascade" }).notNull(), // Giáo viên upload
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  exam_file_url: text('exam_file_url').notNull(),
  exam_file_type: varchar('exam_file_type', { length: 10 }).notNull(), // ['pdf', 'docx', 'pptx']
  exam_file_size: int('exam_file_size').notNull(), // Kích thước file tính theo byte
  exam_date: date('exam_date').notNull(), // Ngày tổ chức thi
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
});