import { date, int, varchar, mysqlTable } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm/sql';
import { Users } from './user';

export const Teachers = mysqlTable('teachers', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`UUID()`),
  userId: varchar('userId', { length: 36 })
    .references(() => Users.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  experience: int(),
  createdAt: date().default(new Date()),
  updatedAt: date().default(new Date()),
});
