import { date, int, varchar, mysqlTable } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm/sql';
import { Users } from './user';

export const Teachers = mysqlTable('teachers', {
  id: int().autoincrement().primaryKey(),
  userID: int().references(() => Users.id).unique().notNull(),
  experience: int().notNull(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
});
