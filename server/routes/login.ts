import { Express } from 'express'
import { and, eq } from 'drizzle-orm'

import { Users } from '../database/entity/user'
import { db } from '../database/driver'
import { transporter } from '../mailer'

export default function (app: Express) {
  app.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const user = (await db.select().from(Users).where(and(eq(Users.username, username), eq(Users.password, password)))).at(0)
    if (!user) {
      res.status(401).json({ msg: 'Invalid credentials' })
      return
    }

    res.status(200).json({ msg: 'success' })
  })

  app.post('/register', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const name = req.body.name
    const age = req.body.age
    const gender = req.body.gender
    const phoneNumber = req.body.phone
    const address = req.body.address

    const users = await db.select().from(Users).where(and(eq(Users.username, username), eq(Users.password, password)))
    if (users.length === 0) {
      await db.insert(Users).values({
        username,
        password,
        email,
        name,
        age,
        gender,
        phoneNumber,
        address,
      })
      res.status(200).json({ msg: 'success' })
    }
    else {
      res.status(400).json({ msg: 'Username already exists' })
    }
  })

  app.post('/forgot', async (req, res) => {
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: 'Forgot Password',
      text: 'Đây là mail mẫu cho chức năng quên mật khẩu'
    }, (err, info) => {
      if (err) return res.send('CANNOT SEND EMAIL: ' + err.message)
      return res.send('SUCCESS')
    })
  })
}
