import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

export async function useFreezeLifeline(req, res) {
  const userId = req.user.id;

  const progress = await prisma.progress.findUnique({
    where: { userId }
  });

  const lifelines = progress.lifelines as any;

  if (lifelines.freeze === true) {
    return res.status(400).json({ message: "Freeze already used" });
  }

  lifelines.freeze = true;

  await prisma.progress.update({
    where: { userId },
    data: {
      totalDuration: progress.totalDuration + 60,
      lifelines
    }
  });

  res.json({ message: "Freeze applied: +60 seconds added" });
}
