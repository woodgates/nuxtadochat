'use strict'

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onMessage (message) {
     this.socket.broadcastToAll('message', message)
  }

  onSubscribe(user){
    console.log('subscribed');
  }
}

module.exports = ChatController
