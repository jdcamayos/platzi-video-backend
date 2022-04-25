import chalk from 'chalk'
import crypto from 'crypto'
import MongoLib from '../../lib/mongo.js'

const adminScopes = [
  'signin:auth',
  'signup:auth',
  'read:movies',
  'create:movies',
  'update:movies',
  'delete:movies',
  'read:user-movies',
  'create:user-movies',
  'delete:user-movies',
]

const publicScopes = [
  'signin:auth',
  'signup:auth',
  'read:movies',
  'read:user-movies',
  'create:user-movies',
  'delete:user-movies',
]

const apiKeys = [
  {
    token: generateRandomToken(),
    scopes: adminScopes,
  },
  {
    token: generateRandomToken(),
    scopes: publicScopes,
  },
]

function generateRandomToken() {
  const buffer = crypto.randomBytes(32)
  return buffer.toString('hex')
}

export default async function seedApiKeys() {
  try {
    const mongoDB = new MongoLib()

    const promises = apiKeys.map(async apiKey => {
      await mongoDB.create('api-keys', apiKey)
    })

    await Promise.all(promises)
    console.log(chalk.green(`${promises.length} api keys have been created succesfully`)); // prettier-ignore
    return
  } catch (error) {
    console.log(chalk.red(error))
  }
}
