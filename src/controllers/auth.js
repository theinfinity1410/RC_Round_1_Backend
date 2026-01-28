import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔑 THIS is the important part
    req.user = {
      id: decoded.userId
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
