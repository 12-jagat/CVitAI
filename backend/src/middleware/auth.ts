import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const generateAccessToken = (user: IUser): string => {
  return jwt.sign({ id: user._id, email: user.email }, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign({ id: user._id }, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Read from header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Read from cookies
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Not authorized, token missing' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string };

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Auth Error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};
