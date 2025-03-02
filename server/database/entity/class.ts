import { date, mysqlTable, text, varchar,int } from 'drizzle-orm/mysql-core'
import { Teachers } from './teacher'
import { Courses } from './course'
import { sql } from 'drizzle-orm'

export const Classes = mysqlTable('classes', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`UUID()`),
  teacherId: varchar('teacherId', { length: 36 }).references(() => Teachers.userId, { onDelete: "cascade" }).notNull(),
  courseId: varchar('courseId', { length: 36 }).references(() => Courses.id, { onDelete: "cascade" }).notNull(),
  className: varchar({ length: 255 }).notNull(),
  capacity: int(),
  startDate: date().default(new Date()),
  endDate: date().default(new Date()),
  schedule: text().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
