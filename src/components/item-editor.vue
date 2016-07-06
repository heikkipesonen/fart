<template>
<div class="item-editor" layout-column>
  <div class="header">
    <h2>{{item.title}}</h2>
  </div>
  <div class="editor-content">
    <div class="layout-row">

    </div>
    <div class="layout-row">
      <input-container label="name" flex>
        <input v-on:blur="update()" type="text" v-model="item.name" placeholder=" ">
      </input-container>
    </div>

    <div class="layout-row">
      <input-container label="x" flex>
        <input v-on:blur="update()" type="text" v-model="item.x" placeholder=" ">
      </input-container>
      <input-container label="y" flex>
        <input v-on:blur="update()" type="text" v-model="item.y" placeholder=" ">
      </input-container>
      <input-container label="id" flex>
        <input v-on:blur="update()" type="text" v-model="id" placeholder=" ">
      </input-container>
      <input-container label="parent" flex>
        <input v-on:blur="update()" type="text" v-model="item.parent" placeholder=" ">
      </input-container>
    </div>

    <div class="layout-row">
      <input-container label="type" flex>
        <input v-on:blur="update()" type="text" v-model="item.type" placeholder=" ">
      </input-container>
      <input-container label="width" flex>
        <input v-on:blur="update()" type="text" v-model="item.width" placeholder=" ">
      </input-container>
      <input-container label="height" flex>
        <input v-on:blur="update()" type="text" v-model="item.height" placeholder=" ">
      </input-container>
      <input-container label="radius" flex>
        <input v-on:blur="update()" type="text" v-model="item.radius" placeholder=" ">
      </input-container>
    </div>

    <input-container label="title" flex>
      <input v-on:blur="update()" type="text" v-model="item.title" placeholder=" ">
    </input-container>

    <input-container label="text" flex>
      <textarea v-on:blur="update()" type="text" v-model="item.text" placeholder=" "></textarea>
    </input-container>
  </div>
  <div class="toolbar">

  </div>

</div>
</template>

<script>
import InputContainer from './input-container'
import { editorItem } from '../stores/getters'
import { itemUpdate } from '../stores/actions'

export default {
  name: 'itemEditor',

  components: {
    InputContainer
  },

  vuex: {
    actions: {
      itemUpdate
    },

    getters: {
      editorItem: editorItem
    }
  },

  computed: {
    id () {
      return this.editorItem.id
    },

    item () {
      return this.editorItem.item
    }
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
    update () {
      this.itemUpdate(this.id, this.item)
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

.header {
  @include theme('background-color', primary);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;

  h2 {
    white-space: nowrap;
    max-width: 90%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.editor-content{
  padding: 16px;
  flex: 1 0 auto;
}

.toolbar{
  position: relative;
  width: 100%;
  height: 64px;
  display: flex;
}
</style>
