import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || null;

    const baseQuery = `
      SELECT
        p.user_id,
        u.username,
        p.marks,
        EXTRACT(EPOCH FROM (p.updated_at - p.created_at)) AS time_taken,
        u.is_junior
      FROM "Progress" p
      JOIN "User" u ON p.user_id = u.userid
      ORDER BY p.marks DESC, time_taken ASC
    `;

    const finalQuery = limit ? `${baseQuery} LIMIT ${limit}` : baseQuery;

    const results = await prisma.$queryRawUnsafe(finalQuery);

    const juniorLeaderBoard = results.filter((user) => user.is_junior === true);
    const seniorLeaderBoard = results.filter((user) => user.is_junior === false);

    return res.status(200).json({ juniorLeaderBoard, seniorLeaderBoard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error.message);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getUserRank = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: 'username query param required' });
    }

    const userProgress = await prisma.$queryRaw`
      SELECT
        p.user_id,
        u.username,
        p.marks,
        EXTRACT(EPOCH FROM (p.updated_at - p.created_at)) AS time_taken,
        u.is_junior
      FROM "Progress" p
      JOIN "User" u ON p.user_id = u.userid
      WHERE u.username = ${username}
      ORDER BY p.marks DESC, time_taken ASC
      LIMIT 1
    `;

    if (!userProgress || userProgress.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRecord = userProgress[0];

    const rankResult = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT p.user_id) as higher_count
      FROM "Progress" p
      WHERE p.marks > ${userRecord.marks} 
        OR (p.marks = ${userRecord.marks} AND EXTRACT(EPOCH FROM (p.updated_at - p.created_at)) < ${userRecord.time_taken})
    `;

    const rank = (rankResult[0]?.higher_count || 0) + 1;

    return res.status(200).json({
      username: userRecord.username,
      marks: userRecord.marks,
      time_taken: userRecord.time_taken,
      is_junior: userRecord.is_junior,
      rank
    });
  } catch (error) {
    console.error('Error fetching user rank:', error.message);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default { getLeaderboard, getUserRank };


