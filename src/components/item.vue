<template>
  <line v-for="parent in parentLocations" :x1="item.x" :y1="item.y" :x2="parent.x" :y2="parent.y"></line>
  <g :transform="position" :class="classNames">
    <circle cx="0" cy="0" :r="item.width" v-on:mousedown.self="startDrag"></circle>
    <!-- <Item v-for="child in item.children" :item="child" track-by="id"></Item> -->


    <text class="text" text-anchor="middle" x="0" y="70">{{ item.name }}</text>

  </g>

</template>

<script>
import Api from '../api'
import { updateItem, dropItem } from '../stores/actions'
import { viewPort } from '../stores/getters'
import store from '../stores/store'

export default {
  name: 'Item',
  replace: true,

  props: {
    id: {
      type: String
    },

    item: {
      type: Object,
      default: () => {
        return {
          width: 50,
          height: 50,
          x: 0,
          y: 0
        }
      }
    }
  },

  vuex: {
    actions: {
      update: updateItem,
      drop: dropItem
    },

    getters: {
      viewPort
    }
  },

  data () {
    return {
      deltaX: 0,
      deltaY: 0,
      lastEvent: null
    }
  },

  computed: {
    parentLocations () {
      if (this.item.parents && this.item.parents.length > 0) {
        return this.item.parents.map((parentId) => {
          return {
            x: store.state.children[parentId].x,
            y: store.state.children[parentId].y
          }
        })
      }
      return []
    },

    position () {
      return `translate(${this.item.x || 0}, ${this.item.y || 0})`
    }
  },

  methods: {
    startDrag (evt) {
      this.deltaX = 0
      this.deltaY = 0

      evt.stopImmediatePropagation()
      evt.preventDefault()

      this.lastEvent = {
        x: evt.pageX,
        y: evt.pageY
      }
    },

    onDrag (evt) {
      if (this.lastEvent) {
        let deltaX = (evt.pageX - this.lastEvent.x) / this.viewPort.scale
        let deltaY = (evt.pageY - this.lastEvent.y) / this.viewPort.scale

        this.deltaX += deltaX
        this.deltaY += deltaY

        this.$set('item.x', this.item.x + deltaX)
        this.$set('item.y', this.item.y + deltaY)

        this.lastEvent = {
          x: evt.pageX,
          y: evt.pageY
        }

        this.update(this.id, this.item)
      }
    },

    endDrag (evt) {
      if (this.lastEvent && (this.deltaX !== 0 || this.deltaY !== 0)) {
        evt.preventDefault()
        evt.stopImmediatePropagation()
        this.drop(this.id)
      }

      this.lastEvent = null
    }
  },

  ready () {
    Api.on('mouseup', this.endDrag, this)
    Api.on('mousemove', this.onDrag, this)
  },

  beforeDestroy () {
    Api.remove('itemdrop', this)
    Api.remove('mouseup', this)
    Api.remove('mousemove', this)
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/theme';

.text{
  font-weight: 200;
  text-transform: uppercase;
  @include theme(fill, primary);
}

circle{
  @include theme(fill, primary);
  position: relative;
  transition: 0.3s;
  cursor: pointer;
}

line{
   @include theme(stroke, primary);
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

</style>
