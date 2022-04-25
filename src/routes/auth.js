import '../utils/auth/basic.js'
import { config } from '../config/index.js'
import { createUserSchema, createProviderUserSchema } from '../utils/schemas/users.js'
import ApiKeysService from '../services/apiKeys.js'
import UsersService from '../services/users.js'
import boom from '@hapi/boom'
import express from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import validationHandler from '../utils/middleware/validationHandler.js'

export default function authApi(app) {
  const router = express.Router()
  app.use('/api/auth', router)

  const apiKeysService = new ApiKeysService()
  const usersService = new UsersService()

  router.post('/sign-in', async function (req, res, next) {
    const { apiKeyToken } = req.body

    if (!apiKeyToken) {
      return next(boom.unauthorized('apiKeyToken is required'))
    }

    passport.authenticate('basic', function (error, user) {
      try {
        if (error || !user) {
          return next(boom.unauthorized())
        }

        req.login(user, { session: false }, async function (error) {
          if (error) {
            return next(error)
          }

          const apiKey = await apiKeysService.getApiKey({
            token: apiKeyToken,
          })

          console.log(apiKey)

          if (!apiKey) {
            return next(boom.unauthorized())
          }

          console.log(apiKey)
          const { _id: id, name, email } = user
          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes,
          }
          const token = jwt.sign(payload, config.authJwtSecret, {
            // expiresIn: '15m',
          })
          return res.status(200).json({ token, user: { id, name, email } })
        })
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  })

  router.post('/sign-up', validationHandler(createUserSchema), async function (req, res, next) {
    const { body: user } = req

    try {
      const createdUserId = await usersService.createUser({ user })

      res.status(201).json({
        data: createdUserId,
        message: 'user created',
      })
    } catch (error) {
      next(error)
    }
  })

  router.post('/sign-provider', validationHandler(createProviderUserSchema), async function (req, res, next) {
    const { body } = req

    const { apiKeyToken, ...user } = body

    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'))
    }

    try {
      const queriedUser = await usersService.getOrCreateUser({ user })
      const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken })

      if (!apiKey) {
        return next(boom.unauthorized())
      }

      const { _id: id, name, email } = queriedUser

      const payload = {
        sub: id,
        name,
        email,
        scopes: apiKey.scopes,
      }

      const token = jwt.sign(payload, config.authJwtSecret, {
        // expiresIn: '15m',
      })

      return res.status(200).json({ token, user: { id, name, email } })
    } catch (error) {
      next(error)
    }
  })
}
