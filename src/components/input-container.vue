<template>
  <label class="input-container">
    <slot></slot>
    <span class="input-label">{{ label }}</span>
  </label>
</template>

<script>
export default {
  props: {
    label: {
      type: String
    }
  }
}
</script>
<style lang="scss">
@import '../styles/theme';

.input-container {
  display: inline-block;
  position: relative;
  padding: 24px 8px 0 8px;
  font-size: 10pt;
  display: flex;

  .input-label{
    position: absolute;
    bottom: 8px;
    left: 10px;
    transition: 0.2s;
    font-weight: 200;
    color: #aaa;
  }

  input{
    font-size: 10pt;
    min-width: 64px;
    flex: 1;
    padding: 8px 2px;
    outline: none;
    border: none;
    border-bottom: 2px solid;
    color: #aaa;
    transition: 0.2s;
    background-color: transparent;
    font-weight: 200;
  }


  input::placeholder{
    opacity: 0;
  }

  input:not(:placeholder-shown){
    border-bottom: 2px solid #aaa;
    color: #222;
  }

  input:not(:placeholder-shown) + .input-label,
  input:focus + .input-label{
    transform: translate3d(-2px,-23px,0) scale3d(0.9, 0.9, 1);
  }

  input:focus, input:active {
    border-bottom: 2px solid;
    @include theme(color, primary);
  }

  input:focus + label, input:active + label{
    color: inherit;
  }
}





</style>
