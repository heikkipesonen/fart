<template>
  <g :transform="position" :class="classNames">

    <line x1="0" y2="0" :x2="parentLocation.x" :y2="parentLocation.y"></line>

    <Item v-for="item in item.children" :item="item"></Item>

    <circle class="primary" :cx="0" :cy="0" r="50" v-on:mousedown="startDrag" v-on:click="showEditor"></circle>
    <circle class="secondary" :cx="0" :cy="0" r="70"></circle>

    <text text-anchor="middle" x="0" y="70">{{ item.name }}</text>

  </g>

</template>

<script>
import Tags from './Tags'
import Content from './content'
import InputContainer from './input-container'

import Api from '../api'

export default {
  name: 'Item',
  replace: true,

  components: {
    Tags,
    Content,
    InputContainer
  },

  props: {
    item: {
      type: Object,
      default: {
        x: 0,
        y: 0
      }
    }
  },

  data () {
    return {
      dx: 0,
      dy: 0,
      showChildren: false,
      lastEvent: null
    }
  },

  computed: {
    parentLocation () {
      return {
        x: -this.item.x,
        y: -this.item.y
      }
    },

    position () {
      return `translate(${this.item.x}, ${this.item.y})`
    },

    classNames () {
      return this.lastEvent ? 'dragging' : ''
    }
  },

  methods: {

    showEditor (evt) {
      if (this.dx === 0 && this.dy === 0) {
        evt.stopPropagation()
        this.$dispatch('showEditor', this.item)
      }
    },

    toggleChildren (evt) {
      evt.stopPropagation()
      this.$set('showChildren', !this.showChildren)
    },

    startDrag (evt) {
      this.dx = 0
      this.dy = 0

      evt.stopPropagation()

      this.lastEvent = {
        x: evt.pageX,
        y: evt.pageY
      }
    },

    onDrag (evt) {
      if (this.lastEvent) {
        let dx = (evt.pageX - this.lastEvent.x) / Api.scale
        let dy = (evt.pageY - this.lastEvent.y) / Api.scale

        this.dx += dx
        this.dy += dy

        this.$set('item.x', this.item.x + dx)
        this.$set('item.y', this.item.y + dy)

        this.lastEvent = {
          x: evt.pageX,
          y: evt.pageY
        }
      }
    },

    endDrag (evt) {
      if (this.lastEvent && (this.dx !== 0 || this.dy !== 0)) {
        this.update()
      }
      this.lastEvent = null
    },

    addChild () {
      var resource = this.$resource('item/' + this.item.id)

      resource.save({ type: 'item', order: this.item.children ? this.item.children.length : 0 }).then((response) => {
        if (!this.item.children) {
          this.$set('item.children', [])
        }

        this.item.children.push(response.data)
      })
    },

    remove () {
      var resource = this.$resource('item/' + this.item.id)

      resource.delete().then((response) => {
        this.$parent._removeChild(this.item)
      })
    },

    _removeChild (item) {
      let childIndex = this.item.children.indexOf(item)

      if (childIndex > -1) {
        this.item.children.splice(childIndex, 1)
      }
    },

    addTag (tag = Date.now()) {
      if (!this.item.tags) {
        this.$set('item.tags', [])
      }

      this.item.tags.push(tag)

      this.update()
    },

    removeTag (tag) {
      this.item.tags.splice(this.item.tags.indexOf(tag), 1)
      this.update()
    },

    update () {
      var resource = this.$resource('item/' + this.item.id)
      return resource.update(this.item).then((response) => {
        this.$set('item', response.data)
      })
    }
  },

  ready () {
    Api.on('mouseup', this.endDrag, this)
    Api.on('mousemove', this.onDrag, this)
  },

  beforeDestroy () {
    Api.remove('mouseup', this)
    Api.remove('mousemove', this)
  }
}
</script>
<style scoped>

.dragging circle.primary{
  fill: rgb(228, 63, 52);
}

.dragging line{
  stroke: rgb(228, 63, 52);
}

circle.primary{
  fill: rgb(52, 197, 228);
  position: relative;
  transition: 0.3s;
  cursor: pointer;
}

circle.secondary{
  transition: 0.3s;
  pointer-events: none;
  fill: transparent;
  stroke: transparent;
  stroke-width: 16px;
}

circle.primary:hover{
  fill: rgb(8, 254, 254);
}

circle.primary:hover + circle.secondary{
  stroke: rgb(255, 138, 24);
}

line{
   stroke: rgb(52, 197, 228);
   stroke-width: 2;
   transition: 0.3s;
}

.item{
  position: absolute;
  padding: 16px;
  width: 200px;
  background-color: rgb(29, 154, 233);
  color: white;
}

svg{
  position: absolute;
  top: 100px;
  left: 100px;
}

.item.hierarchy-1{
  background-color: rgb(29, 154, 233);
}

.item.hierarchy-2{
  background-color: rgb(168, 29, 233);
}

.item.hierarchy-3{
  background-color: rgb(29, 233, 190);
}

.item.hierarchy-4{
  background-color: rgb(192, 233, 29);
}

.toolbar{
  margin-top: 16px;
}

</style>
