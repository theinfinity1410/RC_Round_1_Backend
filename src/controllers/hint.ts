/* 
    Hint Question Controller
    User will hit this route and we have to send hint for current question.
*/

import { Request, Response } from "express";
import { prisma } from "../config/db";

export const hint = async (req: Request, res: Response) => {
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

    // 🧠 Lifelines JSON
    const lifelines = progress.lifelines as {
      hint: boolean;
      freeze: boolean;
      flip: boolean;
    };

    // ❌ Already used
    if (lifelines.hint) {
      return res.status(400).json({
        success: false,
        message: "Hint already used"
      });
    }

    // ❌ No active question
    if (!progress.currentQuestionId) {
      return res.status(400).json({
        success: false,
        message: "No active question"
      });
    }

    // 📍 Get Question
    const question = await prisma.question.findUnique({
      where: { id: progress.currentQuestionId }
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    // ❌ No hint available
    if (!question.hint) {
      return res.status(400).json({
        success: false,
        message: "No hint available for this question"
      });
    }

    // ✏️ Update Lifeline
    const updatedLifelines = {
      ...lifelines,
      hint: true
    };

    await prisma.progress.update({
      where: { userId },
      data: {
        lifelines: updatedLifelines
      }
    });

    // ✅ Return Hint
    return res.status(200).json({
      success: true,
      hint: question.hint
    });

  } catch (error) {
    console.error("Hint Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
