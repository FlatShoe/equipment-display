<!-- 
* @Description 主体区域
-->
<template>
  <div class="app-main page">
    <transition name="slide-left-nr">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="slide-left-nr">
      <router-view class="main-view" v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  .main-view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  }
  .slide-left-nr-enter {
    opacity: 0;
    -webkit-transform: translate(15px, 0);
    transform: translate(15px, 0);
  }
  .slide-left-nr-leave-active {
    opacity: 0;
    -webkit-transform: translate(-15px, 0);
    transform: translate(-15px, 0);
  }
}
</style>
