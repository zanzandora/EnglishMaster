import { date, int, mysqlTable, text,varchar } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm/sql'

export const Courses = mysqlTable('courses', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`UUID()`),
  coursename: text().notNull(),
  description: text().notNull(),
  duration: int().notNull(),
  fee: int().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
