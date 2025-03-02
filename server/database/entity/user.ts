import { date, varchar, mysqlEnum, mysqlTable, text } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm/sql'

export const Users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`UUID()`),
  username: text().notNull(),
  password: text().notNull(),
  email: text().notNull().unique(),
  name: text().notNull(),
  dateOfBirth: date().notNull(),
  gender: mysqlEnum(['male', 'female']),
  phoneNumber: text().notNull(),
  address: text().notNull(),
  photo: text(),
  role: mysqlEnum(['teacher', 'admin']).default('teacher'),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
