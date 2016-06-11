import firebase from './firebase'
import router from '../router'
import { objectIntersects } from '../utils'

/**
 * [addChild description]
 * @param {[type]} {dispatch [description]
 * @param {[type]} state}    [description]
 * @param {[type]} child     [description]
 */
export const addChild = function ({dispatch, state}, child) {
  if (!child) {
    child = {
      x: state.view.x,
      y: state.view.y,
      width: 50,
      height: 50
    }
  }

  state._children.push(child)
}

/**
 * [addItemParent description]
 * @param {[type]} {dispatch [description]
 * @param {[type]} state}    [description]
 * @param {[type]} child     [description]
 * @param {[type]} parent    [description]
 */
export const addItemParent = function ({dispatch, state}, child, parent) {
  state._children.child(child).transaction(function (child) {
    if (!child.parents) { child.parents = [] }
    if (child.parents.indexOf(parent) < 0) {
      child.parents.push(parent)
    }

    return child
  })
}

/**
 * [dropItem description]
 * @param  {[type]} {dispatch [description]
 * @param  {[type]} state}    [description]
 * @param  {[type]} id        [description]
 * @return {[type]}           [description]
 */
export const dropItem = function ({dispatch, state}, id) {
  let item = state.children[id]

  let intersectinObject = Object.keys(state.children).find((key) => {
    if (key !== id) {
      let child = state.children[key]
      return objectIntersects(child, item)
    }

    return false
  })
  console.log(intersectinObject)
  if (intersectinObject) {
    addItemParent({dispatch, state}, id, intersectinObject)
  }
}

/**
 * [updateItem description]
 * @param  {[type]} {dispatch [description]
 * @param  {[type]} state}    [description]
 * @param  {[type]} id        [description]
 * @param  {[type]} child     [description]
 * @return {[type]}           [description]
 */
export const updateItem = function ({dispatch, state}, id, child) {
  state._children.child(id).set(child)
}

/**
 * [setCanvas description]
 * @param {[type]} {dispatch [description]
 * @param {[type]} state}    [description]
 * @param {[type]} canvas    [description]
 */
export const setCanvas = function ({dispatch, state}, canvas) {
  state._canvas.set(canvas)
}

/**
 * [initializeCanvas description]
 * @param  {[type]} {dispatch [description]
 * @param  {[type]} state}    [description]
 * @param  {[type]} id        [description]
 * @return {[type]}           [description]
 */
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

/**
 * [createCanvas description]
 * @param  {[type]} {dispatch [description]
 * @param  {[type]} state}    [description]
 * @param  {[type]} data      [description]
 * @return {[type]}           [description]
 */
export const createCanvas = function ({dispatch, state}, data) {
  let canvas = firebase.child('canvas').push(data)
  initializeCanvas({dispatch, state}, canvas.key)

  router.go('/' + canvas.key)
}

/**
 * [setView description]
 * @param {[type]} {dispatch [description]
 * @param {[type]} state}    [description]
 * @param {[type]} view      [description]
 */
export const setView = function ({dispatch, state}, view) {
  dispatch('SETVIEW', view)
}
