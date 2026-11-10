import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { env } from '../config/env';
import { AppError } from './errorHandler';
import { User, UserRole } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check HttpOnly cookie first
    if (req.cookies && req.cookies[env.COOKIE_NAME]) {
      token = req.cookies[env.COOKIE_NAME];
    }
    // Fallback to Bearer token header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Authentication required. Please log in to access this resource.', 401);
    }

    const decoded = verifyToken(token);

    // Verify user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new AppError('The user belonging to this session is no longer active.', 401);
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new AppError('Session expired or invalid. Please sign in again.', 401));
      return;
    }
    next(error);
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Access forbidden: You do not have permission for this action.', 403);
    }
    next();
  };
};
