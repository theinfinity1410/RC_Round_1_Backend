import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { prisma } from '../config/db.js';
import { 
    Request,Response, NextFunction } from 'express';

dotenv.config();


export interface jwtPayload {
    userId: string;
    email: string;
    isJunior : Boolean ;
    username : String;

  };


const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authorization token missing',
      });
    }

    const token = authHeader.split(' ')[1] as string;

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not defined');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as jwtPayload
    
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};

export default authMiddleware;
