import Vue from 'vue'
import Vuerouter from 'vue-router'
import App from './App'

Vue.use(Vuerouter)

/* eslint-disable no-new */
let router = new Vuerouter()

router.map({
  '/:canvas': {
    component: App
  }
})

console.log(router)

export default router
