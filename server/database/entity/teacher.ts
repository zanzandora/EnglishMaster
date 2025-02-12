import { date, int, mysqlTable, text } from 'drizzle-orm/mysql-core'
import { Users } from './user'

export const Teachers = mysqlTable('teachers', {
  id: int().autoincrement().primaryKey(),
  userID: int().references(() => Users.id).unique().notNull(),
  specialization: text().notNull(),
  experience: int().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
