<!--
* @Description 图片组件
* @Date
-->
<template>
  <el-image
    :alt="alt"
    :fit="fit"
    :src="avatar"
    :preview-src-list="srcList"
    @load="load"
    @error="error"
  >
    <div slot="error">
      <i class="el-icon-picture-outline"></i>
    </div>
    <div slot="placeholder" class="c-img-placeholder">
      <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" />
      </svg>
    </div>
  </el-image>
</template>

<script>
import {jointServePrefix} from '@/modules/utils'
export default {
  name: 'CImg',
  props: {
    // 图片地址
    src: {
      type: String,
      default: ''
    },
    // 图片如何适应容器框
    fit: {
      type: String,
      default: 'contain'
    },
    // 是否开启大图预览
    isPreview: {
      type: Boolean,
      default: true
    },
    // 大图预览地址列表
    previewSrcList: {
      type: Array || null,
      default() {
        return []
      }
    },
    alt: {
      type: String,
      default: ''
    }
  },
  computed: {
    avatar() {
      return jointServePrefix(this.src)
    },
    srcList() {
      if (!this.isPreview) return []
      return this.previewSrcList && this.previewSrcList.length ? this.previewSrcList : [this.avatar]
    }
  },
  methods: {
    load() {
      this.$emit('load')
    },
    error() {
      this.$emit('error')
    }
  }
}
</script>

<style scoped lang="scss">
.c-img-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  .circular {
    width: 42px;
    height: 42px;
    animation: loading-rotate 2s linear infinite;
  }
  .path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #20a0ff;
    stroke-linecap: round;
  }
}
</style>
