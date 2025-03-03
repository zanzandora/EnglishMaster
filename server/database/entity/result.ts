import { sql } from 'drizzle-orm'
import { check, date, int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core'
import { Classes } from './class'
import { Students } from './student'
import { Schedule } from './schedule'
import { Exams } from './exam'

export const Results = mysqlTable(
  'results',
  {
    id: int().autoincrement().primaryKey(),
    classID: int().references(() => Classes.id).notNull(),
    studentID: int().references(() => Students.id).notNull(),
    examID: int().references(() => Exams.id).notNull(),
    scheduleID: int().references(() => Schedule.id).notNull(),
    resultType: mysqlEnum(['lesson', 'exam']).notNull(),
    score: int().notNull(),
    createdAt: date().default(new Date()),
    updatedAt: date().default(new Date()),
  },
  table => [
    check('score_check', sql`${table.score} >= 0 AND ${table.score} <= 100`),
  ]
)
