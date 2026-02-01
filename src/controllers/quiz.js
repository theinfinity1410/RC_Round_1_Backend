const prisma = require('../config/db');

// Next Button 
exports.nextQuestion = async (req, res) => {
  const { answer } = req.body;
  const userId = req.user.userid;

  // 1. Get active quiz
  const quiz = await prisma.progress.findUnique({
    where: { userId },
  });

  if (!quiz || quiz.isCompleted) {
    return res.status(400).json({ error: 'No active quiz' });
  }

  // 2. Get current question
  const currQ = await prisma.question.findUnique({
    where: { id: quiz.currentQuestionId },
  });

  // 3. Save answer
  const answers = quiz.questionProgress || [];

  const newAnswers = [
    ...answers,
    {
      questionId: currQ.id,
      answer,
    },
  ];

  // 4. Find next question
  const doneIds = newAnswers.map(q => q.questionId);

  const nextQ = await prisma.question.findFirst({
    where: { id: { notIn: doneIds } },
    orderBy: { id: 'asc' },
  });

  // 5. Last question reached
  if (!nextQ) {
    await prisma.progress.update({
      where: { progressId: quiz.progressId },
      data: {
        questionProgress: newAnswers,
        currentQuestionId: null,
      },
    });

    return res.json({
      showSubmit: true,
    });
  }

  // 6. Move to next question
  await prisma.progress.update({
    where: { progressId: quiz.progressId },
    data: {
      questionProgress: newAnswers,
      currentQuestionId: nextQ.id,
      currentQuestionStartTime: new Date(),
    },
  });

  res.json({
    showSubmit: false,
    questionId: nextQ.id,
    questionText: nextQ.questionText,
  });
};

// Submit Button 
exports.finalSubmit = async (req, res) => {
  const userId = req.user.userid;

  await prisma.progress.update({
    where: { userId },
    data: { isCompleted: true },
  });

  
  res.json({
    message: 'This will submit the test',  // for api testing on postman 
  });
};
