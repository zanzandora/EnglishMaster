import {  eq  } from 'drizzle-orm'

import { db } from '../database/driver';
import { Teachers } from '../database/entity';

export const getTeacherIdByUserId = async (userId: number) => {
    const teacher = await db
      .select({ id: Teachers.id })
      .from(Teachers)
      .where(eq(Teachers.userID, userId))
      .limit(1);
  
    return teacher[0]?.id; // Trả về teacherID hoặc undefined
  };