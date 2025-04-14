import { Router } from 'express'
import { eq, or } from 'drizzle-orm'
import cookie from 'cookie'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Users } from '../database/entity/user'
import { db } from '../database/driver'
import { transporter } from '../mailer'
import { Teachers } from '../database/entity'
import { checkUserExists, validateOTP } from './middleware'

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
      { user_id: user.id, username: user.name , role:user.role},
      process.env.JWT_SECRET!,
    )

    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 400, // 400 days (https://github.com/httpwg/http-extensions/pull/1732)
      path: '/'
    }))

    res.status(200).json({ msg: 'success',token: token })
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
  const dateOfBirth = req.body.dateOfBirth
  const gender = req.body.gender
  const phoneNumber = req.body.phone
  const address = req.body.address
  const photo = req.body.photo || '/avatar.png'
  const role = req.body.role ?? 'teacher'

  const user = (await db.select().from(Users).where(or(eq(Users.username, username), eq(Users.email, email)))).at(0)
  if (!user) {
    let insertedUser = await db.insert(Users).values({
      username,
      password: await bcrypt.hash(password, +process.env.SALT_ROUND!),
      email,
      name,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      phoneNumber,
      address,
      photo,
      role,
    })

     // Nếu người dùng là giáo viên, thêm bản ghi vào bảng TEACHER
     if (role === 'teacher') {
      await db.insert(Teachers).values({
        userID: insertedUser[0].insertId,
        experience: req.body.experience || 0,  
        specialization: req.body.specialization || '',  
      })
    }

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

    res.status(200).json({ msg: 'success', token: token })
  }
  else {
    if (user.username === username)
      res.status(400).json({ msg: 'Username already exists' })
    else if (user.email === email)
      res.status(400).json({ msg: 'Email already exists' })
  }
})

expressRouter.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const [user] = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Email không tồn tại'
        });
      }
      
    // Xóa OTP cũ nếu có
    res.clearCookie('otp', { secure: process.env.NODE_ENV === 'production' });
    res.clearCookie('otpExpiry', { secure: process.env.NODE_ENV === 'production' });

    // Tạo OTP ngẫu nhiên (6 chữ số)
    const otp = Math.floor(100000 + Math.random() * 900000);
    
      // Lưu OTP vào cookie với thời gian hết hạn
      const otpExpiry = Date.now() + 10 * 60 * 1000;  // OTP có hiệu lực trong 10 phút
      res.cookie('otp', otp, { maxAge: 10 * 60 * 1000});  // Lưu OTP vào cookie
      res.cookie('otpExpiry', otpExpiry, { maxAge: 10 * 60 * 1000});  // Lưu thời gian hết hạn vào cookie

    // Tạo nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Forgot Password - OTP Verification',
      text: `Here is your OTP code to change password: ${otp}`,
    };

    // Gửi email chứa OTP
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Lỗi khi gửi email:', err);
        return res.status(500).send('Không thể gửi OTP. Vui lòng thử lại sau.');
      }

      console.log('Email đã được gửi:', info.response);
      return res.status(200).json({ message: 'OTP đã được gửi đến email của bạn.' });
    });
  } catch (error) {
    console.error('Lỗi hệ thống:', error);
    return res.status(500).send('Có lỗi xảy ra. Vui lòng thử lại sau.');
  }
})

expressRouter.post('/check-email', async (req, res) => {
  const { email } = req.body;

  try {
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
    const user = (await db.select().from(Users).where(eq(Users.email, email))).at(0);

    if (user) {
      // Nếu email tồn tại, trả về thành công
      return res.status(200).json({ message: 'Email người dùng hợp lệ.' });
    } else {
      // Nếu email không tồn tại, trả về lỗi
      return res.status(404).json({ message: 'Email không tồn tại.' });
    }
  } catch (error) {
    console.error('Lỗi hệ thống:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
  }
});

expressRouter.post('/verify-otp',validateOTP,checkUserExists, async (req, res) => {
  try {
    return res.status(200).json({ message: 'OTP hợp lệ. Bạn có thể thay đổi mật khẩu.' });
  } catch (error) {
    console.error('Lỗi hệ thống:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
  }
});

expressRouter.post('/forgot',validateOTP, async (req, res) => {
  const {email,otp, newPassword } = req.body;

  try {
    // Cập nhật mật khẩu mới
    const user = (await db.select().from(Users).where(eq(Users.email, email))).at(0);
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống.' });
    }
    await db.update(Users).set({ password: await bcrypt.hash(newPassword, +process.env.SALT_ROUND!) }).where(eq(Users.id, user.id));

    // Xóa cookie OTP và thời gian hết hạn sau khi thay đổi mật khẩu
    res.clearCookie('otp', { secure: process.env.NODE_ENV === 'production' });
    res.clearCookie('otpExpiry', { secure: process.env.NODE_ENV === 'production' });

    return res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công.' });
  } catch (error) {
    console.error('Lỗi hệ thống:', error);
    return res.status(500).send({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau.'});
  }
})

expressRouter.post('/logout', async (req, res) => {
  res.clearCookie('token', { secure: process.env.NODE_ENV === 'production' })
  res.send('SUCCESS')
})

export const router = expressRouter
