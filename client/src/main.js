import Vue from 'vue'
import App from './App'
import Vuerouter from 'vue-router'

Vue.use(Vuerouter)

/* eslint-disable no-new */
let router = new Vuerouter()

router.map({
  '/:canvas': {
    component: App
  }
})

router.start(App, 'app')
// new Vue({
//   el: 'body',
//   components: { App }
// })
