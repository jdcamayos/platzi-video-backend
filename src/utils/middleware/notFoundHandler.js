import { notFound } from '@hapi/boom'

export default function notFoundHandler(req, res) {
  const {
    output: { statusCode, payload },
  } = notFound()

  res.status(statusCode).json(payload)
}
