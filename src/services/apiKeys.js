import MongoLib from '../lib/mongo.js'

export default class ApiKeyService {
  constructor() {
    this.collection = 'api-keys'
    this.mongoDB = new MongoLib()
  }

  async getApiKey({ token }) {
    console.log(token)
    const [apiKey] = await this.mongoDB.getAll(
      this.collection,
      { token }
    )
    console.log('queried api key:', apiKey)
    return apiKey
  }
}
