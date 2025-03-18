import { mysqlTable, varchar, date, int, mysqlEnum } from 'drizzle-orm/mysql-core'


export const Lessons = mysqlTable('lessons', {
  id: int().autoincrement().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  type: varchar({ length: 225 }),
  file_url: varchar({ length: 255 }).notNull(),
  file_type: varchar({ length: 255 }).notNull(),
  file_size: int().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
