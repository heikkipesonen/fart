<template>

    <view-canvas>
      <Item v-for="item in items" :item="item"></Item>
    </view-canvas>

    <button v-on:click="createItem()">add Item</button>
</template>

<script>
import Item from './components/item'
import ViewCanvas from './components/view-canvas'

export default {

  components: {
    ViewCanvas,
    Item
  },

  data () {
    return {
      id: null,
      resource: null,
      items: []
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

<style>
/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

*{
  margin: 0;
  box-sizing: border-box;
}
body, html{
  font-family: Helvetica neue;
}

button{
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 16px;
  background-color: rgb(61, 196, 254);
  color: white;

  flex: 1 1 auto;
}

button[round] {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  box-shadow: 0px 3px 20px 0px rgba(0,0,0,0.4);
}

button:hover{
  opacity: 0.7;
}

.column{
  padding-left: 8px;
  padding-right: 8px;
}

.row{
  margin-left: -8px;
  margin-right: -8px;
}

.flex, [flex]{
  flex: 1;
}

.layout-column{
  display: flex;
  flex-direction: column;
}

.layout-row{
  display: flex;
  flex-direction: row;
}

.padding{
  padding: 16px;
}
</style>
