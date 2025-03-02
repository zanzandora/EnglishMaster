import { date,varchar,mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm/sql'

export const Students = mysqlTable('students', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`UUID()`),
  fuleName: varchar('full_name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  photo: varchar('photo', { length: 255 }).notNull(),
  gender: mysqlEnum(['male', 'female']),
  email: varchar('email', { length: 255 }).notNull().unique(),
  dateOfBirth: date().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
})
