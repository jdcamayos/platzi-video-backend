import chalk from 'chalk'
import MongoLib from '../../lib/mongo.js'
import { moviesMock } from '../../utils/mocks/movies.js'

export default async function seedMovies() {
  try {
    const mongoDB = new MongoLib()

    const promises = moviesMock.map(async movie => {
      await mongoDB.create('movies', movie)
    })

    await Promise.all(promises)
    console.log(chalk.green(`${promises.length} movies have been created succesfully`)); // prettier-ignore
    return
  } catch (error) {
    console.log(chalk.red(error))
  }
}
