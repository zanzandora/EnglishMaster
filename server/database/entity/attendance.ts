import { boolean, date, int, mysqlTable } from 'drizzle-orm/mysql-core'
import { Classes } from './class'
import { Students } from './student'
import { Schedule } from './schedule'
import { Teachers } from './teacher'

export const Attendances = mysqlTable('attendances', {
  id: int().autoincrement().primaryKey(),
  classID: int().references(() => Classes.id, {onDelete: 'cascade'}).notNull(),
  studentID: int().references(() => Students.id, {onDelete: 'cascade'}).notNull(),
  scheduleID: int().references(() => Schedule.id, {onDelete: 'cascade'}).notNull(),
  teacherID: int().references(() => Teachers.id, {onDelete: 'cascade'}).notNull(),
  checkInTime: date().default(new Date()),
  status: boolean().default(false),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
