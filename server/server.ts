// Trimmed down version of https://github.com/bluwy/create-vite-extra/blob/master/template-ssr-react-ts/server.js

import 'dotenv/config'
import fs from 'node:fs/promises'
import express from 'express'
import { ViteDevServer } from 'vite'

import loginRoute from './routes/login'

const isProduction = process.env.NODE_ENV === 'production'

const app = express()
app.use(express.static('./client/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

loginRoute(app)

app.use('/student', (await import('./routes/database/student')).router)
app.use('/teacher', (await import('./routes/database/teacher')).router)
app.use('/user', (await import('./routes/database/user')).router)
app.use('/course', (await import('./routes/database/course')).router)
app.use('/attendance', (await import('./routes/database/attendance')).router)
app.use('/class', (await import('./routes/database/class')).router)

app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace('/', '')

    let html = !isProduction
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

app.listen(5173, () => console.log(`Server started at http://localhost:5173`))
