import express from 'express';
import quizRouter from './routes/quiz.js';
import authRouter from './routes/auth.js';
import lifelinesRouter from './routes/lifelines.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/quiz', quizRouter);
app.use('/auth', authRouter);
app.use('/lifelines', lifelinesRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
