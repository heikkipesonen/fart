<template>

    <view-canvas :center.sync="center">
      <Item v-for="(id, child) in children" :id="id" :item="child" track-by="$index"></Item>
    </view-canvas>

    <div class="toolbar">
      <button v-on:click="createCanvas({name: Date.now()})">Canvas</button>
      {{ canvas ? canvas.name : '' }}
      <button v-on:click="addChild(center)">add Item</button>
    </div>

    <item-editor v-if="editableItem" :item="editableItem"></item-editor>
</template>

<script>
import Item from './components/item'
import ViewCanvas from './components/view-canvas'
import ItemEditor from './components/item-editor'
import store from './stores/store'

import { createCanvas, addChild, initializeCanvas } from './stores/actions'
import { canvas, children } from './stores/getters'

export default {
  components: {
    ViewCanvas,
    Item,
    ItemEditor
  },

  store,

  vuex: {
    actions: {
      createCanvas,
      addChild,
      initializeCanvas
    },

    getters: {
      canvas,
      children
    }
  },

  data () {
    return {
      id: 3,
      center: {
        x: 0,
        y: 0
      }
    }
  },

  methods: {
  },

  ready () {
    let id = this.$route.params.canvas
    this.initializeCanvas(id)
    console.log(this)
  }
}
</script>

<style lang="scss">
/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/
@import './styles/reset';
@import './styles/layout';

body, html{
  font-family: Helvetica neue;
}

</style>
