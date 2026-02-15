//Route to handle next question request
import { Request, Response } from "express";
import { prisma } from "../config/db";

const TIME_LIMIT_MS = 60 * 60 * 1000;

export const next = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const { answer } = req.body;

        if (!userId || answer === undefined) {
            return res.status(400).json({
                success: false,
                message: "userId and answer are required"
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
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // end time = createdAt + TIME_LIMIT_MS - elapsed
        const startTimeMs = new Date(user.startTime!).getTime();
        const elapsed = Date.now() - startTimeMs;
        const remainingTimeMs = startTimeMs + TIME_LIMIT_MS - Date.now();

        if (elapsed > TIME_LIMIT_MS) {
            return await autoSubmit(userId, res);
        }

        const { currentQuestionIdx, questionIds } = progress;

        if (currentQuestionIdx >= questionIds.length) {
            return res.status(400).json({
                success: false,
                message: "No more questions. Please submit."
            });
        }
        ``
        const questionId = questionIds[currentQuestionIdx];
        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: "Invalid current question index"
            });
        }

        const question = await prisma.question.findUnique({
            where: { id: questionId }
        });

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question not found"
            });
        }

        let marks = progress.marks;
        let correctCount = progress.correctCount;

        if (answer === question.answer) {
            marks += 1;
            correctCount += 1;
        }

        const attemptedCount = progress.attemptedCount + 1;
        const nextIdx = currentQuestionIdx + 1;

        await prisma.progress.update({
            where: { userId },
            data: {
                currentQuestionIdx: nextIdx,
                attemptedCount,
                correctCount,
                marks
            }
        });

        let isLastQuestion = false
        if (nextIdx == questionIds.length-1) {
           // 200 -> 204
            // return res.status(204).json({
            //     success: true,
            //     message: "Last question reached. Please submit.",
            //     remainingTimeMs,
            //     lifelinesUsed: progress.lifelines,
            //     isLastQuestion: true
            // });
            isLastQuestion=true

        }

        const nextQuestionId = questionIds[nextIdx];
        if (!nextQuestionId) {
            return res.status(400).json({
                success: false,
                message: "Invalid next question index"
            });
        }

        const nextQuestion = await prisma.question.findUnique({
            where: { id: nextQuestionId }
        });

        if (!nextQuestion) {
            return res.status(400).json({
                success: false,
                message: "Next question not found"
            });
        }

        return res.status(200).json({
            success: true,
            correctCount:correctCount,//correctcount
            data: {
                id: nextQuestion.id,
                questionText: nextQuestion.questionText
            },
            remainingTimeMs,
            lifelinesUsed: progress.lifelines,
            isLastQuestion: isLastQuestion
        });

    } catch (error) {
        console.error("Next Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const autoSubmit = async (userId: string, res: Response) => {
    const progress = await prisma.progress.findUnique({
        where: { userId }
    });

    if (!progress) {
        return res.status(400).json({
            success: false,
            message: "Progress not found"
        });
    }

    const user = await prisma.user.findUnique({
        where: { userId }
    });

    const startTimeMs = user?.startTime
        ? new Date(user.startTime).getTime()
        : Date.now();

    const remainingTimeMs = startTimeMs + TIME_LIMIT_MS - Date.now();

    await prisma.user.update({
        where: { userId },
        data: {
            endTime: new Date(),
            finalResult: progress.marks
        }
    });
   // 200 -> 205
    return res.status(205).json({
        success: true,
        message: "Time over.Quiz auto-submitted.",
        score: progress.marks,
        correctAnswers: progress.correctCount,
        attempted: progress.attemptedCount,
        lifelinesUsed: progress.lifelines,
        remainingTimeMs: Math.max(0, remainingTimeMs)
    });
};