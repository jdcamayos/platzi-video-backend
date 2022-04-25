import { badRequest } from '@hapi/boom'

function validate(data, schema) {
  const { error } = schema.validate(data)

  return error
}

export default function validationHandler(schema, check = 'body') {
  return function (req, res, next) {
    const error = validate(req[check], schema)

    error ? next(badRequest(error)) : next()
  }
}
