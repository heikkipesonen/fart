<template>
  <div class="tags-list">
    <div class="tag" v-for="item in item.tags">
      {{ item }} <span class="button" v-on:click="remove(item)">x</span>
    </div>

    <div class="tags-editor">
      <input type="text" v-model="input"> <button v-on:click="add(input)">add</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'item',
      'remove'
    ],

    data () {
      return {
        input: ''
      }
    },

    methods: {
      add (value) {
        this.item.tags.push(value)
      }
    }
  }
</script>

<style scoped>
.tags-list{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.tag{
  position: relative;
  height: 32px;
  padding: 0px 32px 0px 8px;
  font-size: 10pt;
  line-height: 32px;
  display: inline-block;
  margin: 8px 0;
  text-align: center;
  background-color: rgb(34, 246, 183);
  color: white;
}

.tag span.button{
  position: absolute;
  right: 0;
  top: 0;
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background-color: rgb(255, 180, 80);
}
</style>
