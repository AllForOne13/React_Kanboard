import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number; // add'id' to the payload structure
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

  if (!token) {
    res.status(401).json({ message: 'Access Denied: No Token Provided' });
    return; 
  }

  try {
    const secretKey = process.env.JWT_SECRET as string; // secret key from environment variables
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    (req as any).user = decoded; // attach user data to the request object
    next(); 
  } catch (err) {
    res.status(403).json({ message: 'Invalid or Expired Token' });
    return; 
    
  }
};
