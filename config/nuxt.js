const pkg = require('../package')
const resolve = require('path').resolve

const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'universal',

  srcDir: resolve(__dirname, '..', 'resources'),

  router: {
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ],
    script:[
      {src: "https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js"},
      {hid:'adonis', src: "https://unpkg.com/@adonisjs/websocket-client@1.0.9/dist/Ws.browser.js"}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#FFFFFF' },

  /*
  ** Global CSS
  */
  css: [
    'vuetify/src/stylus/main.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/general',
    '@/plugins/wgt-components/_index.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseUrl:'http://localhost:3000/'
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    cssSourceMap: false, // wgt evita que aparezca el error 404 de Vuetify
    babel:{
      presets: ['vue-app'],
      plugins: ["@babel/plugin-transform-regenerator"]
    },
    
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
