import express from 'express'
import userRouter from './routes/user.router'
import { Response, Request, NextFunction } from 'express'
import buildError from './util/build-errors'
const app = express()

app.use(express.json())

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server ready at : localhost:${PORT}`)
})

app.use('/user', userRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const error = buildError(err)
    res.status(error.code).json({ error })
})

export default app
