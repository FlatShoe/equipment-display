<!-- 
* @Description 多选框
* @Date 2022-05-25
-->
<template>
  <el-form-item class="cascader-input" :label="label" :prop="name" :required="required">
    <el-checkbox-group v-model="selectedItems" @change="$emit('input', $event)">
      <template v-for="(item, index) in options">
        <el-checkbox
          v-if="!button"
          :border="border"
          :key="props ? item[props.value] : index"
          :label="props ? item[props.value] : item"
          :disabled="item.disabled"
        >
          {{ props ? item[props.label] : item }}
        </el-checkbox>
        <el-checkbox-button
          v-else
          :key="props ? item[props.value] : index"
          :label="props ? item[props.value] : item"
          :disabled="item.disabled"
        >
          {{ props ? item[props.label] : item }}
        </el-checkbox-button>
      </template>
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
import inputMixin from '@/mixins/input-mixin'
import _ from 'lodash'
export default {
  name: 'CheckboxInput',
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
    },
    border: {
      type: Boolean,
      default: false
    },
    button: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      selectedItems: [],
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
        if (!value) return (this.selectedItems = [])
        this.selectedItems = _.cloneDeep(value)
      },
      immediate: true
    },
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
      }
    }
  }
}
</script>
