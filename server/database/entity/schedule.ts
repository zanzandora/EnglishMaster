import { varchar, date, mysqlTable,time } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm/sql'
import { Classes } from './class';

export const Schedule = mysqlTable('schedule', {
    id: varchar('id', { length: 36 }).primaryKey().default(sql`UUID()`),
  classId: varchar('classId', { length: 36 }).references(() => Classes.id, { onDelete: "cascade" }).notNull(),
  sessionDate: date().default(new Date()),
  startTime: time().notNull(),
  endTime: time().notNull(),
  location: varchar({ length: 255 }).notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
});