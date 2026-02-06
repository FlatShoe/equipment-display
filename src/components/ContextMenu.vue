<!--
* @Description 右键菜单
* @Date
-->
<template>
  <ul class="context-menu" :style="{...offset}">
    <li
      class="menu-item"
      @click="handleClick(item, index)"
      :key="item.name || index"
      v-for="(item, index) in menuItems"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    offset: {
      type: Object,
      default: () => ({
        top: '0px',
        left: '0px'
      })
    },
    top: {
      type: String,
      default: '0px'
    },
    left: {
      type: String,
      default: '0px'
    },
    menuItems: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    /**
     * @Description 点击菜单项
     * @param {Object} item 当前菜单项
     * @param {Number} index 当前菜单项索引
     */
    handleClick(item, index) {
      // 是否有自定义事件
      if (item.emit) return this.$emit(item.emit, item, index)
      this.$emit('emitClick', item, index)
    }
  }
}
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  background: #fff;
  z-index: 3000;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  .menu-item {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
