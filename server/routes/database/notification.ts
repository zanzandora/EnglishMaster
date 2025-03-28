import { Router } from 'express';
import { eq, desc } from 'drizzle-orm';
import { Notifications } from '../../database/entity/notifications';
import { db } from '../../database/driver';

const expressRouter = Router();

expressRouter.get('/', async (req, res) => {
  try {
    let notifications;
    if (req.user.role === 'teacher') {
      notifications = await db
        .select()
        .from(Notifications)
        .where(eq(Notifications.userId, req.user.user_id))
        .orderBy(desc(Notifications.createdAt)); // Lấy thông báo theo thứ tự thời gian
    } else {
      notifications = await db
        .select()
        .from(Notifications)
        .orderBy(desc(Notifications.createdAt)); // Lấy thông báo theo thứ tự th��i gian
    }
    res.json(
      notifications.map((n) => ({
        ...n,
        id: String(n.id),
        createdAt: new Date(n.createdAt).toISOString(),
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

expressRouter.post('/markAllAsRead', async (req, res) => {
  try {
    const userId = req.user.user_id; // Lấy user_id từ token đã xác thực

    // Cập nhật trạng thái các thông báo của người dùng này thành đã đọc
    await db
      .update(Notifications)
      .set({ isRead: true })
      .where(
        eq(Notifications.userId, userId) && eq(Notifications.isRead, false)
      );

    res.send('All notifications marked as read');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

export const router = expressRouter;
