<!-- 
* @Description 全屏按钮
* @Date
-->
<template>
  <div class="screen-full" @click="onToggle">
    <img :src="require(`@/assets/images/${icon}.png`)" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'ScreenFull',
  computed: {
    icon() {
      return this.isFullScreen ? 'exit-fullscreen' : 'fullscreen'
    }
  },
  data() {
    return {
      isFullScreen: false
    }
  },
  methods: {
    /**
     * @Description 触发事件
     */
    onToggle() {
      screenfull.toggle()
    },
    /**
     * @Description 更新状态
     */
    change() {
      this.isFullScreen = screenfull.isFullscreen
    }
  },
  mounted() {
    screenfull.on('change', this.change)
  },
  beforeDestroy() {
    screenfull.off('change', this.change)
  }
}
</script>

<style lang="scss" scoped>
.screen-full {
  cursor: pointer;
  img {
    width: 28px;
    height: 28px;
    vertical-align: middle;
  }
}
</style>
