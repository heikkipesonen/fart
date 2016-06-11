export function getPointer (event) {
  return {
    x: event.pageX,
    y: event.pageY
  }
}

export function intersects (r1, r2) {
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top)
}

export function convert (obj) {
  return {
    top: obj.y - obj.height / 2,
    left: obj.x - obj.width / 2,
    right: obj.x + obj.width / 2,
    bottom: obj.y + obj.height / 2
  }
}

export function objectIntersects (obj1, obj2) {
  return intersects(convert(obj1), convert(obj2))
}

export function getObjectPosition (key, objects) {
  let object = objects[key]

  let position = {
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height
  }

  while (object.parent) {
    object = objects[object.parent]

    position.x += object.x
    position.y += object.y
  }

  return position
}

export function projectToView (x, y, view) {
  return {
    x: (x - view.x) / view.scale,
    y: (y - view.y) / view.scale
  }
}

export function getObjectBounds (obj) {
  return {
    top: obj.y - obj.height / 2,
    left: obj.x - obj.width / 2,
    right: obj.x + obj.width / 2,
    bottom: obj.y + obj.height / 2
  }
}

export function extendBounds (bounds1, bounds2) {
  return {
    top: bounds1.top < bounds2.top ? bounds1.top : bounds2.top,
    left: bounds1.left < bounds2.left ? bounds1.left : bounds2.left,
    right: bounds1.right > bounds2.right ? bounds1.right : bounds2.right,
    bottom: bounds1.bottom > bounds2.bottom ? bounds1.bottom : bounds2.bottom
  }
}

export function getCenter (bounds) {
  return {
    x: bounds.right - bounds.left,
    y: bounds.bottom - bounds.top
  }
}

export function getDimensions (bounds) {
  return {
    top: bounds.top,
    left: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom,
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,
    center: getCenter(bounds)
  }
}

export function getScale (bounds1, bounds2) {
  let b1 = getDimensions(bounds1)
  let b2 = getDimensions(bounds2)

  return {
    x: b2.width / b1.width,
    y: b2.height / b1.height
  }
}

export function getBounds (objects, stateObjects) {
  return Object.keys(objects).reduce((prev, childKey) => {
    let position = getObjectPosition(childKey, stateObjects)
    let bounds = getObjectBounds(position)
    return extendBounds(bounds, prev)
  }, {
    top: Infinity,
    left: Infinity,
    right: -Infinity,
    bottom: -Infinity
  })
}
