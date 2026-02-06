<!-- 
* @Description 侧边菜单
* @Date 2022-05-31
-->
<template>
  <el-menu
    ref="menuRef"
    uniqueOpened
    router
    :collapse="!collapse"
    :default-active="defaultActive"
    @select="select"
    @open="open"
  >
    <sidebar-menu-item v-for="route in menus" :key="route.path" :route="route" />
  </el-menu>
</template>

<script>
import _ from 'lodash'
import routeMenus from '@/modules/routeMenus'
import SidebarMenuItem from './SidebarMenuItem.vue'
import {mapGetters} from 'vuex'
export default {
  name: 'SidebarMenu',
  components: {
    SidebarMenuItem
  },
  computed: {
    ...mapGetters(['collapse']),
    menus() {
      return routeMenus.generateMenus(this.$router.options.routes)
    },
    defaultActive() {
      const {path, meta} = this.$route
      if (meta && meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  methods: {
    select(index, paths) {
      // paths 点击的菜单目前包含哪些路由
      // openedMenus 已打开菜单
      const openedMenus = this.$refs.menuRef.$data.openedMenus
      if (openedMenus.length && paths.length) {
        const closes = _.difference(openedMenus, paths)
        closes.forEach(path => {
          this.$refs.menuRef.close(path)
        })
      }
    },
    open(path) {
      this.$router.push(path).catch(err => err)
    }
  }
}
</script>
