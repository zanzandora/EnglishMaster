import { sql } from 'drizzle-orm'
import { date, mysqlTable, time, int, varchar, check, mysqlEnum } from 'drizzle-orm/mysql-core'
import { Classes } from './class'

export const Schedule = mysqlTable(
  'schedule',
  {
    id: int().autoincrement().primaryKey(),
    classID: int().references(() => Classes.id, { onDelete: 'cascade' }).notNull(),
    type: mysqlEnum(['class', 'exam']).notNull().default('class'),
    repeatRule: mysqlEnum(['weekly', 'custom']).default('weekly').notNull(),
    daysOfWeek: varchar({ length: 20 }).notNull(),
    startTime: time().notNull(),
    endTime: time().notNull(),
    startDate: date().notNull(),
    endDate: date().notNull(),
    room: int().notNull(),
    createdAt: date().default(new Date()),
    updatedAt: date().default(new Date()),
  },
  table => [
    check('time_check', sql`${table.startTime} < ${table.endTime}`)
  ]
)
