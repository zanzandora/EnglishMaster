import { date, int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core'

export const Students = mysqlTable('students', {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  phoneNumber: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  dateOfBirth: date().notNull(),
  gender: mysqlEnum(['male', 'female']).notNull(),
  address: varchar({ length: 255 }).notNull(),
  photo: varchar({ length: 255 }),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
