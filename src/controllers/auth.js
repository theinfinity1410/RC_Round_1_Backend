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
//hint lifeline below
export const hintLifeline = async (req, res) => {
  try {
    const userId = req.user.userid;

    // 1️⃣ Fetch progress + current question
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

    // 2️⃣ Check if hint already used
    const lifelines = progress.lifelines;

    if (lifelines.hint === true) {
      return res.status(400).json({ message: "Hint lifeline already used" });
    }

    // 3️⃣ Check if question has hint
    if (!progress.question || !progress.question.hint) {
      return res.status(404).json({ message: "No hint available for this question" });
    }

    // 4️⃣ Update lifeline usage
    await prisma.progress.update({
      where: { userId },
      data: {
        lifelines: {
          ...lifelines,
          hint: true
        }
      }
    });

    // 5️⃣ Return hint
    return res.status(200).json({
      message: "Hint lifeline used successfully",
      hint: progress.question.hint
    });

  } catch (error) {
    console.error("Hint lifeline error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

