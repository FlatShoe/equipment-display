<!--
* @Description 菜单项
* @Date 2022-05-31
-->
<template>
  <div class="sidebar-menu-item" :class="[`sidebar-menu-item-${level}`]" v-if="level <= 3">
    <el-submenu v-if="route.children && route.children.length > 0" :index="route.path">
      <template slot="title">
        <div class="submenu-wrapper">
          <menu-item :icon="route.meta.icon" :title="route.meta.title" :level="level"></menu-item>
        </div>
      </template>
      <template v-if="level < 2">
        <sidebar-menu-item
          v-for="item in route.children"
          :key="item.path"
          :route="item"
          :routeLevel="level + 1"
        />
      </template>
      <template v-else>
        <el-menu-item-group>
          <menu-item
            v-for="item in route.children"
            :key="item.path"
            :title="item.meta.title"
            :level="level + 1"
            :index="item.path"
          ></menu-item>
        </el-menu-item-group>
      </template>
    </el-submenu>
    <el-menu-item v-else :index="route.path">
      <div class="menu-item-wrapper">
        <menu-item :icon="route.meta.icon" :title="route.meta.title" :level="level"></menu-item>
      </div>
    </el-menu-item>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue'
export default {
  name: 'SidebarMenuItem',
  components: {
    MenuItem
  },
  props: {
    route: {
      type: Object,
      required: true
    },
    routeLevel: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      level: 1
    }
  },
  watch: {
    routeLevel: {
      handler(level) {
        this.level = level
      },
      immediate: true
    }
  }
}
</script>
