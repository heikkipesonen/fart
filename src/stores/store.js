import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const state = {
  editor: {
    visible: false,
    item: false
  },

  types: ['circle', 'square'],

  canvas: {},

  selectedItem: null,

  objects: {},

  view: {
    x: 0,
    y: 0,
    scale: 1,
    blur: 0,
    size: {
      width: 0,
      height: 0
    }
  }
}

const mutations = {
  EDITITEM (state, id) {
    state.editor.visible = true
    state.editor.item = id
    state.view.blur = 10
  },

  CLOSEEDITOR (state) {
    state.editor.visible = false
    state.editor.item = false
    state.view.blur = 0
  },

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

  SETOBJECT (state, id, object) {
    state.objects[id].set(object)
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
