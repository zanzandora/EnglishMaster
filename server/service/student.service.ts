// services/student.service.ts
import { and, sql, count, gte, lte } from 'drizzle-orm';
import { db } from '../database/driver';
import {
    Students,
  } from '../database/entity';
import { startOfYear, endOfYear } from 'date-fns';

export const getMonthlyGrowth = async (year: number = new Date().getFullYear()) => {
  try {
    // 1. Tạo khoảng thời gian cho cả năm
    const startDate = startOfYear(new Date(year, 0, 1));
    const endDate = endOfYear(new Date(year, 11, 31));

    // 2. Truy vấn dữ liệu
    const monthlyData = await db
      .select({
        month: sql<number>`MONTH(${Students.createdAt})`.as('month'),
        count: count()
      })
      .from(Students)
      .where(
        and(
          gte(Students.createdAt, startDate),
          lte(Students.createdAt, endDate)
        )
      )
      .groupBy(sql`MONTH(${Students.createdAt})`)
      .orderBy(sql`month`);

    // 3. Tạo dữ liệu đầy đủ 12 tháng
    const fullYearData = Array.from({ length: 12 }, (_, index) => {
      const foundMonth = monthlyData.find(item => item.month === index + 1);
      return {
        month: index + 1,
        monthName: new Date(year, index).toLocaleString('default', { month: 'short' }),
        count: foundMonth?.count || 0
      };
    });

    return fullYearData;
  } catch (error) {
    throw new Error(`Error fetching monthly growth: ${error.message}`);
  }
};