import firebase from './firebase'
import router from '../router'
import { objectIntersects, getObjectPosition } from '../utils'

let CANVAS = null
let OBJECTS = null

export const editItem = function ({dispatch, state}, id) {
  dispatch('EDITITEM', id)
}

export const closeEditor = function ({dispatch, state}) {
  dispatch('CLOSEEDITOR')
}

/**
 * [addChild description]
 * @param {[type]} {dispatch [description]
 * @param {[type]} state}    [description]
 * @param {[type]} child     [description]
 */
export const addChild = function ({dispatch, state}, child) {
  if (!child) {
    child = {
      x: state.view.center.x,
      y: state.view.center.y,
      width: 30,
      height: 30
    }
  }

  let key = OBJECTS.push(child).key
  CANVAS.child('children').child(key).set(true)
}

export const setToChild = function ({dispatch, state}, source, target) {
  let sourceObject = state.objects[source]
  if (state.objects[source].children && state.objects[source].children[target]) return

  let sourcePosition = getObjectPosition(source, state.objects)
  let targetPosition = getObjectPosition(target, state.objects)

  let dx = sourcePosition.x - targetPosition.x
  let dy = sourcePosition.x - targetPosition.x

  sourceObject.x = dx + sourceObject.width * 2
  sourceObject.y = dy + sourceObject.height * 2

  if (!sourceObject.parent) {
    CANVAS.child('children').child(source).remove()
  } else {
    OBJECTS.child(sourceObject.parent).child('children').child(source).remove()
  }
  OBJECTS.child(target).child('children').child(source).set(true)
  sourceObject.parent = target
  OBJECTS.child(source).set(sourceObject)
}

export const detachItem = function ({dispatch, state}, id) {
  console.log(id)
  let sourceObject = state.objects[id]

  if (sourceObject.parent) {
    let parentPosition = getObjectPosition(sourceObject.parent, state.objects)
    OBJECTS.child(sourceObject.parent).child('children').child(id).remove()

    sourceObject.x += parentPosition.x
    sourceObject.y += parentPosition.y
    sourceObject.parent = null

    OBJECTS.child(id).set(sourceObject)
    CANVAS.child('children').child(id).set(true)
  }
}

/**
 * [dropItem description]
 * @param  {[type]} {dispatch [description]
 * @param  {[type]} state}    [description]
 * @param  {[type]} id        [description]
 * @return {[type]}           [description]
 */
export const dropItem = function ({dispatch, state}, id) {
  let dropPosition = getObjectPosition(id, state.objects)

  let dropTarget = Object.keys(state.objects).find((key) => {
    if (key === id) return false
    let objectPosition = getObjectPosition(key, state.objects)
    return objectIntersects(objectPosition, dropPosition)
  })

  if (dropTarget) {
    setToChild({dispatch, state}, id, dropTarget)
  }
}

export const itemUpdate = function ({dispatch, state}, id, object) {
  OBJECTS.child(id).set(object)
}

export const selectItem = function ({dispatch, state}, id) {
  dispatch('SELECTITEM', id)
}

export const unselectItem = function ({dispatch, state}) {
  dispatch('UNSELECT')
}

export const toggleSelection = function ({dispatch, state}, id) {
  if (state.selectItem === id) {
    dispatch('UNSELECT')
  } else {
    dispatch('SELECTITEM', id)
  }
}

export const removeItem = function ({dispatch, state}, id) {
  // Object.keys(state.objects).forEach((key) => {
  //   if (state.objects[key].parents && state.objects[key].parents.indexOf(id) > -1) {
  //     OBJECTS.child(key).transaction((child) => {
  //       child.parents.splice(child.parents.indexOf(id), 1)
  //       return child
  //     })
  //   }
  // })
  //
  // OBJECTS.child(id).remove()
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
  dispatch('SETOBJECT', id, child)
}

/**
 * [setCanvas description]
 * @param {[type]} {dispatch [description]
 * @param {[type]} state}    [description]
 * @param {[type]} canvas    [description]
 */
export const setCanvas = function ({dispatch, state}, canvas) {
  CANVAS.set(canvas)
}

/**
 * [initializeCanvas description]
 * @param  {[type]} {dispatch [description]
 * @param  {[type]} state}    [description]
 * @param  {[type]} id        [description]
 * @return {[type]}           [description]
 */
export const initializeCanvas = function ({dispatch, state}, id) {
  CANVAS = firebase.child('canvas').child(id)
  OBJECTS = firebase.child('objects').child(CANVAS.key)

  CANVAS.on('value', (snapshot) => {
    dispatch('SETCANVAS', snapshot.val())
  })

  OBJECTS.on('value', (snapshot) => {
    dispatch('SETOBJECTS', snapshot.val())
  })
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
