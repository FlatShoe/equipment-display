<!-- 
* @Description 日期时间选择器
* @Date 2022-05-23
-->
<template>
  <el-form-item class="date-time" :label="label" :prop="name" >
    <el-date-picker
      type="datetime"
      :editable="false"
      :placeholder="placeholder?placeholder:`请选择${label}`"
      :disabled="disabled"
      :readonly="readonly"
      v-model="selected"
      default-time="23:59:59"
      @change="$emit('input', $event)"
    ></el-date-picker>
  </el-form-item>
</template>

<script>
import inputMixin from '@/mixins/input-mixin'
export default {
  name: 'DateTime',
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
