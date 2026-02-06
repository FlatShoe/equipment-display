<!-- 
* @Description 级联选择器
* @Date 2022-05-23
-->
<template>
  <el-form-item class="cascader-input" :label="label" :prop="name" :required="required">
    <el-cascader
      clearable
      :options="options"
      :props="props"
      :placeholder="placeholder"
      :disabled="disabled"
      v-model="selectedItems"
      @expand-change="handleItemChange"
      @change="handleChange"
    ></el-cascader>
  </el-form-item>
</template>

<script>
import inputMixin from '@/mixins/input-mixin'
import _ from 'lodash'
export default {
  name: 'CascaderInput',
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
    propsOptions: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      props: {
        expandTrigger: 'click',
        multiple: false,
        checkStrictly: false,
        value: 'value',
        label: 'name',
        children: 'children',
        disabled: 'disabled'
      },
      options: [],
      selectedItems: []
    }
  },
  methods: {
    handleItemChange() {
      this.$emit('input', this.selectedItems)
    },
    handleChange(item) {
      this.$emit('input', this.selectedItems)
    }
  },
  watch: {
    collection: {
      handler(value) {
        if (this.collectionName) return
        this.options = value
      },
      immediate: true
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
      immediate: true
    },
    propsOptions: {
      handler(value) {
        this.props = {
          ...this.props,
          ...value
        }
      },
      immediate: true
    },
    value: {
      handler(value) {
        if (!value) return (this.selectedItems = [])
        this.selectedItems = _.cloneDeep(value)
      },
      immediate: true
    }
  }
}
</script>
