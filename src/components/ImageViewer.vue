<!-- 
* @Description 图片展示模态框
* @Date
-->
<template>
  <el-image-viewer
    v-if="isViewerShow"
    :on-close="closeViewer"
    :url-list="urlList"
  ></el-image-viewer>
</template>

<script>
import {jointServePrefix} from '@/modules/utils'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'ImageViewer',
  components: {
    ElImageViewer
  },
  computed: {
    urlList() {
      return this.viewerUrlList.map(url => jointServePrefix(url))
    }
  },
  data() {
    return {
      isViewerShow: false,
      viewerUrlList: []
    }
  },
  methods: {
    show(viewerUrlList) {
      this.isViewerShow = true
      this.viewerUrlList = viewerUrlList
    },
    closeViewer() {
      this.isViewerShow = false
      this.viewerUrlList = []
      this.$emit('close')
    }
  }
}
</script>

<style scoped></style>
