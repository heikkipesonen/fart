import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const state = {
  canvas: {},
  selectedItem: null,
  objects: {},

  view: {
    x: 0,
    y: 0,
    scale: 1
  }
}

const mutations = {
  SETVIEW (state, view) {
    state.view.x = view.x
    state.view.y = view.y
    state.view.scale = view.scale
  },

  SETCANVAS (state, canvas) {
    state.canvas = canvas
  },

  ITEMUPDATE (state, id, object) {
    if (object === null) {
      delete state.objects[id]
      return
    }

    state.objects[id] = object
  },

  SELECTITEM (state, id) {
    state.selectedItem = id
  },

  UNSELECT (state) {
    state.selectedItem = null
  }
}

/* eslint-disable no-new */
export default new Vuex.Store({
  state,
  mutations
})
