import { Router } from 'express';
import { asc, eq, desc, sql, count } from 'drizzle-orm';

import { db } from '../database/driver';
import {
  Attendances,
  Classes,
  ClassStudents,
  Courses,
  Results,
  Students,
  Teachers,
  Users,
} from '../database/entity';
import { startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { getMonthlyGrowth } from '../service/student.service';
import { calculateGrowthRate } from '../helper/calculateGrowthRate';

const expressRouter = Router();

expressRouter.get('/countGender', async (req, res) => {
  try {
    const [total, genderCounts] = await Promise.all([
      db.select({ count: count() }).from(Students),
      db
        .select({
          gender: Students.gender,
          count: count(),
        })
        .from(Students)
        .groupBy(Students.gender),
    ]);

    res.json({
      total: total[0]?.count || 0,
      genders: genderCounts,
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

expressRouter.get('/monthly-growth', async (req, res) => {
  try {
    // 1. Validate và parse năm từ query parameters
    const year = req.query.year
      ? parseInt(req.query.year as string)
      : new Date().getFullYear();

    if (isNaN(year)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }

    // 2. Lấy dữ liệu từ service
    const data = await getMonthlyGrowth(year);

    // 3. Format response
    res.json({
      data: data.map((item) => ({
        ...item,
        growthRate: calculateGrowthRate(data, item.month), // Hàm tính toán tăng trưởng
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export const router = expressRouter;
