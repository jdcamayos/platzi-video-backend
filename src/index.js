import { config } from './config/index.js'
import { errorHandler, logErrors, wrapErrors } from './utils/middleware/errorHandler.js'
import authApi from './routes/auth.js'
import express from 'express'
import moviesApi from './routes/movies.js'
import notFoundHandler from './utils/middleware/notFoundHandler.js'
import userMoviesApi from './routes/userMovies.js'

const app = express()

// Body parser middleware
app.use(express.json())
// app.use(helmet())

// Routes
authApi(app)
moviesApi(app)
userMoviesApi(app)

// Catch 404
app.use(notFoundHandler)

// Error handler middleware
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`)
})
