// Trimmed down version of https://github.com/bluwy/create-vite-extra/blob/master/template-ssr-react-ts/server.js

import 'dotenv/config'
import fs from 'node:fs/promises'
import express from 'express'
import cookieParser from 'cookie-parser'
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import type { ViteDevServer } from 'vite'
import { authenticateToken } from './routes/middleware'

const isProduction = process.env.NODE_ENV === 'production'

const app = express()
app.use(cookieParser())
app.use(express.static('./client/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Kết nối WebSocket
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Thêm phần đăng ký room theo userID
  socket.on('subscribe', (userId: number) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined notification room`);
  });

    // // Listen for schedule update event
    // socket.on('scheduleUpdated', (message) => {
    //   console.log('Schedule updated:', message);
    //   // Emit notification to all users (admin and teacher)
    //   io.emit('newNotification', message);
    // });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
let vite: ViteDevServer
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: '/',
  })
  app.use(vite.middlewares)
}
else {
  app.use((await import('compression')).default())
  app.use('/', (await import('sirv')).default('./dist/client', { extensions: [] }))
}

// Middleware để gán io vào request
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.post(['/login', '/logout', '/register', '/forgot'], (await import('./routes/login')).router)
app.use('/student', authenticateToken, (await import('./routes/database/student')).router)
app.use('/teacher', authenticateToken, (await import('./routes/database/teacher')).router)
app.use('/user', authenticateToken, (await import('./routes/database/user')).router)
app.use('/course', authenticateToken, (await import('./routes/database/course')).router)
app.use('/attendance', authenticateToken, (await import('./routes/database/attendance')).router)
app.use('/schedule', authenticateToken, (await import('./routes/database/schedule')).router)
app.use('/class', authenticateToken, (await import('./routes/database/class')).router)
app.use('/exam', authenticateToken, (await import('./routes/database/exam')).router)
app.use('/lesson', authenticateToken, (await import('./routes/database/lesson')).router)
app.use('/result', authenticateToken, (await import('./routes/database/result')).router)
app.use('/report', authenticateToken, (await import('./routes/database/report')).router)
app.use('/notification', authenticateToken, (await import('./routes/database/notification')).router)



app.use('*all', async (req, res, next) => {
  if (req.originalUrl.startsWith('/login')) return next()
  authenticateToken(req, res, next)
})

app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace('/', '')

    const html = !isProduction
      ? await vite.transformIndexHtml(url, await fs.readFile('./index.html', 'utf-8'))
      : await fs.readFile('./dist/client/index.html', 'utf-8')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  }
  catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

httpServer.listen(5173, () => console.log(`Server started at http://localhost:5173`));
