import { date, int, mysqlTable } from 'drizzle-orm/mysql-core'
import { Users } from './user'

export const Students = mysqlTable('students', {
  id: int().autoincrement().primaryKey(),
  userID: int().references(() => Users.id).unique().notNull(),
  dateOfBirth: date().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
