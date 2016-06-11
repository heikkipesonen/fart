import firebase from './firebase'

export const addChild = function ({dispatch, state}, child) {
  state._children.push(child)
}

export const updateItem = function ({dispatch, state}, id, child) {
  state._children.child(id).set(child)
}

export const setCanvas = function ({dispatch, state}, canvas) {
  state._canvas.set(canvas)
}

export const initializeCanvas = function ({dispatch, state}, id) {
  let canvas = firebase.child('canvas').child(id)
  let childRef = firebase.child('objects').child(id)

  childRef.on('value', (snapshot) => {
    dispatch('SETCHILDREN', snapshot.val())
  })

  canvas.on('value', (snapshot) => {
    dispatch('SETCANVAS', snapshot.val())
  })

  dispatch('SETCHILDREF', childRef)
  dispatch('SETCANVASREF', canvas)
}

export const createCanvas = function ({dispatch, state}, data) {
  let canvas = firebase.child('canvas').push(data)
  initializeCanvas({dispatch, state}, canvas.key)
}

export const setView = function ({dispatch, state}, view) {
  dispatch('SETVIEW', view)
}
