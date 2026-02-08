import { Request, Response } from 'express';
import { prisma } from '../config/db.js';


export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string;

    if (!username) {
      return res.status(400).json({ message: 'username query param required' });
    }

   
    const user = await prisma.user.findUnique({
      where: { username },
      select: { isJunior: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    const progressList = await prisma.progress.findMany({
  where: {
    user: {
      isJunior: user.isJunior
    }
  },
  select: {
    correctQuestionIds: true,
    user: {
      select: {
        username: true
      }
    }
  }
});


    const leaderboard = progressList
      .map(p => ({
        username: p.user.username,
        questionsSolved: p.correctQuestionIds.length
      }))
      .sort((a, b) => b.questionsSolved - a.questionsSolved)
      .map((item, index) => ({
        rank: index + 1,
        username: item.username,
        questionsSolved: item.questionsSolved
      }));

  return res.status(200).json({
  userCategory: user.isJunior ? 'junior' : 'senior',
  userLeaderboard: leaderboard
});

  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const getUserRank = async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string;

    if (!username) {
      return res.status(400).json({ message: 'username query param required' });
    }

   
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        isJunior: true,
        progress: {
          select: {
            correctQuestionIds: true,
            isCompleted: true
          }
        }
      }
    });

   if (!user || !user.progress) {
  return res.status(404).json({ message: 'User progress not found' });
}

    const userSolved = user.progress.correctQuestionIds.length;

 
   const allProgress = await prisma.progress.findMany({
  where: {
    user: {
      isJunior: user.isJunior
    }
  },
  select: {
    correctQuestionIds: true
  }
});


    let rank = 1;

    for (const p of allProgress) {
      if (p.correctQuestionIds.length > userSolved) {
        rank++;
      }
    }

    return res.status(200).json({
      username,
      rank
    });

  } catch (error) {
    console.error('User rank error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
