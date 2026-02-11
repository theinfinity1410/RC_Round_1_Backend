

import { Request, Response } from "express";
import { prisma } from "../config/db";

export const submit = async (req: Request, res: Response) => {
  try {
    const  userId  = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const progress = await prisma.progress.findUnique({
      where: { userId }
    });

    if (!progress) {
      return res.status(400).json({
        success: false,
        message: "Quiz not started"
      });
    }


    const user = await prisma.user.findUnique({
      where: { userId }
    });

    if (!user || !user.startTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz session"
      });
    }

    await prisma.user.update({
      where: { userId },
      data: {
        finalResult: progress.marks,
        endTime: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      score: progress.marks,
      correctAnswers: progress.correctCount,
      attempted: progress.attemptedCount
    });

  } catch (error) {
    console.error("Submit Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};