import express from 'express'
import passport from 'passport'
import MoviesService from '../services/movies.js'
import { movieIdSchema, createMovieSchema, updateMovieSchema } from '../utils/schemas/movies.js'
import validationHandler from '../utils/middleware/validationHandler.js'
import scopesValidationHandler from '../utils/middleware/scopesValidationHandler.js'
import cacheResponse from '../utils/cacheResponse.js'
import { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } from '../utils/time.js'
import '../utils/auth/jwt.js'

export default function moviesApi(app) {
  const router = express.Router()
  app.use('/api/movies', router)

  const moviesService = new MoviesService()

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    // validationHandler(movieIdSchema, 'query'),
    async function (req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
      const { tags } = req.query

      try {
        const movies = await moviesService.getMovies({
          tags,
        })

        res.status(200).json({ data: movies, message: 'Movies listed' })
      } catch (error) {
        next(error)
      }
    }
  )

  router.get(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    validationHandler(movieIdSchema, 'params'),
    async function (req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
      const { movieId } = req.params

      try {
        const movie = await moviesService.getMovie({
          movieId,
        })

        res.status(200).json({ data: movie, message: 'Movie retrieved' })
      } catch (error) {
        next(error)
      }
    }
  )

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:movies']),
    validationHandler(createMovieSchema),
    async function (req, res, next) {
      const { body: movie } = req

      try {
        const createdMovieId = await moviesService.createMovie({
          movie,
        })

        res.status(201).json({
          data: createdMovieId,
          message: 'Movie created',
        })
      } catch (error) {
        next(error)
      }
    }
  )

  router.put(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:movies']),
    validationHandler(movieIdSchema, 'params'),
    validationHandler(updateMovieSchema),
    async function (req, res, next) {
      const { movieId } = req.params
      const { body: movie } = req

      try {
        const updatedMovieId = await moviesService.updateMovie({
          movieId,
          movie,
        })

        res.status(200).json({
          data: updatedMovieId,
          message: 'Movie updated',
        })
      } catch (error) {
        next(error)
      }
    }
  )

  router.delete(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:movies']),
    validationHandler(movieIdSchema, 'params'),
    async function (req, res, next) {
      const { movieId } = req.params

      try {
        const deletedMovieId = await moviesService.deleteMovie({
          movieId,
        })

        res.status(200).json({
          data: deletedMovieId,
          message: 'Movie deleted',
        })
      } catch (error) {
        next(error)
      }
    }
  )
}
