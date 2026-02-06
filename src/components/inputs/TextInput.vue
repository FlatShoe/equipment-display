<!-- 
* @Description 文本框
* @Date
-->
<template>
  <el-form-item class="text-input" :label="label" :prop="name" :required="required">
    <el-input
      type="text"
      v-model="stingValue"
      :value="value"
      :placeholder="placeholder?placeholder:`请输入${label}`"
      :disabled="disabled"
      :readonly="readonly"
      @change="$emit('input', $event)"
    >
    </el-input>
  </el-form-item>
</template>

<script>
import inputMixin from '@/mixins/input-mixin'
export default {
  name: 'TextInput',
  mixins: [inputMixin],
  data() {
    return {
      stingValue: ''
    }
  },
  watch: {
    value: {
      handler(value) {
        this.stingValue = value
      },
      immediate: true
    }
  }
}
</script>
