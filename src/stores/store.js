import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const state = {
  _canvas: null,
  _children: null,

  canvas: {},
  children: {},

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

  SETCHILDREN (state, children) {
    state.children = children
    console.log('SETUP CHILDREN', children)
  },

  SETCANVAS (state, canvas) {
    console.log(canvas)
    state.canvas = canvas
  },

  SETCANVASREF (state, canvas) {
    console.log('le canvas', canvas)
    state._canvas = canvas
  },

  SETCHILDREF (state, ref) {
    state._children = ref
  }
}

/* eslint-disable no-new */
export default new Vuex.Store({
  state,
  mutations
})
