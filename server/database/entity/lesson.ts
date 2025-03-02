import { mysqlTable, varchar, text, date, int } from 'drizzle-orm/mysql-core';
import { Classes } from './class';
import { Teachers } from './teacher';
import { sql } from 'drizzle-orm/sql';

export const Lessons = mysqlTable('lessons', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`UUID()`), // UUID
  classId: varchar('classId', { length: 36 }).references(() => Classes.id, { onDelete: "cascade" }).notNull(),
  teacherId: varchar('teacherId', { length: 36 }).references(() => Teachers.userId, { onDelete: "cascade"}).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  file_url: text('file_url').notNull(),
  file_type: varchar('file_type', { length: 10 }).notNull(), // ['pdf', 'docx', 'pptx']
  file_size: int('file_size').notNull(), // Kích thước file tính theo byte
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
});
