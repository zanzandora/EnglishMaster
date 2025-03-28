import {  int, text, date, boolean, mysqlTable, datetime } from 'drizzle-orm/mysql-core';

export const Notifications = mysqlTable('notifications', {
  id: int().autoincrement().primaryKey(),
  userId: int().notNull(), 
  title: text().notNull(),
  message: text().notNull(),
  isRead: boolean().default(false),
  createdAt: datetime().default(new Date()),
  relatedEntityType: text(), // Loại entity (vd: 'schedule')
});