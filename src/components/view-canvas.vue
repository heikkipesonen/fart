<template>
  <svg class="view-canvas" :width="position.size.width" :height="position.size.height" v-on:mousedown.self="startDrag" v-on:click.self="_onClick">
    <defs>
      <filter id="f1" x="0" y="0">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
      </filter>
    </defs>
    <g :transform="style" filter="url(#f1)">
      <slot></slot>
    </g>
    </circle>
  </svg>
</template>

<script>
import Api from '../api'
import { getPointer } from '../utils'
import { setView } from '../stores/view-actions'
import { viewPort } from '../stores/getters'

export default {
  props: {
    onClick: {
      type: Function
    }
  },

  vuex: {
    actions: {
      setView
    },

    getters: {
      position: viewPort
    }
  },

  data () {
    return {
      lastEvent: null,
      deltaX: 0,
      deltaY: 0
    }
  },

  methods: {
    _onClick (event) {
      if (this.deltaX === 0 && this.deltaY === 0 && this.onClick) {
        this.onClick(this.getPointerOnCanvas(event))
      }
    },

    toScreen (x, y) {
      return {
        x: x + this.position.x * this.position.scale,
        y: y + this.position.y + this.position.scale
      }
    },

    toCanvas (x, y) {
      return {
        x: (x - this.position.x) / this.position.scale,
        y: (y - this.position.y) / this.position.scale
      }
    },

    getPointerOnCanvas (event) {
      let pointer = getPointer(event)
      return this.toCanvas(pointer.x, pointer.y)
    },

    startDrag (event) {
      this.deltaX = 0
      this.deltaY = 0
      this.lastEvent = getPointer(event)
    },

    onDrag (event) {
      if (this.lastEvent) {
        let pointer = getPointer(event)

        let sx = pointer.x - this.lastEvent.x
        let sy = pointer.y - this.lastEvent.y

        this.deltaX += sx
        this.deltaY += sy

        let position = {
          x: this.position.x + sx,
          y: this.position.y + sy,
          scale: this.position.scale,
          size: this.position.size,
          center: this.toCanvas(this.position.size.width / 2, this.position.size.height / 2)
        }

        this.lastEvent = pointer
        this.setView(position)
      }
    },

    endDrag () {
      this.lastEvent = null
    },

    viewZoom (event) {
      let scale = this.position.scale + (this.position.scale * event.wheelDeltaY / 4800)

      let pointer = getPointer(event)
      let currentScale = this.position.scale
      let newScale = scale

      let ix = (pointer.x - this.position.x) / currentScale
      let iy = (pointer.y - this.position.y) / currentScale

      let nx = ix * newScale
      let ny = iy * newScale

      let position = {
        x: (ix + (pointer.x - ix) - nx),
        y: (iy + (pointer.y - iy) - ny),
        size: this.position.size,
        scale: newScale,
        center: this.toCanvas(this.position.size.width / 2, this.position.size.height / 2)
      }

      this.setView(position)
    }
  },

  computed: {
    center () {
      return this.toCanvas(this.position.size.width / 2, this.position.size.height / 2)
    },

    style () {
      return `translate(${this.position.x}, ${this.position.y}) scale(${this.position.scale}, ${this.position.scale})`
    }
  },

  ready () {
    console.log(this.position)
    window.addEventListener('resize', () => {
      let position = {
        x: this.position.x,
        y: this.position.y,
        scale: this.position.scale,
        size: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        center: this.toCanvas(this.position.size.width / 2, this.position.size.height / 2)
      }

      this.setView(position)
    })

    let position = {
      x: this.position.x,
      y: this.position.y,
      scale: this.position.scale,
      size: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      center: this.toCanvas(this.position.size.width / 2, this.position.size.height / 2)
    }

    this.setView(position)

    Api.on('mousemove', (evt) => this.onDrag(evt))
    Api.on('mouseup', (evt) => this.endDrag(evt))

    document.addEventListener('mousewheel', (evt) => this.viewZoom(evt))
  }
}
</script>

<style scoped>
.view-canvas{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
</style>
