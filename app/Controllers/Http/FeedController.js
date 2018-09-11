'use strict'
const Feed = use('App/Models/Feed')
/**
 * Resourceful controller for interacting with feeds
 */
class FeedController {
  /**
   * Show a list of all feeds.
   * GET feeds
   */
  async index ({ request, response, view }) {

    return await Feed
                  .query()
                  .orderBy('created_at', 'desc')
                  .fetch();

  }

  /**
   * Render a form to be used for creating a new feed.
   * GET feeds/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new feed.
   * POST feeds
   */
  async store ({ request, response }) {

    const feed = await Feed.create(
      {comment: request.input('feed')}
    )

    response.send(feed);

  }

  /**
   * Display a single feed.
   * GET feeds/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing feed.
   * GET feeds/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update feed details.
   * PUT or PATCH feeds/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a feed with id.
   * DELETE feeds/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = FeedController
