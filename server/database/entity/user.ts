import { date, mysqlEnum, mysqlTable, varchar, int } from 'drizzle-orm/mysql-core'

export const Users = mysqlTable('users', {
  id: int().autoincrement().primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  dateOfBirth: date().notNull(),
  gender: mysqlEnum(['male', 'female']).notNull(),
  phoneNumber: varchar({ length: 255 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  photo: varchar({ length: 255 }),
  role: mysqlEnum(['teacher', 'admin']).default('admin'),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
