<!-- 
* @Description 日期选择器
* @Date 2022-05-23
-->
<template>
  <el-form-item class="date-input" :label="label" :prop="name" :required="required">
    <el-date-picker
      type="date"
      :editable="false"
      :placeholder="placeholder?placeholder:`请选择${label}`"
      :disabled="disabled"
      :readonly="readonly"
      v-model="selected"
      @change="$emit('input', $event)"
    ></el-date-picker>
  </el-form-item>
</template>

<script>
import inputMixin from '@/mixins/input-mixin'
export default {
  name: 'DateInput',
  mixins: [inputMixin],
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
