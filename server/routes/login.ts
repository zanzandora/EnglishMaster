import { Router } from 'express'
import { eq, or } from 'drizzle-orm'
import cookie from 'cookie'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Users } from '../database/entity/user'
import { db } from '../database/driver'
import { transporter } from '../mailer'

const expressRouter = Router()

expressRouter.post('/login', async (req, res): Promise<any> => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(400).json({ msg: 'Username and password are required' })
  }

  try {
    const user = (await db.select().from(Users).where(eq(Users.username, username))).at(0)
    if (!user)
      return res.status(401).json({ msg: 'User not found' })

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ msg: 'Invalid username or password' })

    const token = jwt.sign(
      { user_id: user.id, username: user.name },
      process.env.JWT_SECRET!,
    )

    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 400, // 400 days (https://github.com/httpwg/http-extensions/pull/1732)
      path: '/'
    }))

    res.status(200).json({ msg: 'success' })
  }
  catch (e) {
    res.status(500).json({ msg: 'Internal server error' })
  }
})

expressRouter.post('/register', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email
  const name = req.body.name
  const age = req.body.age
  const gender = req.body.gender
  const phoneNumber = req.body.phone
  const address = req.body.address

  const user = (await db.select().from(Users).where(or(eq(Users.username, username), eq(Users.email, email)))).at(0)
  if (!user) {
    let insertedUser = await db.insert(Users).values({
      username,
      password: await bcrypt.hash(password, +process.env.SALT_ROUND!),
      email,
      name,
      age,
      gender,
      phoneNumber,
      address,
    })

    const token = jwt.sign(
      { user_id: insertedUser[0].insertId, username },
      process.env.JWT_SECRET!,
    )

    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 400, // 400 days (https://github.com/httpwg/http-extensions/pull/1732)
      path: '/'
    }))

    res.status(200).json({ msg: 'success' })
  }
  else {
    if (user.username === username)
      res.status(400).json({ msg: 'Username already exists' })
    else if (user.email === email)
      res.status(400).json({ msg: 'Email already exists' })
  }
})

expressRouter.post('/forgot', async (req, res) => {
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

expressRouter.post('/logout', async (req, res) => {
  res.clearCookie('token', { secure: process.env.NODE_ENV === 'production' })
  res.send('SUCCESS')
})

export const router = expressRouter
