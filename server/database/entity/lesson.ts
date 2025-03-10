import { mysqlTable, varchar, date, int, mysqlEnum } from 'drizzle-orm/mysql-core'
import { Classes } from './class'
import { Teachers } from './teacher'

export const Lessons = mysqlTable('lessons', {
  id: int().autoincrement().primaryKey(),
  classID: int().references(() => Classes.id, {onDelete:'cascade'}).notNull(),
  teacherID: int().references(() => Teachers.id,{onDelete:'restrict'}).notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  file_url: varchar({ length: 255 }).notNull(),
  file_type: mysqlEnum(['pdf', 'docx', 'pptx']).notNull(),
  file_size: int().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
