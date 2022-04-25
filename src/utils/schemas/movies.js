import Joi from 'joi'

export const movieIdSchema = Joi.object({
  movieId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
})
const movieTitleSchema = Joi.string().min(3).max(255)
const movieYearSchema = Joi.number().min(1888).max(2077)
const movieCoverSchema = Joi.string().uri()
const movieDescriptionSchema = Joi.string().min(3).max(255)
const movieDurationSchema = Joi.number().min(1).max(300)
const movieContentRatingSchema = Joi.string().max(5)
const movieSourceSchema = Joi.string().uri()
const movieTagsSchema = Joi.array().items(Joi.string().min(3).max(50))

export const createMovieSchema = Joi.object({
  title: movieTitleSchema.required(),
  year: movieYearSchema.required(),
  cover: movieCoverSchema.required(),
  description: movieDescriptionSchema.required(),
  duration: movieDurationSchema.required(),
  contentRating: movieContentRatingSchema.required(),
  source: movieSourceSchema.required(),
  tags: movieTagsSchema.required(),
})

export const updateMovieSchema = Joi.object({
  title: movieTitleSchema,
  year: movieYearSchema,
  cover: movieCoverSchema,
  description: movieDescriptionSchema,
  duration: movieDurationSchema,
  contentRating: movieContentRatingSchema,
  source: movieSourceSchema,
  tags: movieTagsSchema,
})
