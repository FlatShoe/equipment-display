<!-- 
* @Description 数据大屏
* @Date
-->
<template>
  <div class="data-screen-wrapper page">
    <!-- 缩放盒子 -->
    <div class="data-screen-inner page" ref="dataScreenRef" :style="{
      width: width,
      height: height
    }">
      <!-- 头部 -->
      <div class="data-screen-header header-nr">
        <!-- 头部开始区域 -->
        <div class="header-start">
          <date-view />
        </div>
        <!-- 头部中间区域 -->
        <div class="header-center">
          <span class="data-screen-text-nr" @click="$router.push('/')">特殊网站访问统计</span>
        </div>
        <!-- 头部末尾区域 -->
        <div class="header-end"></div>
      </div>
      <!-- 主体区域 -->
      <div class="data-screen-main data-screen-main-nr">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import {BASE_WIDTH, BASE_HEIGHT} from '@/constant'
import DateView from './DateView.vue'
import {getScale} from '@/utils/dataScreen'

export default {
  name: 'DataScreen',
  components: {
    DateView
  },
  computed: {
    width() {
      return BASE_WIDTH + 'px'
    },
    height() {
      return BASE_HEIGHT + 'px'
    }
  },
  methods: {
    /*
     * @Description 初始化
     */
    initScreen() {
      if (this.$refs.dataScreenRef) {
        this.$refs.dataScreenRef.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
      }
      window.addEventListener('resize', this.resize)
    },
    /*
     * @Description 销毁
     */
    handleDestroy() {
      window.removeEventListener('resize', this.resize)
    },
    /*
     * @Description 监听事件
     */
    resize() {
      if (this.$refs.dataScreenRef) {
        this.$refs.dataScreenRef.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
      }
    }
  },

  mounted() {
    this.initScreen()
  },
  beforeDestroy() {
    this.handleDestroy()
  }
}
</script>

<style lang="scss" scoped>
.data-screen-wrapper {
  background: url('@/assets/images/dataScreenBg.png') no-repeat;
  background-size: 100% 100%;
  .data-screen-inner {
    .data-screen-header {
      display: flex;
      background: url('@/assets/images/data-screen-banner-bg.png') no-repeat;
      background-size: 100% 100%;
      &.header-nr {
        height: 50px;
      }
      .header-start,
      .header-end {
        flex: 1;
        display: flex;
        align-items: center;
        padding-top: 0.3%;
      }
      .header-center {
        flex: 0 0 41%;
        display: flex;
        align-items: center;
        .data-screen-text-nr {
          width: 100%;
          text-align: center;
          font-size: 21px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(0deg, rgba(122, 189, 254, 0.9) 25.92773%, #f0f6ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          cursor: pointer;
          user-select: none;
        }
      }
    }
    .data-screen-main {
      flex: 1;
      overflow: hidden;
      &.data-screen-main-nr {
        padding: 12px 42px 20px;
      }
    }
  }
}
</style>
