/*
 * @Author: 'zhangshengdong' '987081831@qq.com'
 * @Date: 2023-04-24 11:38:00
 * @LastEditors: 'zhangshengdong' '987081831@qq.com'
 * @LastEditTime: 2023-04-24 11:42:16
 * @FilePath: \zujian\vue2-repo-template\src\mixins\upload-mixin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {mapGetters} from 'vuex'
import {getUploadURL} from '@/modules/utils'
export default {
  props: {
    // 提示
    uploadTip: {
      type: String,
      default: ''
    },
    // 需要展示fileList的字符串
    avatar: {
      type: [String, Array],
      default: ''
    },
    // 文件大小限制 kb
    fileSize: {
      type: [Number, null],
      default: null
    },
    // 是否禁止
    disabled: {
      type: Boolean,
      default: false
    },
    // 截取字符串开始位置
    substringStart: {
      type: Number,
      default: 13
    },
    // 字符串分割符
    avatarSplit: {
      type: String,
      default: ','
    },
    drag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['token']),
    action() {
      return getUploadURL()
    },
    headers() {
      return {
        Authorization: this.token
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleError(err) {
      this.$notify({
        title: '错误',
        message: '上传失败',
        type: 'error'
      })
      this.$emit('on-error', err)
    }
  }
}
