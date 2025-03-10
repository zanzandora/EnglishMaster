import { sql } from 'drizzle-orm'
import { check, date, int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core'
import { Students } from './student'
import { Schedule } from './schedule'
import { Exams } from './exam'

export const Results = mysqlTable(
  'results',
  {
    id: int().autoincrement().primaryKey(),
    examID: int().references(() => Exams.id).notNull(),
    studentID: int().references(() => Students.id, {onDelete:'cascade'}).notNull(),
    score: int().notNull(),
    status: mysqlEnum(['passed', 'failed']).notNull(),
    createdAt: date().default(new Date()),
    updatedAt: date().default(new Date()),
  },
  table => [
    check('score_check', sql`${table.score} >= 0 AND ${table.score} <= 100`),
  ]
)
