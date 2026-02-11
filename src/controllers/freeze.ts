import { Request, Response } from "express";
import { prisma } from "../config/db";  

export async function useFreezeLifeline(req: Request, res: Response) {
  const userId = req.user.userId as string;

  let progress = await prisma.progress.findUnique({
    where: { userId }
  });


  if (!progress) {
    //400 -> 404
    return res.status(400).json({ message: "Progress not found" });
  }
  const lifelines = progress.lifelines as {hint:boolean,
    freeze:boolean,
    flip:boolean
  }

  if (lifelines.freeze === true) {
  //  200 -> 400
      return res.status(200).json({
        success: false,
        message: "freeze lifeline already used"
      });
    }

  const user = await prisma.user.findUnique({
    where: { userId }
  });

  if (!user || !user.startTime) {
    return res.status(400).json({ message: "Test not started" });
  }

  const newstartTime = new Date(user.startTime.getTime() + 60 * 1000);

  lifelines.freeze = true;
  await prisma.$transaction([
    prisma.progress.update({
      where: { userId },
      data: { lifelines }
    }),
    prisma.user.update({
      where: { userId },
      data: { startTime: newstartTime }
    })
  ]);

  return res.json({
    message: "Freeze applied",
    success:true
  });
}
// export function getRemainingTime(endTime: Date | null): number {
//   if (!endTime) return 0;

//   const now = Date.now();
//   const remaining = Math.floor((endTime.getTime() - now) / 1000);

//   return Math.max(0, remaining);
// }