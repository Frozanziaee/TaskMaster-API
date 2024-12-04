require('dotenv').config()
require('express-async-errors')
const helmet = require('helmet')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

app.use(express.json())
app.use(helmet())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL,
}))

//routers
const authRouter = require('./routes/auth')
const tasksRouter = require('./routes/tasks')
const projectsRouter = require('./routes/projects')
const usersRouter = require('./routes/users')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(
  rateLimiter({
    windowMS: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  })
)

// app.use((req, res) => {
//   res.send("task master api")
// })

app.use((req, res, next) => {
  console.log("REQUEST BODY", req.body)
  req.port = port
  next()
})

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authenticateUser, usersRouter)
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
