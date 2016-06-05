<template>
  <svg class="view-canvas" :width="size.width" :height="size.height" v-on:mousedown="startDrag">
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

export default {
  data () {
    return {
      size: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      lastEvent: null,
      position: {
        x: 0,
        y: 0,
        scale: 1
      }
    }
  },

  methods: {
    getPointer (event) {
      return {
        x: event.pageX,
        y: event.pageY
      }
    },

    startDrag (event) {
      this.lastEvent = this.getPointer(event)
    },

    onDrag (event) {
      if (this.lastEvent) {
        let pointer = this.getPointer(event)

        let sx = pointer.x - this.lastEvent.x
        let sy = pointer.y - this.lastEvent.y

        this.$set('position', {
          x: this.position.x + sx,
          y: this.position.y + sy,
          scale: this.position.scale
        })

        this.lastEvent = pointer
      }
    },

    endDrag () {
      this.lastEvent = null
    },

    viewZoom (event) {
      let scale = this.position.scale + (this.position.scale * event.wheelDeltaY / 4800)

      let pointer = this.getPointer(event)
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

      Api.scale = newScale
    }
  },

  computed: {
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
    document.addEventListener('mousemove', (evt) => this.onDrag(evt))
    document.addEventListener('mouseup', (evt) => this.endDrag(evt))
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
