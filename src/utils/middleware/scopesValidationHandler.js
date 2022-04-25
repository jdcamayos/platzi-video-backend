import { unauthorized } from '@hapi/boom'

export default function scopesValidationHandler(allowedScopes) {
  return function (req, res, next) {
    console.log(req.user)
    if (!req.user || (req.user && !req.user.scopes)) {
      return next(unauthorized('Missing scopes'))
    }

    const hasAccess = allowedScopes
      .map(allowedScope =>
        req.user.scopes.includes(allowedScope)
      )
      .find(allowed => Boolean(allowed))

    if (hasAccess) {
      return next()
    } else {
      return next(unauthorized('Insufficient scopes'))
    }
  }
}
