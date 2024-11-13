require('dotenv').config()
require('express-async-errors')

// Extra security packages
// const helmet = require('helmet')
const cors = require('cors')
// const rateLimiter = require('express-rate-limit')
// const xss = require('xss-clean')

const express = require('express')
const app = express()

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

//routers
const authRouter = require('./routes/auth')
const tasksRouter = require('./routes/tasks')
const projectsRouter = require('./routes/projects')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// app.use(
//   rateLimiter({
//     windowMS: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
//   })
// )
app.use(express.json())
// app.use(helmet())
app.use(cors())
// app.use(xss())
// extra packages

app.get('/', (req, res) => {
  res.send('Welcome Tasksaster')
})
// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/tasks', authenticateUser, tasksRouter)
app.use('/api/v1/projects', authenticateUser, projectsRouter)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start();