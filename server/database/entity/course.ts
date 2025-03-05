import { sql } from 'drizzle-orm'
import { check, date, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'

export const Courses = mysqlTable(
  'courses',
  {
    id: int().autoincrement().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    duration: int().notNull(),
    fee: int().notNull(),
    createdAt: date().default(new Date()),
    updatedAt: date().default(new Date()),
  },
  table => [
    check(`1 < duration < 6`, sql`${table.duration} BETWEEN 1 AND 6`),
  ]
)
