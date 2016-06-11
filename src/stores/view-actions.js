import { getBounds, getScale } from '../utils'
/**
 * [setView description]
 * @param {[type]} {dispatch [description]
 * @param {[type]} state}    [description]
 * @param {[type]} view      [description]
 */
export const setView = function ({dispatch, state}, view) {
  dispatch('SETVIEW', view)
}

export const showItems = function ({dispatch, state}, items) {
  if (!items) {
    items = state.objects
  }

  let viewPort = {
    top: 0,
    left: 0,
    right: state.view.size.width,
    bottom: state.view.size.height
  }

  let bounds = getBounds(items, state.objects)
  let viewScale = getScale(bounds, viewPort)

  let scale = viewScale.x < viewScale.y ? viewScale.x : viewScale.y

  console.log(scale)

  state.view.scale = scale
  dispatch('SETVIEW', state.view)
}
