import express from 'express';
import quizRouter from './routes/quiz.js';
import authRouter from './routes/auth.js';
import lifelinesRouter from './routes/lifelines.js';
import authMiddleware from './middlewares/auth.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use('/auth', authRouter);
app.use("/",authMiddleware)
app.use('/quiz', quizRouter);
app.use('/lifelines', lifelinesRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
