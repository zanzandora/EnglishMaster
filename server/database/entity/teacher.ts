import { date, int, varchar, mysqlTable } from 'drizzle-orm/mysql-core'
import { Users } from './user'

export const Teachers = mysqlTable('teachers', {
  id: int().autoincrement().primaryKey(),
  userID: int().references(() => Users.id).unique().notNull(),
  experience: int().notNull(),
  specialization: varchar({ length: 255 }).notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
