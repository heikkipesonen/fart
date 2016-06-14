<template>

    <view-canvas>
      <Item v-for="childId in canvasObjects" :id="childId" track-by="$index"></Item>
    </view-canvas>

    <div class="toolbar">
      <button v-on:click="showItems()">+View</button>
      <button v-on:click="createCanvas({name: Date.now(), type: 'canvas'})">+Canvas</button>
      <button v-on:click="addChild()">+Item</button>
    </div>

    <item-editor v-if="editableItem" :item="editableItem"></item-editor>
</template>

<script>
import Item from './components/item'
import ViewCanvas from './components/view-canvas'
import ItemEditor from './components/item-editor'

import { createCanvas, addChild, initializeCanvas } from './stores/actions'
import { showItems } from './stores/view-actions'
import { canvas, canvasObjects } from './stores/getters'

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
      initializeCanvas
    },

    getters: {
      canvas,
      canvasObjects
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
@import './styles/layout';
@import './styles/theme';
g{
  overflow: visible;
}
.toolbar{
  position: absolute;
  width: 64px;
  top: 0;
  left: 0;
  bottom: 0;
  @include theme(background-color, primary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: white;

  button{
    width: 64px;
    height: 64px;
    transition: 0.2s;

    &:hover{
      background-color: rgba(255, 255, 255, 0.31);
    }
  }
}

body, html{
  font-family: Helvetica neue;
}

</style>
