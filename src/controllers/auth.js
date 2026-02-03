import prisma from "../generated/prisma/index.js";

/**
 * Flip Question Lifeline
 */
export const flipQuestion = async (req, res) => {
  try {
    const userId = req.user.userid; // from auth middleware

    // 1️⃣ Fetch progress
    const progress = await prisma.progress.findUnique({
      where: { userId },
      include: {
        question: true
      }
    });

    if (!progress) {
      return res.status(404).json({ message: "Quiz not started" });
    }

    if (progress.isCompleted) {
      return res.status(400).json({ message: "Quiz already completed" });
    }

    const lifelines = progress.lifelines;

    // 2️⃣ Check if flip already used
    if (lifelines.flip === true) {
      return res.status(400).json({ message: "Flip lifeline already used" });
    }

    // 3️⃣ Get attempted question IDs
    const attempted = progress.questionProgress.map(
      (q) => q.questionId
    );

    // 4️⃣ Find a new question (same category, not attempted)
    const newQuestion = await prisma.question.findFirst({
      where: {
        category: progress.question?.category,
        id: {
          notIn: attempted
        }
      }
    });

    if (!newQuestion) {
      return res.status(404).json({ message: "No more questions available" });
    }

    // 5️⃣ Update progress
    await prisma.progress.update({
      where: { userId },
      data: {
        currentQuestionId: newQuestion.id,
        currentQuestionStartTime: new Date(),
        lifelines: {
          ...lifelines,
          flip: true
        }
      }
    });

    // 6️⃣ Send question (NO ANSWER)
    return res.status(200).json({
      message: "Question flipped successfully",
      question: {
        id: newQuestion.id,
        category: newQuestion.category,
        questionText: newQuestion.questionText,
        hint: newQuestion.hint
      }
    });

  } catch (error) {
    console.error("Flip lifeline error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
