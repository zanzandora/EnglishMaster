import { date, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { Teachers } from './teacher'
import { Courses } from './course'
import { sql } from 'drizzle-orm'

export const Classes = mysqlTable('classes', {
  id: int().autoincrement().primaryKey(),
  teacherID: int().references(() => Teachers.id).notNull(),
  courseID: int().references(() => Courses.id).notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
