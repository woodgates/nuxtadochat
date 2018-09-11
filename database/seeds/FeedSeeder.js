'use strict'

/*
|--------------------------------------------------------------------------
| FeedSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const Database = use('Database')

class FeedSeeder {
  async run () {
    const usersArray = await Factory
        .model('App/Models/Feed')
        .createMany(5)
  }
}

module.exports = FeedSeeder
