import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for extracting and verifying JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the user's JWT token from the request headers
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Decode the token to retrieve the ownerId
  const decodedToken = jwt.verify(token, JWT_SECRET);

  if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.body.userId = decodedToken.userId;

  next();
};
