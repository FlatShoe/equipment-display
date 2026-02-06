<!-- 
* @Description 侧边栏
* @Date 2022-05-27
-->
<template>
  <div class="sidebar">
    <div class="logo-container">
      <h1 class="logo-text" v-show="collapse">repo-template</h1>
      <p class="logo" v-show="!collapse" title="vue2-repo-template">
        <el-avatar
          shape="square"
          src="https://img2.baidu.com/it/u=420156118,3874648934&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800"
        ></el-avatar>
      </p>
    </div>
    <div class="menu-main">
      <scroll-view style="height: 100%">
        <sidebar-menu class="sidebar-menu" />
      </scroll-view>
    </div>
  </div>
</template>

<script>
import ScrollView from '@/components/ScrollView.vue'
import SidebarMenu from './SidebarMenu.vue'
import {mapGetters} from 'vuex'
export default {
  name: 'Sidebar',
  components: {
    ScrollView,
    SidebarMenu
  },
  computed: {
    ...mapGetters(['collapse'])
  },
  data() {
    return {
      flag: false
    }
  }
}
</script>
