import express from 'express'
import passport from 'passport'
import UserMoviesService from '../services/userMovies.js'
import validationHandler from '../utils/middleware/validationHandler.js'
import scopesValidationHandler from '../utils/middleware/scopesValidationHandler.js'
import { userIdSchema } from '../utils/schemas/users.js'
import { createUserMovieSchema, userMovieIdSchema } from '../utils/schemas/userMovies.js'
import '../utils/auth/jwt.js'

export default function userMoviesApi(app) {
  const router = express.Router()
  app.use('/api/user-movies', router)

  const userMoviesService = new UserMoviesService()

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:user-movies']),
    validationHandler(userIdSchema, 'query'),
    async function (req, res, next) {
      const { userId } = req.query

      try {
        const userMovies = await userMoviesService.getUserMovies({
          userId,
        })

        res.status(200).json({ data: userMovies, message: 'User movies listed' })
      } catch (error) {
        next(error)
      }
    }
  )

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:user-movies']),
    validationHandler(createUserMovieSchema, 'body'),
    async function (req, res, next) {
      const userMovie = req.body

      try {
        const createdUserMovieId = await userMoviesService.createUserMovie({
          userMovie,
        })

        res.status(201).json({ data: createdUserMovieId, message: 'User movie created' })
      } catch (error) {
        next(error)
      }
    }
  )

  router.delete(
    '/:userMovieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:user-movies']),
    validationHandler(userMovieIdSchema, 'params'),
    async function (req, res, next) {
      const { userMovieId } = req.params

      try {
        const deletedUserMovieId = await userMoviesService.deleteUserMovie({
          userMovieId,
        })

        res.status(200).json({ data: deletedUserMovieId, message: 'User movie deleted' })
      } catch (error) {
        next(error)
      }
    }
  )
}
