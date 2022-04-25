import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import boom from '@hapi/boom'
import { config } from '../../config/index.js'
import UsersService from '../../services/users.js'

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async function (tokenPayload, callback) {
      const usersService = new UsersService()

      try {
        const user = await usersService.getUser({
          email: tokenPayload.email,
        })

        if (!user) {
          return callback(boom.unauthorized(), false)
        }

        delete user.password

        return callback(null, {
          ...user,
          scopes: tokenPayload.scopes,
        })
      } catch (error) {
        return callback(boom.badImplementation(error))
      }
    }
  )
)
