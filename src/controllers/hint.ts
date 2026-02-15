import { Request, Response } from "express";
import { prisma } from "../config/db";

export const hint = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    // Get progress
    const progress = await prisma.progress.findUnique({
      where: { userId }
    });

    if (!progress) {
      return res.status(400).json({
        success: false,
        message: "Quiz not started"
      });
    }

    const lifelines = progress.lifelines as {
      hint: boolean;
      freeze: boolean;
      flip: boolean;
    };

    //Check if hint already used
    if (lifelines.hint === true) {
      //200 -> 400 
      return res.status(200).json({
        success: false,
        message: "Hint already used"
      });
    }

    const questionIds: string[] = progress.questionIds || [];
    const currentIdx = progress.currentQuestionIdx;

    if (currentIdx >= questionIds.length) {
      return res.status(400).json({
        success: false,
        message: "No current question available"
      });
    }

    const currentQuestionId = questionIds[currentIdx] as string;

    const question = await prisma.question.findUnique({
      where: { id: currentQuestionId }
    });

    if (!question) {
      //400 -> 404
      return res.status(400).json({
        success: false,
        message: "Question not found"
      });
    }

    // Update lifelines only
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

    return res.status(200).json({
      success: true,
      data: {
        hint: question.hint || "No hint available for this question",
        lifelines: updatedLifelines
      }
    });

  } catch (error) {
    console.error("Hint Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};