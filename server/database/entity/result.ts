import { sql } from 'drizzle-orm'
import { check, date, int, mysqlEnum, mysqlTable, } from 'drizzle-orm/mysql-core'
import { ClassStudents } from './classStudent'
export const Results = mysqlTable(
  'results',
  {
    id: int().autoincrement().primaryKey(),
    studentID: int().references(() => ClassStudents.studentID, { onDelete: 'cascade' }).notNull(),
    score: int(),
    MT: int(),     // Mid-term score (MT)
    FT: int(),     // Final-term score (FT)
    status: mysqlEnum(['passed', 'failed']),
    createdAt: date().default(new Date()),
    updatedAt: date().default(new Date()),
  },
  table => [
    check('score_check', sql`${table.score} >= 0 AND ${table.score} <= 100`),
    check('mt_check', sql`${table.MT} >= 0 AND ${table.MT} <= 100`),
    check('ft_check', sql`${table.FT} >= 0 AND ${table.FT} <= 100`),
  ]
)
