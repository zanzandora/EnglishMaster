import { date, int, mysqlEnum, mysqlTable, serial, text } from 'drizzle-orm/mysql-core'

export const Users = mysqlTable('users', {
  id: int().autoincrement().primaryKey(),
  username: text().notNull(),
  password: text().notNull(),
  email: text().notNull().unique(),
  name: text().notNull(),
  age: int().notNull(),
  gender: mysqlEnum(['male', 'female']),
  phoneNumber: text().notNull(),
  address: text().notNull(),
  role: mysqlEnum(['student', 'teacher', 'admin']).default('student'),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
