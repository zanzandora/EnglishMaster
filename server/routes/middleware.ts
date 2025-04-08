import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Users } from '../database/entity'
import { db } from '../database/driver'
import { eq } from 'drizzle-orm';


export interface AuthRequest extends Request {
  user?: any
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const token = req.cookies?.token

  if (!token) {
    return res.redirect('/login')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: true, message: 'Forbidden: Invalid token' })
  }
}

export const checkUserExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [user] = await db
      .select({ id: Users.id })
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Email không tồn tại trong hệ thống' 
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateOTP = async (req, res, next) => {
    try {
      const { otp } = req.body;
      const { otp: cookieOTP, otpExpiry } = req.cookies;

      // Kiểm tra OTP trong cookie
      if (!cookieOTP || !otpExpiry || Date.now() > parseInt(otpExpiry)) {
        return res.status(400).json({ message: 'OTP hết hạn hoặc không tồn tại' });
      }
    
      if (cookieOTP !== otp) {
        return res.status(401).json({ message: 'OTP không hợp lệ' });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
