import { date, int, mysqlTable, serial } from 'drizzle-orm/mysql-core'
import { Users } from './user'

export const Students = mysqlTable('students', {
  id: int().autoincrement().primaryKey(),
  userID: int().references(() => Users.id),
  dateOfBirth: date().notNull(),
  experience: int().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
