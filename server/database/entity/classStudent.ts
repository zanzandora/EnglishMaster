import { date, int, mysqlTable } from 'drizzle-orm/mysql-core'
import { Students } from './student'
import { Classes } from './class'

export const ClassStudents = mysqlTable('class_students', {
  studentID: int().primaryKey().references(() => Students.id).notNull(),
  classID: int().references(() => Classes.id, { onDelete: 'cascade' }).notNull(),
  createdAt: date().default(new Date()),
})
