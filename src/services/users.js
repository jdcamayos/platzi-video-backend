import MongoLib from '../lib/mongo.js'
import bcrypt from 'bcrypt'

export default class UsersService {
  constructor() {
    this.collection = 'users'
    this.mongoDB = new MongoLib()
  }

  async getUser({ email }) {
    const [user] = await this.mongoDB.getAll(
      this.collection,
      { email }
    )
    return user || {}
  }

  async createUser({ user }) {
    const { name, email, password } = user
    const hashedPassword = await bcrypt.hash(password, 10)
    const createdUserId = await this.mongoDB.create(
      this.collection,
      { name, email, password: hashedPassword }
    )
    return createdUserId
  }

  async getOrCreateUser({ user }) {
    const { email } = user
    const userExists = await this.getUser({ email })
    if (userExists) {
      return userExists
    }
    const createdUserId = await this.createUser({ user })
    return createdUserId
  }
}
