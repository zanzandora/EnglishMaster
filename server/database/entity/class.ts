import { date, int, mysqlTable, text } from 'drizzle-orm/mysql-core'
import { Teachers } from './teacher'
import { Courses } from './course'

export const Classes = mysqlTable('classes', {
  id: int().autoincrement().primaryKey(),
  teacherID: int().references(() => Teachers.id).notNull(),
  courseID: int().references(() => Courses.id).notNull(),
  startDate: date().default(new Date()),
  endDate: date().default(new Date()),
  schedule: text().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
