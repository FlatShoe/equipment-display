<!-- 
* @Description 上传单张图片
* @Date
-->
<template>
  <div class="upload-image-container">
    <p class="icon-wrapper" v-if="imageUrl">
      <i
        class="el-icon-zoom-in"
        style="color: #409eff"
        @click="$refs.imageViewerRef.show([imageUrl])"
      ></i>
      <i class="el-icon-delete-solid" style="color: #f56c6c" v-if="!disabled" @click="remove"></i>
    </p>
    <el-upload
      list-type="picture-card"
      ref="uploadImageRef"
      class="upload-image"
      :class="{'not-allowed': disabled}"
      :style="{
        width: drag ? 'fit-content' : `calc(${width} + 25px)`,
        height: drag ? 'fit-content' : `calc(${height} + 25px)`
      }"
      :show-file-list="false"
      :action="action"
      :headers="headers"
      :accept="accept"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="handleBeforeUpload"
      :disabled="disabled"
      :drag="drag"
    >
      <!-- 显示图片 -->
      <c-img v-if="imageUrl" class="avatar" :src="imageUrl" :isPreview="false" />
      <template v-else>
        <!-- 拖拽上传 -->
        <div class="avatar-uploader-icon-drag" v-if="drag">
          <i class="drag-icon el-icon-upload"></i>
          <div class="drag-text el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </div>
        <!-- 正常上传 -->
        <div class="avatar-uploader-icon" v-else>
          <i class="el-icon-plus" v-loading="loading"></i>
        </div>
      </template>
      <div slot="tip" class="el-upload__tip" v-if="uploadTip">{{ uploadTip }}</div>
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
  name: 'UploadImage',
  mixins: [uploadMixin, uploadImageMixin],
  props: {
    width: {
      type: String,
      default: '120px'
    },
    height: {
      type: String,
      default: '130px'
    }
  },
  data() {
    return {
      isViewerShow: false,
      viewerUrlList: [],
      imageUrl: ''
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
    handleSuccess(res) {
      this.loading = false
      const {
        success,
        data: {url}
      } = res
      if (success) {
        this.imageUrl = url
        this.$emit('on-success', {
          message: '上传成功',
          url,
          file: {name: getResourceName(url).substring(this.substringStart), url}
        })
      }
    },
    /*
     * @Description 移除
     */
    remove() {
      const url = this.clearFiles()
      const file = {
        url,
        name: getResourceName(url).substring(this.substringStart)
      }
      this.$emit('on-remove', {message: '移除成功', url, file})
    },
    /*
     * @Description 清空 可提供外部使用
     */
    clearFiles() {
      const url = this.imageUrl
      this.$refs.uploadImageRef.clearFiles()
      this.imageUrl = ''
      return url
    }
  },
  watch: {
    avatar: {
      handler(value) {
        this.imageUrl = value
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.upload-image-container {
  position: relative;
  width: fit-content;
  height: fit-content;
  padding: 10px 0;
  &:hover {
    .icon-wrapper {
      display: inline-block;
    }
  }
  .icon-wrapper {
    display: none;
    position: absolute;
    top: -20px;
    right: 10px;
    cursor: pointer;
    font-size: 18px;
  }
  .upload-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .el-upload-dragger {
    border: none;
  }
  .upload-image .el-upload {
    width: 100%;
    height: 100%;
    border: 1px dashed #3074ff;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    background-color: rgba(48, 116, 255, 0.1);
  }
  .not-allowed .el-upload {
    cursor: not-allowed;
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
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
