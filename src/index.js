import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// health check (optional but useful)
app.get("/ping", (req, res) => {
  res.send("pong");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

