<!-- 
* @Description 开关
* @Date 2022-05-23
-->
<template>
  <el-form-item class="switch-input" :label="label" :prop="name" :required="required">
    <el-switch
      :name="name"
      :width="width"
      v-model="checked"
      :disabled="disabled || readonly"
      :active-value="1"
      :inactive-value="0"
      @change="$emit('input', $event)"
    >
    </el-switch>
  </el-form-item>
</template>

<script>
import inputMixin from '@/mixins/input-mixin'
export default {
  name: 'SwitchInput',
  mixins: [inputMixin],
  props: {
    width: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      checked: this.value
    }
  },
  watch: {
    value(v) {
      this.checked = v
    }
  }
}
</script>
