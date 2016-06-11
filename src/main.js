import router from './router'
import App from './App'
import store from './stores/store'

/* eslint-disable no-new */
router.start({
  store,
  components: {
    App
  }
}, 'body')
