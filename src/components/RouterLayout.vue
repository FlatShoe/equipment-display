<!-- 
* @Description 路由横向基础架构
-->
<template>
  <div class="route-layout page">
    <div class="route-laytou-wrapper">
      <ul class="route-layout-header">
        <router-link
          class="route-layout-header-item"
          tag="li"
          :key="route.name"
          v-for="route in routes"
          :to="{name: route.name}"
          >{{ route.title }}</router-link
        >
      </ul>
      <div class="route-layout-inner">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'RouteLayout',
  props: {
    routes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState('system', ['userInfo'])
  },
  data() {
    return {
      permisseRoutes: []
    }
  },
  watch: {
    routes: {
      handler(value) {
        // this.permisseRoutes = value
        // const temp = []
        // const menus = this.userInfo.tmenus
        // for (let i = 0; i < value.length; i++) {
        //   const route = value[i]
        //   for (let j = 0; j < menus.length; j++) {
        //     const menu = menus[j]
        //     if (route.name === menu.menuNameEn) {
        //       temp.push(route)
        //       continue
        //     }
        //   }
        // }
        // this.permisseRoutes = temp
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
$activeColor: #e6f1ff;
.route-layout {
  .route-laytou-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    color: #99a6bf;
    background-color: #f6f7fb;
    .route-layout-header {
      display: flex;
      overflow-y: hidden;
      overflow-x: auto;
      background-color: #fff;
      padding: 8px 0;
    }
    .route-layout-header-item {
      display: flex;
      align-items: center;
      height: 30px;
      cursor: pointer;
      white-space: nowrap;
      padding: 8px 16px;
      color: #296fff;
      border-radius: 8px;
      margin: 0 20px;
      &:hover {
        background-color: $activeColor;
      }
    }
    .router-link-active {
      background-color: $activeColor;
    }
    .route-layout-inner {
      flex: 1;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
}
</style>
