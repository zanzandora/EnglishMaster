import { mysqlTable, varchar, date, int, mysqlEnum } from 'drizzle-orm/mysql-core'
import { Classes } from './class'

export const Exams = mysqlTable('exams', {
  id: int().autoincrement().primaryKey(),
  classID: int().references(() => Classes.id, ({onDelete: 'cascade'})).notNull(),
  title: varchar({ length: 255 }).notNull(),
  file_url: varchar({ length: 255 }).notNull(),
  file_type: varchar({ length: 255 }).notNull(),
  file_size: int().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
