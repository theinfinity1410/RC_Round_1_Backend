import express from 'express'
import quizRouter from './routes/quiz.js'
import authRouter from './routes/auth.js'
import lifelinesRouter from './routes/lifelines.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/quiz', quizRouter)
app.use('/auth', authRouter)
app.use('/lifelines', lifelinesRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

/*
    To test all the routes, hit following endpoints on postman (after you write the code obv)
    1. https://localhost:3000/quiz/start
    2. https://localhost:3000/quiz/next
    3. https://localhost:3000/quiz/leaderboard
    4. https://localhost:3000/quiz/submit
    5. https://localhost:3000/auth/login
    6. https://localhost:3000/lifelines/flip
    7. https://localhost:3000/lifelines/freeze
    8. https://localhost:3000/lifelines/hint
*/