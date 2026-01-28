import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

export async function useFreezeLifeline(req, res) {
  const userId = req.user.id; // or req.body.userId

  const progress = await prisma.progress.findUnique({
    where: { userId }
  });

  const lifelines = progress.lifelines as any;

  if (lifelines.freeze?.used) {
    return res.status(400).json({ message: "Freeze already used" });
  }

  lifelines.freeze = {
    used: true,
    endsAt: new Date(Date.now() + 60 * 1000)
  };

  await prisma.progress.update({
    where: { userId },
    data: { lifelines }
  });

  res.json({ message: "Freeze activated for 60 seconds" });
}
