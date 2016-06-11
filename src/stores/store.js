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
    scale: 1,
    size: {
      width: 0,
      height: 0
    }
  }
}

const mutations = {
  SETVIEW (state, view) {
    state.view = view
  },

  SETCANVAS (state, canvas) {
    state.canvas = canvas
  },

  SETOBJECTS (state, value) {
    state.objects = value
  },

  OBJECTUPDATE (state, id, object) {
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
