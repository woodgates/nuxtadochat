'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

 const Factory = use('Factory');


Factory.blueprint('App/Models/Feed', async (faker) => {
  return {
    comment: faker.sentence()
  }
})

/**
  Factory.blueprint('App/Models/User', (faker) => {
    return {
      username: faker.username()
    }
  })
*/
