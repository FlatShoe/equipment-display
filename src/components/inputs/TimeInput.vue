<!-- 
* @Description 时间选择器
* @Date 2022-05-23
-->
<template>
  <el-form-item class="time-input" :label="label" :prop="name" :required="required">
    <el-time-select
      :editable="editable"
      :placeholder="placeholder?placeholder:`请选择${label}`"
      :disabled="disabled"
      :picker-options="{
        start: '00:00',
        step: '00:01',
        end: '23:59'
      }"
      :readonly="readonly"
      v-model="selected"
      @change="$emit('input', $event)"
    >
    </el-time-select>
  </el-form-item>
</template>

<script>
import inputMixin from '@/mixins/input-mixin'
export default {
  name: 'TimeInput',
  mixins: [inputMixin],
  props: {
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selected: this.value
    }
  },
  watch: {
    value(val) {
      this.selected = val
    }
  }
}
</script>
