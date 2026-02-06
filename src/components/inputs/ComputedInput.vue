<!-- 
* @Description 计数器
* @Date 2022-05-23
-->
<template>
  <el-form-item class="computed-input" :label="label" :prop="name" :required="required">
    <el-input-number
      :controls-position="controlsPosition"
      v-model="numberValue"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @change="$emit('input', $event)"
    >
    </el-input-number>
  </el-form-item>
</template>

<script>
import inputMixin from '@/mixins/input-mixin'
export default {
  name: 'ComputedInput',
  mixins: [inputMixin],
  props: {
    controlsPosition: {
      type: String,
      default: 'right'
    }
  },
  data() {
    return {
      numberValue: 0
    }
  },
  watch: {
    value: {
      handler(value) {
        this.numberValue = value
      },
      immediate: true
    }
  }
}
</script>
