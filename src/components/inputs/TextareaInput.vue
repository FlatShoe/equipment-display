<!-- 
* @Description 文本域
* @Date 2022-05-23
-->
<template>
  <el-form-item class="textarea-input" :label="label" :prop="name" :required="required">
    <el-input
      type="textarea"
      v-model="stingValue"
      :rows="rows"
      :value="value"
      :placeholder="placeholder?placeholder:`请选择${label}`"
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
  name: 'TextareaInput',
  mixins: [inputMixin],
  props: {
    rows: {
      type: Number,
      default: 4
    }
  },
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
