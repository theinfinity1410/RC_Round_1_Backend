import { Request, Response } from 'express';
import { prisma } from '../config/db.js';


export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    // const username = req.query.username as string;
    const username = req.user.username as string
    if (!username) {
      return res.status(400).json({
        message: 'username not found in token',
      });
    }

    //  Get user's category 
    const user = await prisma.user.findUnique({
      where: { username },
      select: { isJunior: true },
    });

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    //  Fetch progress of users in same category
    const progressList = await prisma.progress.findMany({
      where: {
        user: {
          isJunior: user.isJunior,
        },
      },
      select: {
        correctCount: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const leaderboard = progressList
      .sort((a, b) => {
        // Priority 1: higher correct answers
        if (b.correctCount !== a.correctCount) {
          return b.correctCount - a.correctCount;
        }
        return a.updatedAt.getTime() - b.updatedAt.getTime();
      })
      .map((item, index) => ({
        rank: index + 1,
        username: item.user.username,
        correctAnswers: item.correctCount,
        lastUpdatedAt: item.updatedAt,
      }));

    return res.status(200).json({
      category: user.isJunior ? 'junior' : 'senior',
      leaderboard,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getUserRank = async (req: Request, res: Response) => {
  try {
    const username = req.user.username as string;

    if (!username) {
      return res.status(400).json({
        message: 'username query param required',
      });
    }

    // Get user progress
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        isJunior: true,
        progress: {
          select: {
            correctCount: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user || !user.progress) {
      return res.status(400).json({
        message: 'User progress not found',
      });
    }

    //  Get all progress in same category
    const allProgress = await prisma.progress.findMany({
      where: {
        user: {
          isJunior: user.isJunior,
        },
      },
      select: {
        correctCount: true,
        updatedAt: true,
      },
    });

    //  Calculate rank manually
    let rank = 1;

    for (const p of allProgress) {
      if (
        p.correctCount > user.progress.correctCount ||
        (
          p.correctCount === user.progress.correctCount &&
          p.updatedAt < user.progress.updatedAt
        )
      ) {
        rank++;
      }
    }

    return res.status(200).json({
      username,
      rank,
      correctAnswers: user.progress.correctCount,
    });
  } catch (error) {
    console.error('User rank error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
