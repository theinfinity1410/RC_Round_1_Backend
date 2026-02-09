import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';

import { Request, Response } from 'express';

dotenv.config();



const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Login Credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Login Credentials' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not defined');
    }

    const token = jwt.sign(
      {
        userId: user.userId,  // ✅ correct field
        email: user.email,
        username:user.username,
        isJunior :user.isJunior,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login Successful',
      token
    });

  } catch (err) {
    console.error('JWT ERROR:', err);
    return res.status(500).json({
      message: err instanceof Error ? err.message : 'Server error'
    });
  }
};

export default login;
