<!-- 
* @Description 文件预览
-->
<template>
  <div class="file-view page" v-loading="url && loading">
    <template v-if="url">
      <iframe
        style="width: 100%; height: 100%"
        frameborder="0"
        :src="fileType === 'pdf' ? src : fileViewUrl"
        @load="load"
      ></iframe>
    </template>
    <span class="empty" v-else>暂无数据</span>
  </div>
</template>
<script>
import {getFIleSuffix} from '@/utils/general'
import {getFileUrl, getFileViewUrl} from '@/modules/utils'
import {isExternal} from '@/utils/validate'
import {encode} from 'js-base64'
export default {
  name: 'FileView',
  props: {
    url: {
      type: String,
      defualt: ''
    }
  },
  computed: {
    fileType() {
      const suffix = getFIleSuffix(this.url)
      return suffix
    },
    fileViewUrl() {
      const encodeUrl = encodeURIComponent(encode(decodeURIComponent(this.src)))
      return `${getFileViewUrl()}/onlinePreview?url=${encodeUrl}`
    }
  },
  data() {
    return {
      loading: true,
      src: ''
    }
  },
  methods: {
    load() {
      this.loading = false
    }
  },
  watch: {
    url: {
      handler(value) {
        this.src = isExternal(value) ? value : `${getFileUrl()}${value}`
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.file-view {
  position: relative;
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
