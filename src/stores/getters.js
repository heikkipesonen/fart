export const canvas = (state) => state.canvas

export const children = (state) => state.children

export const parent = (state, id) => state.children[id]

export const viewPort = (state) => state.view

export const bounds = (state) => {
  return Object.keys(state.children).reduce((prev, key) => {
    let child = state.children[key]
    return {
      top: child.x < prev.x ? child.x : prev.x,
      left: child.y < prev.y ? child.y : prev.y,
      right: child.x > prev.x ? child.x : prev.x,
      bottom: child.y > prev.y ? child.y : prev.y
    }
  }, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  })
}
