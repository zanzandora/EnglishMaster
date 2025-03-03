import { sql } from 'drizzle-orm'
import { date, mysqlTable, time, int, varchar, check } from 'drizzle-orm/mysql-core'
import { Classes } from './class'

export const Schedule = mysqlTable(
  'schedule',
  {
    id: int().autoincrement().primaryKey(),
    classID: int().references(() => Classes.id).notNull(),
    sessionDate: date().default(new Date()),
    startTime: time().notNull(),
    endTime: time().notNull(),
    location: varchar({ length: 255 }).notNull(),
    createdAt: date().default(new Date()),
    updatedAt: date().default(new Date()),
  },
  table => [
    check('time_check', sql`${table.startTime} < ${table.endTime}`)
  ]
)
