import Joi from 'joi'

const idSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/)

export const userMovieIdSchema = Joi.object({ userMovieId: idSchema })

export const createUserMovieSchema = Joi.object({
  userId: idSchema.required(),
  movieId: idSchema.required(),
})
