<template>
  <div>  
    <div v-if="username">
      <v-layout>
        <v-flex class="offset-xs3 xs6">
      <h2>
        <span>Hello {{ username }}! </span>
        <span v-if="isConnected">conectado</span>
        <span v-else>desconectado</span>
      </h2>
        </v-flex>
      </v-layout>

        <v-layout>
          <v-flex>
            <v-text-field
              ref="chatInput"
              :error-messages="null"
              v-model="myNewFeed.body"
              name="feed"
              required
              :autofocus=true
              placeholder="Enter message"
              autocomplete="off"
              pattern="^[a-zA-Z]+\.[a-zA-Z]"
            ></v-text-field>

            <wgt-chatimage-upload
              @input="imageLoaded"
            ></wgt-chatimage-upload>

        <v-btn color="success" @click="submitFeed">Postear</v-btn>
          </v-flex>
        </v-layout>

      <v-layout>
          <v-flex class="xs8 offset-xs2">
            <v-list class="py-0">
                <v-card class="mb-2"
                  v-for="(feed, index) in feeds"
                  v-if="feed.body"
                  :key="index">
                  <v-card-text >
                    <v-chip>{{feed.username}}</v-chip>
                    {{ feed.body }}
                  </v-card-text>
                </v-card>
            </v-list>
        </v-flex>
      </v-layout>

     </div>
        <div  v-else class="onboard">
          <v-layout row>
            <v-flex offset-xs2 xs7>
            <v-text-field
              label="Nombre"
              v-model="newUsername"
              name="username"
              placeholder="Enter your name"
              :autofocus=true
              pattern="[A-Za-z0-9]"
            ></v-text-field>
            </v-flex>
            <v-flex xs3>
            <v-btn color="success" @click="nameSubmitted">Entrar</v-btn>
            </v-flex>
          </v-layout>
    </div>
  </div>
</template>

  <script>

  // import Ws from '@adonisjs/websocket-client'

    export default{
      data(){
        return{
          username:'jorge',
          newUsername:'',
          ws:null,
          isConnected:false,
          myNewFeed:{
            body:'',
            image:null
          },
          feeds:[{
            username:"juanito",
            body:"aqui estoy yo"
          }]
        }
      },
      methods:{
        nameSubmitted(event){
          this.username = this.newUsername;
          this.startChat()
        },
        startChat(){
            this.ws = adonis.Ws().connect()
            this.ws.on('open', () => {
             this.isConnected = true;
              this.subscribeToChannel()
            })

            this.ws.on('error', () => {
              this.isConnected = false
            })
        },
        subscribeToChannel () {
          const chat = this.ws.subscribe('chat')

          chat.on('error', () => {
            this.isConnected = false
          })

          chat.on('message', (message) => {
            this.feeds.unshift(message)
          })
        },
        submitFeed(event){
          event.preventDefault()
          this.ws.getSubscription('chat').emit('message', {
            username: this.username,
            body: this.cleanInput,
            image:this.myNewFeed.image
          })
          this.myNewFeed=''
          return false

        },
        imageLoaded(event){
          this.myNewFeed.image = event
        }

      },
      computed:{
        cleanInput(input){
          let newValue = this.myNewFeed.body.replace(/[&\/\\#,~.'":*<>{}]/g,'') 
          return newValue
        }
      },

      mounted(){
        if(this.username){this.startChat()}
      },
  head () {
    return {

    } 
  }
    }
  </script>



