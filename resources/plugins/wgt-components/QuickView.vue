<template>
  <div class="quickview" :class="{'is-active':show}">
    <header class="quickview-header" :class="setClass" v-if="this.$slots.header">
      <slot name="header"></slot>
      <span class="delete" @click="hideQV"></span>
    </header>

    <div class="quickview-body" >
      <div class="quickview-block" :class="setClass">
        <slot name="body"></slot>
      </div>
    </div>

    <footer class="quickview-footer" v-if="this.$slots.footer">
      <slot name="footer"></slot>
    </footer>

    <portal to="qv-show">
      <div @click="showQV">
        <slot name="show"></slot>
      </div>
    </portal>

  </div>
</template>

<script>

export default {
  name: 'QuickView',
  props: {
    setClass:{
      type:String,
      default:''
    },
  },
  data() {
    return {
      show:false
    }
  },
  methods:{
    showQV(){
      this.show=true
      this.$emit('show')
    },
    hideQV(){
      this.show=false
      this.$emit('close')
    }
  },
}
</script>

<style lang="sass" scoped>
  // estilos en resources/sass/vue/quickview.sass
</style>