import { boolean, date, int, mysqlTable } from 'drizzle-orm/mysql-core'
import { Classes } from './class'
import { Students } from './student'
import { Schedule } from './schedule'

export const Attendances = mysqlTable('attendances', {
  id: int().autoincrement().primaryKey(),
  classID: int().references(() => Classes.id).notNull(),
  studentID: int().references(() => Students.id).notNull(),
  scheduleID: int().references(() => Schedule.id),
  checkInTime: date().default(new Date()),
  status: boolean().default(false),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
