import {  int, text, date, boolean, mysqlTable } from 'drizzle-orm/mysql-core';

export const Notifications = mysqlTable('notifications', {
  id: int().autoincrement().primaryKey(),
  userId: int().notNull(), 
  title: text().notNull(),
  message: text().notNull(),
  isRead: boolean().default(false),
  createdAt: date().default(new Date()),
  relatedEntityId: text(), // ID liên quan (vd: schedule_id)
  relatedEntityType: text(), // Loại entity (vd: 'schedule')
});