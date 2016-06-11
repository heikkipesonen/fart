import firebase from './firebase'
import router from '../router'
import { objectIntersects } from '../utils'

let CANVAS = null
let CHILDREN = null

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

  let childKey = firebase.child('objects').push(child).key

  CANVAS.transaction(function (canvas) {
    if (!canvas.children) canvas.children = []
    canvas.children.push(childKey)
    return canvas
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
  let droppedItem = state.objects[id]

  let dropTarget = Object.keys(state.objects).find((key) => {
    if (key === id) return false

    let object = state.objects[key]
    return objectIntersects(droppedItem, object)
  })
  console.log(dropTarget)
  if (dropTarget && droppedItem) {
    let dropTargetItem = state.objects[dropTarget]

    CANVAS.transaction(function (canvas) {
      if (!canvas.children) canvas.children = []
      if (canvas.children.indexOf(id) > -1) {
        canvas.children.splice(canvas.children.indexOf(id), 1)
      }
      return canvas
    }).then(() => {
      firebase.child('objects').child(dropTarget).transaction((item) => {
        if (!item.children) item.children = []
        if (item.children.indexOf(id) < 0) {
          item.children.push(id)
        }
        return item
      }).then(() => {
        droppedItem.x -= dropTargetItem.x
        droppedItem.y -= dropTargetItem.y
        droppedItem.parent = dropTarget

        firebase.child('objects').child(id).set(droppedItem)
      })
    })
  }
}

export const itemUpdate = function ({dispatch, state}, id, object) {
  dispatch('ITEMUPDATE', id, object)
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
  //     CHILDREN.child(key).transaction((child) => {
  //       child.parents.splice(child.parents.indexOf(id), 1)
  //       return child
  //     })
  //   }
  // })
  //
  // CHILDREN.child(id).remove()
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
  CHILDREN.child(id).set(child)
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
  // CHILDREN = firebase.child('objects').child(CANVAS.key)
  CANVAS.on('value', (snapshot) => {
    dispatch('SETCANVAS', snapshot.val())
  })

  // CHILDREN.on('value', (snapshot) => {
  //   dispatch('SETOBJECTS', snapshot.val())
  // })
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
