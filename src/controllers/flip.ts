/*
  Flip Question Controller
  User will hit this route and we just have to send new question.
*/

import { Request, Response } from "express";
import { prisma } from "../config/db";

export const flip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    // 📦 Get Progress
    const progress = await prisma.progress.findUnique({
      where: { userId }
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found"
      });
    }

    // 🧠 Lifelines
    const lifelines = progress.lifelines as {
      hint: boolean;
      freeze: boolean;
      flip: boolean;
    };

    // ❌ Flip already used
    if (lifelines.flip) {
      return res.status(400).json({
        success: false,
        message: "Flip lifeline already used"
      });
    }

    if (!progress.currentQuestionId) {
      return res.status(400).json({
        success: false,
        message: "No active question"
      });
    }

    // 📍 Get Current Question
    const currentQuestion = await prisma.question.findUnique({
      where: { id: progress.currentQuestionId }
    });

    if (!currentQuestion) {
      return res.status(404).json({
        success: false,
        message: "Current question not found"
      });
    }

    // 🚫 Exclude Used Questions
    const excludeIds = [
      progress.currentQuestionId,
      ...progress.correctQuestionIds
    ];

    // 🔍 Get Possible Flip Questions
    const possibleQuestions = await prisma.question.findMany({
      where: {
        category: currentQuestion.category,
        id: {
          notIn: excludeIds
        }
      }
    });

    if (possibleQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No flip questions available"
      });
    }

    // 🎲 Pick Random Question
    const randomIndex = Math.floor(Math.random() * possibleQuestions.length);
    const newQuestion = possibleQuestions[randomIndex];

    if (!newQuestion) {
      return res.status(400).json({
        success: false,
        message: "Failed to select a flip question"
      });
    }

    // ✏️ Update Lifeline + Current Question
    const updatedLifelines = {
      ...lifelines,
      flip: true
    };

    await prisma.progress.update({
      where: { userId },
      data: {
        currentQuestionId: newQuestion.id,
        lifelines: updatedLifelines
      }
    });

    return res.status(200).json({
      success: true,
      data: newQuestion
    });

  } catch (error) {
    console.error("Flip Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
