import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

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
