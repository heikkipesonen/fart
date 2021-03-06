<template>
  <svg class="view-canvas" width="100%" height="100%" v-on:mousedown.self="startDrag" v-on:click.self="_onClick">
    <defs>
      <filter id="f1" x="0" y="0">
        <feGaussianBlur in="SourceGraphic" :stdDeviation="view.blur" />
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
      view: viewPort
    }
  },

  data () {
    return {
      lastEvent: null,
      deltaX: 0,
      deltaY: 0
    }
  },

  computed: {
    center () {
      return this.toCanvas(this.view.size.width / 2, this.view.size.height / 2)
    },

    style () {
      return `translate(${this.view.x}, ${this.view.y}) scale(${this.view.scale}, ${this.view.scale})`
    }
  },

  methods: {
    _onClick (event) {
      if (this.deltaX === 0 && this.deltaY === 0 && this.onClick) {
        this.onClick(this.getPointerOnCanvas(event))
      }
    },

    /**
     * [toScreen description]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    toScreen (x, y) {
      return {
        x: x + this.view.x * this.view.scale,
        y: y + this.view.y + this.view.scale
      }
    },

    /**
     * [toCanvas description]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    toCanvas (x, y) {
      return {
        x: (x - this.view.x) / this.view.scale,
        y: (y - this.view.y) / this.view.scale
      }
    },

    /**
     * [getPointerOnCanvas description]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    getPointerOnCanvas (event) {
      let pointer = getPointer(event)
      return this.toCanvas(pointer.x, pointer.y)
    },

    /**
     * [startDrag description]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    startDrag (event) {
      event.stopImmediatePropagation()
      event.preventDefault()

      this.deltaX = 0
      this.deltaY = 0
      this.lastEvent = getPointer(event)

      console.log(this.view)
    },

    /**
     * [onDrag description]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    onDrag (event) {
      if (this.lastEvent) {
        let pointer = getPointer(event)

        let sx = pointer.x - this.lastEvent.x
        let sy = pointer.y - this.lastEvent.y

        this.deltaX += sx
        this.deltaY += sy

        let position = {
          x: this.view.x + sx,
          y: this.view.y + sy,
          scale: this.view.scale,
          size: this.view.size,
          center: this.toCanvas(this.view.size.width / 2, this.view.size.height / 2)
        }

        this.lastEvent = pointer
        this.setView(position)
      }
    },

    /**
     * [endDrag description]
     * @return {[type]} [description]
     */
    endDrag () {
      this.lastEvent = null
    },

    /**
     * [viewZoom description]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    viewZoom (event) {
      let scale = this.view.scale + (this.view.scale * event.wheelDeltaY / 4800)

      let pointer = getPointer(event)
      let currentScale = this.view.scale
      let newScale = scale

      let ix = (pointer.x - this.view.x) / currentScale
      let iy = (pointer.y - this.view.y) / currentScale

      let nx = ix * newScale
      let ny = iy * newScale

      let position = {
        x: (ix + (pointer.x - ix) - nx),
        y: (iy + (pointer.y - iy) - ny),
        size: this.view.size,
        scale: newScale,
        center: this.toCanvas(this.view.size.width / 2, this.view.size.height / 2)
      }

      this.setView(position)
    },

    /**
     * [fitViewport description]
     * @return {[type]} [description]
     */
    fitViewport () {
      let position = {
        x: this.view.x,
        y: this.view.y,
        scale: this.view.scale,
        size: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        center: this.toCanvas(this.view.size.width / 2, this.view.size.height / 2)
      }

      this.setView(position)
    }
  },

  ready () {
    Api.on('resize', () => this.fitViewport())
    this.fitViewport()

    Api.on('mousemove', (evt) => this.onDrag(evt), this)
    Api.on('mouseup', (evt) => this.endDrag(evt), this)
    Api.on('mousewheel', (evt) => this.viewZoom(evt), this)
  },

  beforeDestroy () {
    Api.removeAll(this)
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
