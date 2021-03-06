import Joi from 'joi'

export const userIdSchema = Joi.object({ userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/) })

const userSchema = {
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(255).required(),
}

export const createUserSchema = Joi.object({
  ...userSchema,
  isAdmin: Joi.boolean(),
})

export const createProviderUserSchema = Joi.object({
  ...userSchema,
  apiKeyToken: Joi.string().required(),
})
