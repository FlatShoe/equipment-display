<!-- 
* @Description 文件预览弹窗
* @Date
-->
<template>
  <div class="file-view-dialog">
    <form-dialog
      class="file-view-dialog"
      :width="width"
      :visible="visible"
      :title="title || '文件预览'"
      :showButtons="false"
      :appendToBody="appendToBody"
      @close="handleDialogClose"
    >
      <div class="content" :style="{height: contentHeight}">
        <file-view :url="url" />
      </div>
    </form-dialog>
  </div>
</template>

<script>
import FileView from './FileView'
import FormDialog from './FormDialog.vue'
export default {
  name: 'FileViewDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '1000px'
    },
    contentHeight: {
      type: String,
      default: '500px'
    }
  },
  components: {
    FileView,
    FormDialog
  },
  data() {
    return {
      visible: false,
      url: ''
    }
  },
  methods: {
    async show(url) {
      this.url = url
      this.visible = true
    },

    handleDialogClose() {
      this.url = null
      this.visible = false
    }
  }
}
</script>
