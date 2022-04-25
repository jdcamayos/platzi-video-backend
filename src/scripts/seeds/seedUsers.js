import bcrypt from 'bcrypt'
import chalk from 'chalk'
import MongoLib from '../../lib/mongo.js'
import { config } from '../../config/index.js'

const users = [
  {
    email: 'root@undefined.sh',
    name: 'ROOT',
    password: config.defaultAdminPassword,
    isAdmin: true,
  },
  {
    email: 'jose@undefined.sh',
    name: 'Jose Maria',
    password: config.defaultUserPassword,
  },
  {
    email: 'maria@undefined.sh',
    name: 'Maria Jose',
    password: config.defaultUserPassword,
  },
]

async function createUser(mongoDB, user) {
  const { name, email, password, isAdmin } = user
  const hashedPassword = await bcrypt.hash(password, 10)

  const userId = await mongoDB.create('users', {
    name,
    email,
    password: hashedPassword,
    isAdmin: Boolean(isAdmin),
  })

  return userId
}

export default async function seedUsers() {
  try {
    const mongoDB = new MongoLib()

    const promises = users.map(async user => {
      const userId = await createUser(mongoDB, user)
      console.log(chalk.green('User created with id:', userId))
    })

    await Promise.all(promises)
    return
  } catch (error) {
    console.log(chalk.red(error))
  }
}
