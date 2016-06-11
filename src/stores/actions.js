import firebase from './firebase'
import router from '../router'
import { objectIntersects, getObjectPosition } from '../utils'

let CANVAS = null
let OBJECTS = null

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
      width: 30,
      height: 30
    }
  }

  let key = OBJECTS.push(child).key

  CANVAS.transaction((canvas) => {
    if (!canvas) canvas = {}
    if (!canvas.children) canvas.children = []

    canvas.children.push(key)

    return canvas
  })
}

export const setToChild = function ({dispatch, state}, source, target) {
  let sourceObject = state.objects[source]
  let sourcePosition = getObjectPosition(source, state)
  let targetPosition = getObjectPosition(target, state)

  sourceObject.x = sourcePosition.x - targetPosition.x
  sourceObject.y = sourcePosition.y - targetPosition.y
  sourceObject.parent = target

  dispatch('OBJECTUPDATE', source, sourceObject)

  CANVAS.transaction((canvas) => {
    if (!canvas) canvas = {}
    if (!canvas.children) canvas.children = []
    if (canvas.children.indexOf(source) > -1) {
      canvas.children.splice(canvas.children.indexOf(source), 1)
    }

    return canvas
  }).then(() => {
    OBJECTS.child(target).transaction(function (target) {
      if (!target.children) target.children = []
      if (target.children.indexOf(source) === -1) {
        target.children.push(source)
      }

      return target
    }).then(() => {
      OBJECTS.child(source).set(sourceObject)
    })
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
  if (state.objects[id].parent) return

  let dropPosition = getObjectPosition(id, state)

  let dropTarget = Object.keys(state.objects).find((key) => {
    if (key === id) return false
    let objectPosition = getObjectPosition(key, state)
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
  OBJECTS.child(id).set(child)
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

/**
 * [setView description]
 * @param {[type]} {dispatch [description]
 * @param {[type]} state}    [description]
 * @param {[type]} view      [description]
 */
export const setView = function ({dispatch, state}, view) {
  dispatch('SETVIEW', view)
}
