<!-- 
* @Description 数字input
* @Date 2022-05-23
-->
<template>
  <el-form-item class="number-input" :label="label" :prop="name" :required="required">
    <el-input
      type="number"
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
  name: 'NumberInput',
  mixins: [inputMixin],
  data() {
    return {
      stingValue: ''
    }
  },
  watch: {
    value(value) {
      this.stingValue = value
    }
  }
}
</script>
