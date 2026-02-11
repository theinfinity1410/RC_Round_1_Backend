import { Request, Response } from "express";
import { prisma } from "../config/db";

export const flip = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    // ✅ Get progress
    const progress = await prisma.progress.findUnique({
      where: { userId }
    });

    if (!progress) {
      return res.status(400).json({
        success: false,
        message: "Quiz not started"
      });
    }

    const lifelines: any = progress.lifelines;

    // ✅ Check if flip already used
    if (lifelines.flip === true) {
      return res.status(400).json({
        success: false,
        message: "Flip lifeline already used"
      });
    }

    const questionIds = [...progress.questionIds];
    const currentIdx = progress.currentQuestionIdx;

    // ✅ Need next question available
    if (currentIdx + 1 >= questionIds.length) {
      return res.status(400).json({
        success: false,
        message: "No next question available to flip"
      });
    }

    // ⭐ MAIN FLIP LOGIC ⭐
    // Replace current question with next question
    // questionIds[currentIdx] = questionIds[currentIdx + 1];
    const nextQuestionIdx = currentIdx + 1;
    let nextQuestionId = questionIds[nextQuestionIdx] as string;

    const question = await prisma.question.findUnique({
      where: { id: nextQuestionId }, select: {
        id: true,
        questionText: true}
    });

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Next question not found"
      });
    }
    // ✅ Update lifelines only
    const updatedLifelines = {
      ...lifelines,
      flip: true
    };

    await prisma.progress.update({
      where: { userId },
      data: {
        questionIds,
        lifelines: updatedLifelines
      }
    });


    
    return res.status(200).json({
      success: true,
      data: {
        question,
        nextQuestionId,
        lifelines: updatedLifelines
      }
    });

  } catch (error) {
    console.error("Flip Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
