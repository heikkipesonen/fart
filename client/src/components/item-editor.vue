<template>
<div class="item-editor" layout-column>
  <div class="editor-content">
    <div class="layout-row">
      <input-container label="name" flex>
        <input type="text" v-model="item.name" placeholder=" ">
      </input-container>
    </div>
    <div class="layout-row">
      <input-container label="type" flex>
        <input type="text" v-model="item.type" placeholder=" ">
      </input-container>

      <input-container label="parent" flex>
        <input type="text" v-model="item.parentId" placeholder=" ">
      </input-container>
    </div>



    <input-container label="title" flex>
      <input type="text" v-model="item.title" placeholder=" ">
    </input-container>
  </div>
  <div class="toolbar">

  </div>
</div>
</template>

<script>
import InputContainer from './input-container'

export default {
  name: 'itemEditor',

  components: {
    InputContainer
  },

  props: {
    item: {
      type: Object,
      default: {}
    }
  },

  data () {
    return {
      loading: false
    }
  },

  methods: {
    update () {
      let resource = this.$resource('item/' + this.item.id)

      resource.update(this.item).then((response) => {
        this.item = response.data
      })
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
  flex: 1;
}

.toolbar{
  height: 64px;
  display: flex;
  border: 1px solid #d00;
}
</style>
