<template>
  <svg class="view-canvas" :width="size.width" :height="size.height" v-on:mousedown.self="startDrag" v-on:click.self="_onClick">
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
import { setView } from '../stores/actions'

export default {
  props: {
    onClick: {
      type: Function
    },
    center: {
      type: Object,
      default () {
        return {
          x: 0,
          y: 0
        }
      }
    }
  },

  vuex: {
    actions: {
      setView
    }
  },

  data () {
    return {
      size: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      lastEvent: null,
      deltaX: 0,
      deltaY: 0,
      position: {
        x: 0,
        y: 0,
        scale: 1
      }
    }
  },

  methods: {
    _onClick (event) {
      if (this.deltaX === 0 && this.deltaY === 0 && this.onClick) {
        this.onClick(this.getPointerOnCanvas(event))
      }
    },

    projectToCanvas (x, y) {
      return {
        x: (x - this.position.x) / this.position.scale,
        y: (y - this.position.y) / this.position.scale
      }
    },

    getPointerOnCanvas (event) {
      let pointer = getPointer(event)
      return this.projectToCanvas(pointer.x, pointer.y)
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

        this.$set('position', {
          x: this.position.x + sx,
          y: this.position.y + sy,
          scale: this.position.scale
        })

        this.lastEvent = pointer
        this.setView(this.position)
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

      this.$set('position', {
        x: (ix + (pointer.x - ix) - nx),
        y: (iy + (pointer.y - iy) - ny),
        scale: newScale
      })

      this.setView(this.position)
    }
  },

  computed: {
    center () {
      return this.projectToCanvas(this.size.width / 2, this.size.height / 2)
    },

    style () {
      return `translate(${this.position.x}, ${this.position.y}) scale(${this.position.scale}, ${this.position.scale})`
    }
  },

  ready () {
    window.addEventListener('resize', () => {
      this.$set('size', {
        width: window.innerWidth,
        height: window.innerHeight
      })
    })

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
