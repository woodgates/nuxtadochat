<template>
  <v-flex>
    <v-text-field
      ref="chatInput"
      :error-messages="null"
      v-model="myNewFeed"
      name="feed"
      required
      :autofocus=true
      placeholder="Enter message"
      autocomplete="off"
      pattern="^[a-zA-Z]+\.[a-zA-Z]"
    ></v-text-field>

    <v-btn color="success" @click="$emit(submitted)">Postear</v-btn>
  </v-flex>

</template>

<script>
  export default {
    
  }
</script>

<style scoped>

</style>