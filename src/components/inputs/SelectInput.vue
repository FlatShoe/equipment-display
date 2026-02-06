<!-- 
* @Description 下拉选择框
* @Date 2022-05-23
-->
<template>
  <el-form-item class="select-input" :label="label" :prop="name" :required="required">
    <el-select
      clearable
      :filterable="filterable"
      :multiple="multiple"
      :disabled="disabled"
      :placeholder="placeholder?placeholder:`请选择${label}`"
      :readonly="readonly"
      v-model="selected"
      :value-key="valueKey"
      @change="$emit('input', $event)"
    >
      <el-option
        v-for="(item, index) in options"
        :key="props ? item[props.value] : index"
        :label="props ? item[props.label] : item"
        :value="props ? item[props.value] : item"
        :disabled="item.disabled"
      >
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import inputMixin from '@/mixins/input-mixin'
import _ from 'lodash'
export default {
  name: 'SelectInput',
  mixins: [inputMixin],
  props: {
    collection: {
      type: Array,
      default() {
        return []
      }
    },
    collectionName: {
      type: String,
      default: ''
    },
    filterable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    valueKey: {
      type: String,
      default: ''
    },
    propsOptions: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      options: [],
      selected: null,
      props: {
        value: 'id',
        label: 'name'
      }
    }
  },
  watch: {
    propsOptions: {
      handler(value) {
        if (value === null) return (this.props = value)
        this.props = {
          ...this.props,
          ..._.cloneDeep(value)
        }
      },
      immediate: true
    },
    value: {
      handler(value) {
        if (typeof value === 'undefined') return (this.selected = null)
        this.selected = _.cloneDeep(value)
      },
      immediate: true
    },
    collection: {
      handler(value) {
        if (this.collectionName) return
        this.options = value
      },
      immediate: true,
      deep: true
    },
    collectionName: {
      handler(value) {
        if (!value) return
        const [model, key] = value.split('/')
        try {
          if (key) {
            this.options = this.$store.state[model][key]
          } else {
            this.options = this.$store.state[model]
          }
        } catch (err) {
          this.options = []
        }
      },
      immediate: true,
    }
  }
}
</script>
