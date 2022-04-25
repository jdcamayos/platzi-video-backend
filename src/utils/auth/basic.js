import { BasicStrategy } from 'passport-http'
import bcrypt from 'bcrypt'
import boom from '@hapi/boom'
import passport from 'passport'
import UsersService from '../../services/users.js'

passport.use(
  new BasicStrategy(async function (
    email,
    password,
    callback
  ) {
    const usersService = new UsersService()

    try {
      const user = await usersService.getUser({ email })

      if (!user) {
        return callback(boom.unauthorized(), false)
      }

      if (
        !(await bcrypt.compare(password, user.password))
      ) {
        return callback(boom.unauthorized(), false)
      }

      delete user.password

      return callback(null, user)
    } catch (error) {
      return callback(boom.badImplementation(error))
    }
  })
)
