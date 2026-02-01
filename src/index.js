import express from 'express';
import dotenv from 'dotenv';

import quizRoutes from './routes/quiz.js';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/question.js';
import lifelineRoutes from './routes/lifeline.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/lifeline', lifelineRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
