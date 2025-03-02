import { boolean, date, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { Classes } from './class'
import { Students } from './student'
import {Schedule} from './schedule';
import {Teachers} from './teacher';
import { sql } from 'drizzle-orm/sql'

export const Attendances = mysqlTable('attendances', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`UUID()`),
  classId: varchar('id', { length: 36 }).references(() => Classes.id, { onDelete: "cascade" }).notNull(),
  studentId: varchar('id', { length: 36 }).references(() => Students.id, { onDelete: "cascade" }).notNull(),
  scheduleId: varchar('id', { length: 36 }).references(() => Schedule.id, { onDelete: "cascade" }).notNull(),
  teacherId: varchar('teacherId', { length: 36 }).references(() => Teachers.userId, { onDelete: "cascade" }).notNull(),
  date: date().default(new Date()),
  status: boolean().default(false),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
