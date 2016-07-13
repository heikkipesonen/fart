<template>
    <div layout-row class="view">
      <div class="toolbar">
        <button v-on:click="showItems()">+View</button>
        <button v-on:click="createCanvas({name: Date.now(), type: 'canvas'})">+Canvas</button>
        <button v-on:click="_addChild()">+Item</button>
      </div>

      <div flex class="relative">
        <view-canvas>
          <Item v-for="childId in canvasObjects" :id="childId" track-by="$index"></Item>
        </view-canvas>
      </div>

    </div>
    <item-editor v-if="editorVisible" :item="editorItem"></item-editor>
</template>

<script>
import Item from './components/item'
import ViewCanvas from './components/view-canvas'
import ItemEditor from './components/item-editor'

import { createCanvas, addChild, initializeCanvas, editItem } from './stores/actions'
import { showItems } from './stores/view-actions'
import { canvas, canvasObjects, editorVisible, editorItem } from './stores/getters'

export default {
  components: {
    ViewCanvas,
    Item,
    ItemEditor
  },

  vuex: {
    actions: {
      showItems,
      createCanvas,
      addChild,
      initializeCanvas,
      editItem
    },

    getters: {
      canvas,
      canvasObjects,
      editorVisible,
      editorItem
    }
  },

  methods: {
    _addChild () {
      let key = this.addChild()
      this.editItem(key)
    }
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
@import './styles/theme';
@import './styles/layout';


</style>
