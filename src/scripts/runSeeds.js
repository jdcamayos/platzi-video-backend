import seedApiKeys from './seeds/seedApiKeys.js'
import seedMovies from './seeds/seedMovies.js'
import seedUsers from './seeds/seedUsers.js'
;(async () => {
  console.log('Seeding...')
  await seedApiKeys()
  await seedUsers()
  await seedMovies()
  console.log('Seeding completed')
  process.exit(0)
})()
