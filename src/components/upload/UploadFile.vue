<!--
* @Description 上传文件
* @Date
-->
<template>
  <div class="upload-file-container">
    <el-upload
      class="upload-file"
      ref="uploadFileRef"
      :action="action"
      :accept="accept"
      :headers="headers"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
      :multiple="multiple"
      :disabled="disabled"
      show-file-list
      :file-list="fileList"
      :limit="limit"
      :drag="drag"
      :on-preview="handlePreview"
    >
      <!-- 拖拽上传 -->
      <div class="avatar-uploader-icon-drag" v-if="drag">
        <i class="drag-icon el-icon-upload"></i>
        <div class="drag-text el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <!-- 正常上传 -->
      <template v-else>
        <el-button
          v-if="!defaultSlot"
          type="primary"
          size="small"
          :disabled="disabled"
          :loading="loading"
          >{{ buttonName }}</el-button
        >
        <slot v-else></slot>
      </template>
      <div slot="tip" class="el-upload__tip" v-if="uploadTip">{{ uploadTip }}</div>
    </el-upload>
    <file-view-dialog appendToBody :modal="false" ref="fileViewDialogRef" />
  </div>
</template>

<script>
import uploadMixin from '@/mixins/upload-mixin.js'
import {getResourceName, getFIleSuffix} from '@/utils/general'
import {BASE_KB_B, BASE_MB_B} from '@/constant'
export default {
  name: 'UploadFile',
  mixins: [uploadMixin],
  props: {
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 接受的类型
    accept: {
      type: String,
      defualt: ''
    },
    // 按钮名字
    buttonName: {
      type: String,
      default: '点击上传'
    },
    // 文件个数限制
    limit: {
      type: Number,
      default: 5
    },
    // 只允许上传的类型
    fileType: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否点击列表预览
    fileView: {
      type: Boolean,
      default: true
    },
    // 是否有默认插槽
    defaultSlot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    handleSuccess(res, file, fileList) {
      const {success, data} = res
      if (success) {
        const {url} = data
        if (this.multiple) {
          // 多个
          const file = {
            name: getResourceName(url).substring(this.substringStart),
            url
          }
          this.fileList.push(file)
          const fileList = [],
            urls = []
          this.fileList.forEach(item => {
            fileList.push({name: item.name, url: item.url})
            urls.push(item.url)
          })
          this.$emit('on-success', {message: '添加成功', url, file, urls, fileList})
        } else {
          this.fileList = []
          // 单个
          const name = getResourceName(url).substring(this.substringStart)
          this.fileList = [{name, url}]
          this.$emit('on-success', {message: '添加成功', file: {name, url}, url})
        }
      }
    },
    handleExceed() {
      this.$notify({
        title: '错误',
        message: `允许上传文件个数最大为${this.limit}个`,
        type: 'error'
      })
    },
    handleBeforeUpload(file) {
      if (this.fileType.length) {
        if (!this.fileType.includes(getFIleSuffix(file.name))) {
          this.$notify({
            title: '错误',
            message: `允许上传文件类型为 ${this.fileType.join('、')}`,
            type: 'error'
          })
          return false
        }
      }
      const currentSize = file.size / BASE_KB_B // 换算成kb
      if (this.fileSize) {
        if (currentSize > this.fileSize) {
          let string = ''
          if (this.fileSize * BASE_KB_B >= BASE_MB_B) {
            string = ((this.fileSize * BASE_KB_B) / BASE_MB_B).toFixed(0) + 'M'
          } else {
            string = this.fileSize.toFixed(0) + 'K'
          }
          this.$notify({
            title: '警告',
            message: `允许上传文件大小最大为${string}`,
            type: 'warning'
          })
          return false
        }
      }
    },
    handleRemove(file, fileList) {
      const {url} = file
      const index = this.fileList.findIndex(item => item.url === url)
      if (index >= 0) {
        const files = this.fileList.splice(index, 1)
        if (files && files.length) {
          const [file] = files
          const fileList = [],
            urls = []
          this.fileList.forEach(item => {
            fileList.push({name: item.name, url: item.url})
            urls.push(item.url)
          })
          this.$emit('on-remove', {
            message: '移除成功',
            url,
            file: {name: file.name, url},
            urls,
            fileList
          })
        }
      }
    },
    handlePreview(file) {
      this.$emit('on-preview', file)
      if (this.fileView) {
        this.$refs.fileViewDialogRef.show(file.url)
      }
    },
    /*
     * @Description 清空 提供外部使用
     */
    clearFiles() {
      this.$refs.uploadFileRef.clearFiles()
      this.fileList = []
    }
  },
  watch: {
    avatar: {
      handler(value) {
        if (!value) return (this.fileList = [])
        if (typeof value === 'string') value = value.split(this.avatarSplit)
        if (value instanceof Array) {
          this.fileList = value.map(url => ({
            name: getResourceName(url).substring(this.substringStart),
            url
          }))
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss">
.upload-file-container {
  .el-list-enter-active,
  .el-list-leave-active {
    transition: none;
  }
  .el-list-enter,
  .el-list-leave-active {
    opacity: 0;
  }
  .el-upload-dragger {
    border: 1px dashed #3074ff;
    border-radius: 6px;
  }
}
</style>
