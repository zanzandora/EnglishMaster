import { date, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { Teachers } from './teacher'
import { Courses } from './course'

export const Classes = mysqlTable('classes', {
  id: int().autoincrement().primaryKey(),
  courseID: int().references(() => Courses.id, {onDelete: 'cascade'}).notNull(),
  teacherID: int().references(() => Teachers.id).notNull(),
  name: varchar({ length: 255 }).notNull(),
  capacity: int().notNull(),
  startTime: date().notNull(),
  endTime: date().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
