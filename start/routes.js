'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route
    .group(()=>{
      Route.resource('feeds', 'FeedController').apiOnly()
    })
    .formats(['json'])
    .prefix('api.v1/');

Route
  .post('users', 'UserController.store')
  .as('storeUser');

Route.any('*', 'NuxtController.render');


