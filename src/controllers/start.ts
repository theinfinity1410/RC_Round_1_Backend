import { Request, Response } from "express";
import { prisma } from "../config/db";

export const start = async (req: Request, res: Response) => {
  try {
    // const{userId}=req.body;
    const userId = req.user?.userId;
    if (!userId){
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const user = await prisma.user.findUnique({
      where: { userId }
    });

    if (!user) {  
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const existingProgress = await prisma.progress.findUnique({
      where: { userId }
    });

    if (existingProgress) {

      const currentQuestionIdx = existingProgress.currentQuestionIdx;
      const questionIds = existingProgress.questionIds;
      const currentQuestionId = questionIds[currentQuestionIdx] as string;
      const currentQuestion = await prisma.question.findUnique({
        where:{
          id:currentQuestionId
        }
      })

      return res.status(400).json({
        success: false,
        message: "Quiz already started",
        "question":currentQuestion
      });
    }

    const questions = await prisma.question.findMany({
      orderBy: { createdAt: "asc" }
    });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions available"
      });
    }

    const questionIds = questions.map(q => q.id);

    await prisma.progress.create({
      data: {
        userId,
        questionIds,
        currentQuestionIdx: 0,
        attemptedCount: 0,
        correctCount: 0,
        marks: 0
      }
    });

    await prisma.user.update({
      where: { userId },
      data: {
        startTime: new Date()
      }
    });

   const firstQuestion = questions[0];

if (!firstQuestion) {
  return res.status(404).json({
    success: false,
    message: "First question not found"
  });
}

return res.status(200).json({
  success: true,
  data: {
    id: firstQuestion.id,
    questionText: firstQuestion.questionText
  }
});


  } catch (error) {
    console.error("Start Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
