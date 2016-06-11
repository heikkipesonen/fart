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

function getLeft (obj) {
  return obj.x - obj.width / 2
}

function getRight (obj) {
  return obj.x + obj.width / 2
}

function getTop (obj) {
  return obj.y - obj.height / 2
}
function getBottom (obj) {
  return obj.x + obj.height / 2
}

export function objectIntersects (obj1, obj2) {
  return !(getLeft(obj2) > getRight(obj1) ||
           getRight(obj2) < getLeft(obj1) ||
           getTop(obj2) > getBottom(obj1) ||
           getBottom(obj2) < getTop(obj1))
}
