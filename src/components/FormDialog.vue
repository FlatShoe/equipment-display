<!-- 
* @Description 弹窗
-->
<template>
  <div class="form-dialog">
    <el-dialog
      :width="width"
      :title="title"
      :center="center"
      :show-close="showClose"
      :visible.sync="show"
      :destroy-on-close="destroyOnClose"
      :append-to-body="appendToBody"
      :fullscreen="fullscreen"
      :close-on-click-modal="showShade"
      :custom-class="customClass"
      @open="$emit('open')"
      @close="$emit('close')"
      @closed="$emit('closed')"
    >
      <slot></slot>
      <template slot="footer">
        <template v-if="showButtons && !showFooter">
          <div class="form-buttons">
            <el-button
              v-if="clearButton"
              :size="clearButton.size || 'small'"
              :type="clearButton.type"
              @click="show = false"
              >{{ clearButton.label }}</el-button
            >
            <el-button
              :size="button.size || 'small'"
              v-for="button in buttons"
              :key="button.label"
              :type="button.type"
              @click="$emit(button.emit, button)"
            >
              {{ button.label }}
            </el-button>
          </div>
        </template>
        <template v-if="showFooter">
          <slot name="footer"></slot>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FormDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '800px'
    },
    center: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    showButtons: {
      type: Boolean,
      default: true
    },

    // 点击遮罩关闭效果
    showShade: {
      type: Boolean,
      default: false
    },
    buttons: {
      type: Array,
      default: () => [
        {
          label: '确定',
          type: 'primary',
          emit: 'confirm'
        }
      ]
    },
    clearButton: {
      type: Object || null,
      default() {
        return {
          label: '取消',
          type: 'danger'
        }
      }
    },
    // 外部是否可以使用底部插槽
    showFooter: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: null
    }
  },
  watch: {
    visible(value) {
      this.show = value
    },
    show(val, oldVal) {
      if (oldVal !== null && val !== oldVal) {
        this.$emit('update:visible', val)
      }
    }
  }
}
</script>

<style lang="scss">
.form-dialog {
  .el-dialog {
    border-radius: 8px;
  }
}
</style>
<style lang="scss" scoped>
.form-dialog {
  .form-buttons {
    display: flex;
    justify-content: center;
    .el-button {
      margin: 0 30px;
      min-width: 80px;
      height: 36px;
    }
  }
}
</style>
