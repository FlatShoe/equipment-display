<!-- 
* @Description 
* @Date
-->
<template>
  <div class="upload-images-container">
    <el-upload
      ref="uploadImagesRef"
      list-type="picture-card"
      :class="{'not-allowed': disabled, dragger: drag}"
      :action="action"
      :headers="headers"
      :accept="accept"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
      :disabled="disabled"
      :drag="drag"
      :file-list="fileList"
      :limit="limit"
    >
      <!-- 拖拽上传 -->
      <div class="avatar-uploader-icon-drag" v-if="drag">
        <i class="drag-icon el-icon-upload"></i>
        <div class="drag-text el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <!-- 正常上传 -->
      <div class="avatar-uploader-icon" v-else>
        <i class="el-icon-plus" v-loading="loading"></i>
      </div>
      <div class="file-slot" slot="file" slot-scope="{file: {url, response}}">
        <c-img :src="response ? response.data.url : url" :isPreview="false" />
        <span class="control-action el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="$refs.imageViewerRef.show([response ? response.data.url : url])"
          >
            <i class="el-icon-zoom-in" style="color: #409eff"></i>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleRemove(response ? response.data.url : url)"
            v-if="!disabled"
          >
            <i class="el-icon-delete" style="color: #f56c6c"></i>
          </span>
        </span>
      </div>
      <div slot="tip" class="upload-tip el-upload__tip" v-if="uploadTip">{{ uploadTip }}</div>
    </el-upload>
    <image-viewer ref="imageViewerRef" />
  </div>
</template>

<script>
import uploadMixin from '@/mixins/upload-mixin.js'
import uploadImageMixin from '@/mixins/upload-image-mixin'
import {getResourceName, getFIleSuffix} from '@/utils/general'
import {BASE_KB_B, BASE_MB_B} from '@/constant'
export default {
  name: 'UploadImages',
  mixins: [uploadMixin, uploadImageMixin],
  props: {
    // 文件个数限制
    limit: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    /*
     * @Description 上传前
     */
    handleBeforeUpload(file) {
      this.loading = true
      if (this.fileType.length) {
        if (!this.fileType.includes(getFIleSuffix(file.name))) {
          this.$notify({
            title: '错误',
            message: `允许上传文件类型为 ${this.fileType.join('、')}`,
            type: 'error'
          })
          this.loading = false
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
          this.loading = false
          return false
        }
      }
      this.$emit('before-upload', file)
    },
    handleSuccess(res, file, fileList) {
      this.loading = false
      const {success, data} = res
      if (success) {
        const {url} = data
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
      }
    },
    handleExceed() {
      this.$notify({
        title: '错误',
        message: `允许上传文件个数最大为${this.limit}个`,
        type: 'error'
      })
    },
    /*
     * @Description 移除
     */
    handleRemove(url) {
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
    /*
     * @Description 清空 可提供外部使用
     */
    clearFiles() {
      this.$refs.uploadImagesRef.clearFiles()
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
.upload-images-container {
  position: relative;

  .el-list-enter-active,
  .el-list-leave-active {
    transition: none;
  }
  .el-list-enter,
  .el-list-leave-active {
    opacity: 0;
  }

  .el-upload {
    border: 1px dashed #3074ff;
    border-radius: 6px;
  }
  .dragger {
    .el-upload--picture-card {
      width: fit-content;
      height: fit-content;
    }
  }
  .el-upload-dragger {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
  }
  .file-slot {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .control-action {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .upload-tip {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .avatar-uploader-icon-drag,
  .avatar-uploader-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .avatar-uploader-icon-drag {
    flex-direction: column;
    overflow: hidden;
    .drag-icon,
    .drag-text {
      line-height: 1.5;
      margin: 0;
    }
  }
  .avatar-uploader-icon {
    i {
      color: #3074ff;
      font-weight: 700;
      font-size: 28px;
    }
  }
  .not-allowed .el-upload {
    cursor: not-allowed;
  }
}
</style>
