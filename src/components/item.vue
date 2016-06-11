<template>
  <g :transform="position" :class="classNames">

    <line v-if="item.parent" x1="0" y1="0" :x2="-item.x" :y2="-item.y"></line>

    <circle class="selection-indicator" cx="0" cy="0" :r="item.width + 5"></circle>
    <circle cx="0" cy="0" :r="item.width" v-on:mousedown.self="startDrag" v-on:click="toggleSelection(id)"></circle>

    <text class="text" text-anchor="middle" x="0" y="70">{{ Math.round(item.x) }}, {{ Math.round(item.y) }}</text>

    <Item v-for="childKey in item.children" :id="childKey" :parent="item.parent" track-by="$index"></Item>
  </g>

</template>

<script>
import Api from '../api'
import firebase from '../stores/firebase'
import { dropItem, removeItem, itemUpdate, toggleSelection } from '../stores/actions'
import { viewPort, selected } from '../stores/getters'

export default {
  name: 'Item',
  replace: true,

  props: {
    id: {
      type: String
    },

    parent: {
      type: String
    }
  },

  vuex: {
    actions: {
      drop: dropItem,
      remove: removeItem,
      itemUpdate,
      toggleSelection
    },

    getters: {
      viewPort,
      selected
    }
  },

  data () {
    return {
      item: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        parent: null
      },
      deltaX: 0,
      deltaY: 0,
      lastEvent: null
    }
  },

  computed: {

    position () {
      return `translate(${this.item.x || 0}, ${this.item.y || 0})`
    },

    classNames () {
      return this.selected === this.id ? 'selected' : 'unselected'
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
        this.drop(this.id, this.item)
      }

      this.lastEvent = null
    },

    update () {
      this._ref.set(this.item)
    }
  },

  ready () {
    this._ref = firebase.child('objects').child(this.id)
    this._ref.on('value', (snapshot) => {
      this.$set('item', snapshot.val())
      this.itemUpdate(this.id, this.item)
    })

    Api.on('mouseup', this.endDrag, this)
    Api.on('mousemove', this.onDrag, this)
  },

  beforeDestroy () {
    this._ref.off()
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
  transition-timing-function: cubic-bezier(0.110, 1.650, 0.345, 0.845);
  cursor: pointer;

  &.selection-indicator{
    fill: transparent;
    stroke-width: 4px;
    @include theme(stroke, primary);
  }
}

g.unselected> circle.selection-indicator {
  r: 0 !important;
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
