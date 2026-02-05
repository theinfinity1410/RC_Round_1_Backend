export async function freezeMiddleware(req, res, next) {
  try {
    const userId = req.user.id;

    const progress = await prisma.progress.findUnique({
      where: { userId }
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const lifelines = progress.lifelines || {};

    if (lifelines.freeze === true) {
      return res
        .status(403)
        .json({ message: "Freeze lifeline already used" });
    }

    req.progress = progress;

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}