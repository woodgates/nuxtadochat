<template>
<div>
  <v-layout>
    <v-flex text-xs-center>
      <h1 class="display-3 font-weight-thin">Feeds {{message}}</h1>
    </v-flex>
  </v-layout>
  <v-layout>
    <v-flex class="offset-xs3 xs6">
      <wgt-form inline-template
        name="submit-feed"
        post-url="/api.v1/feeds"
        @submit-success="updateFeed"
      >
  
      <v-form 
        ref="vform" 
        name="vformname"
        >
            
        <v-text-field
          :error-messages="null"
          v-model="itemFields.feed"
          name="feed"
          rows="1"
          required
          pattern="[a-z]"
        ></v-text-field>
        
        <v-input
          :messages="['Messages']"
          append-icon="close"
          prepend-icon="phone"
        >
          
        </v-input>


        
        <v-btn color="success" @click="submitForm">Postear</v-btn>
        
      </v-form>
      </wgt-form>
    </v-flex>
  </v-layout>
  <br>
  <v-layout>
      <v-flex class="xs8 offset-xs2">
        <v-list>
          <v-flex 
              v-for="(feed, index) in feeds"
              v-if="feed.comment"
              :key="index"
              >
            <v-card class="mb-2">
              <v-card-title primary-title>
                {{ feed.comment }}
              </v-card-title>
            </v-card>
          </v-flex>
        </v-list>
    </v-flex>
  </v-layout>

      <v-dialog
      v-model="dialog.show"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">El siguiente feed fue ingresado:</v-card-title>

        <v-card-text>
          {{dialog.text}}
        </v-card-text>
      </v-card>
      </v-dialog>

  </div>
</template>

<script>

export default {
  data(){
    return {
     message: 'Hello ',
     newFeed:{
       name:'',
       feed:''
     },
     dialog:{
       show:false,
       text:''
     }
    }
  },
  methods:{
    updateFeed(data){

     this.feeds.unshift(data)

      // this.$axios.$get('api.v1/feeds')
      //   .then(response => {
      //     this.feeds = response
      //   })
    }
  },
  async asyncData (app) {
    const res = await app.$axios.$get('api.v1/feeds')

    return { feeds: res}

  },

}
</script>
