<template>

    <view-canvas>
      <Item v-for="item in items" :item="item"></Item>
    </view-canvas>

    <div class="toolbar">
      <button v-on:click="createItem()">add Item</button>
    </div>

    <item-editor v-if="editableItem" :item="editableItem"></item-editor>
</template>

<script>
import Item from './components/item'
import ViewCanvas from './components/view-canvas'
import ItemEditor from './components/item-editor'

export default {

  components: {
    ViewCanvas,
    Item,
    ItemEditor
  },

  data () {
    return {
      id: null,
      resource: null,
      items: [],
      editableItem: null
    }
  },

  methods: {
    _removeChild (item) {
      let childIndex = this.items.indexOf(item)

      if (childIndex > -1) {
        this.items.splice(childIndex, 1)
      }
    },

    createItem () {
      var item = this.$resource('item')
      item.save({
        type: 'item'
      }).then((response) => {
        this.items.push(response.data)
      })
    },

    showEditor (item) {
      console.log(item)
      this.editableItem = item
    }
  },

  ready () {
    this.$on('showEditor', this.showEditor)

    this.resource = this.$resource('item')

    this.resource.get().then((response) => {
      this.$set('items', response.data)
    })
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
