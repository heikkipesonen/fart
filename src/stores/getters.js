export const canvas = (state) => state.canvas

export const editorVisible = (state) => state.editor.visible

export const editorItem = (state) => state.editor.item

export const editorObject = (state) => state.objects[state.editor.item]

export const objects = (state) => state.objects

export const types = (state) => state.types

export const canvasObjects = (state) => Object.keys(state.canvas.children || {})

export const viewPort = (state) => state.view

export const selected = (state) => state.selectedItem

export const bounds = (state) => {
  return Object.keys(state.objects).reduce((prev, key) => {
    let child = state.objects[key]
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
