<template>
  <g :transform="position" :class="classNames">

    <path v-if="item.parent" :d="bezier"></path>

    <text class="text" text-anchor="middle" x="0" :y="topLabelPosition">{{ title }}</text>
    <text class="text" text-anchor="middle" x="0" :y="bottomLabelPosition">{{ Math.round(item.x) }}, {{ Math.round(item.y) }}</text>

    <circle v-if="item.parent" class="detach" :cx="middlePoint.x" :cy="middlePoint.y" r="20" v-on:click.self="detach(id)"></circle>

    <g>
      <circle v-if="type === 'circle'" cx="0" cy="0" :r="radius" v-on:mousedown.self="startDrag"  v-on:click="_editItem(id)"></circle>
      <rect v-if="type === 'square'" :width="width" :height="height" :x="-width / 2" :y="-height / 2" v-on:mousedown.self="startDrag" v-on:click="_editItem(id)"></rect>
    </g>

    <Item v-for="childKey in children" :id="childKey" track-by="$index"></Item>
  </g>

</template>

<script>
import Api from '../api'
import store from '../stores/store'
import { dropItem, removeItem, itemUpdate, toggleSelection, detachItem, editItem, closeEditor } from '../stores/actions'
import { viewPort, selected, types } from '../stores/getters'

export default {
  name: 'Item',
  replace: true,

  props: {
    id: {
      type: String
    }
  },

  vuex: {
    actions: {
      drop: dropItem,
      remove: removeItem,
      update: itemUpdate,
      detach: detachItem,
      toggleSelection,
      editItem,
      closeEditor
    },

    getters: {
      viewPort,
      selected,
      types
    }
  },

  data () {
    return {
      smoothFactor: 1000,
      deltaX: 0,
      deltaY: 0,
      lastEvent: null
    }
  },

  default: {
    type: 'circle'
  },

  computed: {
    topLabelPosition () {
      if (this.type === 'circle') {
        return -this.radius - 10
      }
      return -this.height / 2 - 10
    },

    bottomLabelPosition () {
      if (this.type === 'circle') {
        return this.radius + 20
      }
      return this.height / 2 + 20
    },

    title () {
      return this.item.title ? this.item.title : this.id
    },

    radius () {
      return parseInt(this.item.radius ? this.item.radius : this.item.height ? this.item.height : this.item.width ? this.item.width : 30)
    },

    width () {
      return parseInt(this.item.width ? this.item.width : this.item.height ? this.item.height : this.item.radius ? this.item.radius : 30)
    },

    height () {
      return parseInt(this.item.height ? this.item.height : this.item.width ? this.item.width : this.item.radius ? this.item.radius : 30)
    },

    type () {
      return this.types.indexOf(this.item.type) > -1 ? this.item.type : 'circle'
    },

    middlePoint () {
      return {
        x: -this.item.x / 2,
        y: -this.item.y / 2
      }
    },

    bezier () {
      return `M0,0 C0,${-this.item.y / this.smoothFactor} ${-this.item.x / this.smoothFactor},0 ${-this.item.x},${-this.item.y}`
    },

    children () {
      return Object.keys(this.item.children || {})
    },

    item () {
      return store.state.objects[this.id] || {x: 0, y: 0, width: 0, height: 0}
    },

    position () {
      return `translate(${this.item.x || 0}, ${this.item.y || 0})`
    },

    classNames () {
      return this.selected === this.id ? 'selected' : 'unselected'
    }
  },

  methods: {
    toggle () {
      console.log('pyly')
    },

    _editItem (id) {
      if (Math.abs(this.deltaX) < 5 && Math.abs(this.deltaY) < 5) {
        this.editItem(id)
      }
    },

    startDrag (evt) {
      this.deltaX = 0
      this.deltaY = 0

      evt.stopImmediatePropagation()
      evt.preventDefault()

      this.lastEvent = {
        x: evt.pageX,
        y: evt.pageY
      }

      this.closeEditor()
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
    }
  },

  ready () {
    Api.on('mouseup', this.endDrag, this)
    Api.on('mousemove', this.onDrag, this)
  },

  beforeDestroy () {
    Api.removeAll(this)
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/theme';

.text {
  font-weight: 200;
  text-transform: uppercase;
  @include theme(fill, primary);
}

circle, rect {
  @include theme(fill, primary);
  position: relative;
  cursor: pointer;
  transition: 0.3s;
  transition-property: fill;

  &.selection-indicator{
    transition: 0.3s;
    transition-timing-function: cubic-bezier(0.110, 1.650, 0.345, 0.845);
    fill: transparent;
    stroke-width: 4px;
    @include theme(stroke, primary);
  }

  &.detach {
    fill: transparent;
    stroke-width: 4px;
    @include theme(stroke, secondary);
  }

  &:hover {
    @include theme(fill, secondary);
  }
}

.selected>g{
  >circle, >rect {
    @include theme(fill, secondary);
  }
}

circle:hover ~ g {
  path {
    @include theme(stroke, secondary);
  }

  circle {
    @include theme(fill, secondary);
  }

  text {
    @include theme(fill, secondary);
  }
}

g.unselected> circle.selection-indicator {
  r: 0 !important;
}

line, path {
   @include theme(stroke, primary);
   fill: transparent;
   pointer-events: none;
   opacity: 0.3;
   stroke-width: 2;
}

.item {
  position: absolute;
  padding: 16px;
  width: 200px;
  background-color: rgb(29, 154, 233);
  color: white;
}

svg {
  position: absolute;
  top: 100px;
  left: 100px;
}

</style>
