import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';

import { Request, Response } from 'express';

dotenv.config();  

const login = async (req: Request, res: Response) => {
  try {
    const { teamname, password } = req.body;

    if (!teamname || !password) {
      return res.status(400).json({ message: 'teamname and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { username:teamname }
    });
    
    if (!user) {
      //400 -> 401
      return res.status(400).json({ message: 'Invalid Login Credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      //400 -> 401 
      return res.status(400).json({ message: 'Invalid Login Credentials' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not defined');
    }

    const token = jwt.sign(
      {
        userId: user.userId, 
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

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { teamname, newPassword } = req.body;

    if (!teamname || !newPassword) {
      return res.status(400).json({ message: 'teamname and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await prisma.user.findUnique({
      where: { username: teamname }
    });

    if (!user) {
      //400 -> 401
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { username: teamname },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      message: 'Password reset successfully'
    });

  } catch (err) {
    console.error('Reset Password ERROR:', err);
    return res.status(500).json({
      message: err instanceof Error ? err.message : 'Server error'
    });
  }
};

export { resetPassword };
export default login;
