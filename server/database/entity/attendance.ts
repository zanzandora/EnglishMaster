import { boolean, date, datetime, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { Schedule } from './schedule'
import { ClassStudents } from './classStudent'

export const Attendances = mysqlTable('attendances', {
  id: int().autoincrement().primaryKey(),
  studentID: int().references(() => ClassStudents.studentID, {onDelete: 'cascade'}).notNull(),
  scheduleID: int().references(() => Schedule.id, {onDelete: 'cascade'}).notNull(),
  note: varchar({ length: 255 }),
  checkInTime: datetime().default(new Date()),
  status: boolean().default(false),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
