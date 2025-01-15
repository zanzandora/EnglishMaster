import { date, int, mysqlTable, text } from 'drizzle-orm/mysql-core'
import { Teachers } from './teacher'

export const Courses = mysqlTable('courses', {
  id: int().autoincrement().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  duration: int().notNull(),
  fee: int().notNull(),
  teacherID: int().references(() => Teachers.id),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
