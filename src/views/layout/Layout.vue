<!-- 
* @Description 基础架构
-->
<template>
  <div class="layout-container">
    <div class="layout-wrapper">
      <app-main class="layout-main" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {mapGetters, mapMutations} from 'vuex'
import AppMain from './main/AppMain.vue'
export default {
  name: 'Layout',
  components: {
    AppMain
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/style/variables.scss';
.layout-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .layout-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .layout-main {
    width: 100%;
    overflow: hidden;
  }
  .layout-main {
    flex: 1;
    background-color: $mainBg;
  }
}
</style>
