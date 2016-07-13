<template>
<div class="item-editor" layout-column>
  <div class="header toolbar horizontal">
    <h2 flex>{{item.title}}</h2>
    <button v-on:click="close()">x</button>
  </div>
  <div class="editor-content">
    <div class="layout-row">

    </div>

    <div class="layout-row">
      <input-container label="x" flex>
        <input v-on:blur="_update()" type="text" v-model="item.x" placeholder=" ">
      </input-container>
      <input-container label="y" flex>
        <input v-on:blur="_update()" type="text" v-model="item.y" placeholder=" ">
      </input-container>
      <input-container label="id" flex>
        <input v-on:blur="_update()" type="text" v-model="id" placeholder=" ">
      </input-container>
      <input-container label="parent" flex>
        <input v-on:blur="_update()" type="text" v-model="item.parent" placeholder=" ">
      </input-container>
    </div>

    <div class="layout-row">
      <input-container label="type" flex>
        <input v-on:blur="_update()" type="text" v-model="item.type" placeholder=" ">
      </input-container>
      <input-container label="width" flex v-if:="item.type !== 'circle'">
        <input v-on:blur="_update()" type="text" v-model="item.width" placeholder=" ">
      </input-container>
      <input-container label="height" flex v-if:="item.type !== 'circle'">
        <input v-on:blur="_update()" type="text" v-model="item.height" placeholder=" ">
      </input-container>
      <input-container label="radius" flex v-if:="item.type === 'circle'">
        <input v-on:blur="_update()" type="text" v-model="item.radius" placeholder=" ">
      </input-container>
    </div>

    <input-container label="title" flex>
      <input v-on:blur="_update()" type="text" v-model="item.title" placeholder=" ">
    </input-container>

    <input-container label="text" flex>
      <textarea v-on:blur="_update()" type="text" v-model="item.text" placeholder=" "></textarea>
    </input-container>
  </div>
  <div class="toolbar horizontal">

  </div>

</div>
</template>

<script>
import InputContainer from './input-container'
import { editorItem, editorObject } from '../stores/getters'
import { itemUpdate, closeEditor } from '../stores/actions'

export default {
  name: 'itemEditor',

  components: {
    InputContainer
  },

  vuex: {
    actions: {
      update: itemUpdate,
      close: closeEditor
    },

    getters: {
      id: editorItem,
      item: editorObject
    }
  },

  computed: {
  },

  data () {
    return {
      loading: false
    }
  },

  ready () {
    console.log(this.item, editorItem)
  },

  methods: {
    _update () {
      this.update(this.id, this.item)
    }
  }

}
</script>

<style lang="scss" scoped>
@import '../styles/theme';

.item-editor{
  position: fixed;
  left: auto;
  right: 0;
  bottom: 0;
  top: 0;
  width: 40%;
  background-color: white;
  box-shadow: 0px 0px 150px -30px rgba(0,0,0,0.7);

  @include theme('border-color', secondary);
  @include theme('color', secondary);
}

.editor-content{
  padding: 16px;
  flex: 1 0 auto;
}

</style>
