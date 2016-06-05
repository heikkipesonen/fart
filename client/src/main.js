import Vue from 'vue'
import App from './App'
import Resource from 'vue-resource'

/* eslint-disable no-new */
Vue.use(Resource)

Vue.http.options.root = 'http://localhost:8080'

new Vue({
  el: 'body',
  components: { App }
})
