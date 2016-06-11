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

function convert (obj) {
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
