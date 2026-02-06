export default {
  props: {
    // 接受的类型
    accept: {
      type: String,
      default: 'image/*'
    },
    // 只允许上传的类型
    fileType: {
      type: Array,
      default() {
        return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif']
      }
    },
  }
}
