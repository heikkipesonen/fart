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
<style>
.input-container {
  display: inline-block;
  position: relative;
  padding: 24px 8px 0 8px;
  font-size: 10pt;
  display: flex;
}

.input-container .input-label{
  position: absolute;
  bottom: 8px;
  left: 16px;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.7);
}

.input-container input{
  font-size: 10pt;
  min-width: 64px;
  flex: 1;
  padding: 8px;
  outline: none;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.45);
  transition: 0.2s;
  background-color: transparent;
  color: inherit;
}

.input-container input:not(:placeholder-shown){
  border-bottom: 2px solid rgb(255, 255, 255);
}

.input-container input::placeholder{
  opacity: 0;
}

.input-container input:not(:placeholder-shown) + .input-label,
.input-container input:focus + .input-label{
  transform: translate3d(-10px,-23px,0) scale3d(0.9, 0.9, 1);
  color: white;
}

.input-container input:focus, .input-container input:active {
  border-bottom: 2px solid rgb(255, 255, 255);
}
</style>
