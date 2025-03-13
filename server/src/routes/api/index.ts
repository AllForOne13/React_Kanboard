import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ticketRouter } from './ticket-routes.js';
import { userRouter } from './user-routes.js';

interface JwtPayload {
  id: number;
  username: string;
}

// Authentication middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ message: 'Access Denied: No Token Provided' });
    return; 
  }

  try {
    const secretKey = process.env.JWT_SECRET as string; // getsecret key from environment variables
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    (req as any).user = decoded; 
    next(); 
  } catch (err) {
    res.status(403).json({ message: 'Invalid or Expired Token' });
    return; 
  }
};

const router = Router();

// 
router.use('/tickets', authenticateToken, ticketRouter);
router.use('/users', authenticateToken, userRouter);

export default router;
