<!--
* @Description 简洁表单
-->
<template>
  <el-form
    class="concision-form"
    ref="formRef"
    :label-suffix="labelSuffix"
    :label-width="labelWidth"
    :size="size"
    :model="formData"
    :rules="fRules"
    :label-position="labelPosition"
    :inline="inline"
    :disabled="disabled"
  >
    <template v-for="(item, index) in formSchema">
      <el-row :key="index" v-if="item.fieldset && item.inputs.length && !item.slot">
        <el-col
          v-for="(input, inputIndex) in item.inputs"
          :key="input.name"
          :span="
            input.span
              ? input.span
              : inputIndex === item.inputs.length - 1 && inputIndex % 2 === 0
              ? 24
              : 12
          "
        >
          <el-form-item v-if="input.slot" :label="input.label" :key="input.name" :prop="input.name">
            <slot :name="input.name" :row="{key: input.name}"></slot>
          </el-form-item>
          <!-- 自由插槽 -->
          <template v-else-if="input.haveSlot">
            <slot :name="input.name" :row="{key: input.name}"></slot>
          </template>
          <component
            v-else
            :is="`${input.inputType}-input`"
            :value="formData[input.name]"
            v-bind="input"
            :ref="input.name"
            @input="handleInput(input.name, $event,input)"
          >
          </component>
        </el-col>
      </el-row>
      <el-form-item v-else-if="item.slot" :label="item.label" :key="item.name" :prop="item.name">
        <slot :name="item.name" :row="{key: item.name}"></slot>
      </el-form-item>
      <!-- 自由插槽 -->
      <template v-else-if="item.haveSlot">
        <slot :name="item.name" :row="{key: item.name}"></slot>
      </template>
      <template v-else>
        <components
          v-bind="item"
          v-if='!item.formHidden'
          :key="item.name"
          :is="`${item.inputType}-input`"
          :value="formData[item.name]"
          @input="handleInput(item.name, $event,item)"
        ></components>
      </template>
    </template>
  </el-form>
</template>

<script>
import _ from 'lodash'
import dayjs from 'dayjs'
export default {
  name: 'CForm',
  props: {
    formSchema: {
      type: Array,
      default() {
        return []
      }
    },
    isSearchRules: {
      type: Boolean,
      default: false
    },
    formRules: {
      type: Object,
      default() {
        return {}
      }
    },
    inline: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelSuffix: {
      type: String,
      default: '：'
    },
    size: {
      type: String,
      default: 'medium'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {},
      fRules:this.formRules
    }
  },
  methods: {
    handleInput(name, value, item) {
      this.formData[name] = value
      if (item.callback){
        item.callback(value)
      }
    },
    formatDate(fields, type = 'YYYY-MM-DD HH:mm:ss') {
      const temp = _.cloneDeep(this.formData)
      fields.forEach(field => {
        if (temp[field]) {
          temp[field] = dayjs(this.formData[field]).format(type)
        }
      })
      this.formData = temp
    },
    validate() {
      this.$refs.formRef.validate()
    },
    validateField(props) {
      this.$refs.formRef.validateField(props)
    },
    async submitForm() {
      try {
        const valid = await this.$refs.formRef.validate()
        if (valid) {
          this.$emit('submit', this.formData)
        }
      } catch (err) {}
    },
    syncFormData() {
      _.flatMap(this.formSchema, item => {
        if (item.fieldset && item.inputs.length) {
          return item.inputs
        } else {
          return [item]
        }
      }).forEach(input => {
        this.$set(this.formData, input.name, input.value)
      })
    },
    changeFormData(data) {
      this.formData = data
    },
    clearValidate() {
      this.$refs.formRef.resetFields()
    },
    syncRules(){
      if (this.isSearchRules){ // 如果为搜索框清空校验
        this.fRules = {}
      } else {
        const obj = {}
        this.formSchema.forEach(item => { // 整合校验规则
          if (item.rules) {
            obj[item.name] = item.rules
          }
        })
        this.fRules = obj
      }
    },
    resetForm() {
      this.$refs.formRef.resetFields()
      // for (const key in this.formData) {
      //   this.formData[key] = null
      // }
    }
  },
  watch: {
    formSchema: {
      handler() {
        this.syncFormData()
        this.syncRules()
      },
      immediate: true
    }
  },
  created() {
    this.syncFormData()
  }
}
</script>
