import { mysqlTable, varchar, date, int, mysqlEnum } from 'drizzle-orm/mysql-core'
import { Classes } from './class'
import { Teachers } from './teacher'

export const Exams = mysqlTable('exams', {
  id: int().autoincrement().primaryKey(),
  classID: int().references(() => Classes.id).notNull(),
  teacherID: int().references(() => Teachers.id).notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  file_url: varchar({ length: 255 }).notNull(),
  file_type: mysqlEnum(['pdf', 'docx', 'pptx']).notNull(),
  file_size: int().notNull(),
  date: date().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
