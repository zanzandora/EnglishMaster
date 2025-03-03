import { date,varchar,mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm/sql'

export const Students = mysqlTable('students', {
  id: int().autoincrement().primaryKey(),
  userID: int().references(() => Users.id).unique().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
