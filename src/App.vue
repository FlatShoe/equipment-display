<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
html,
body,
#app {
  width: 100%;
  min-width: 760PX;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  overflow-x: auto;
}
</style>
