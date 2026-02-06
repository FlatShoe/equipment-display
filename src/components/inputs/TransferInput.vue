<!-- 
* @Description 穿梭框
* @Date 2022-05-29
-->
<template>
  <el-form-item class="transfer-input" :label="label" :prop="name" :required="required">
    <el-transfer
      :titles="titles"
      :filterable="filterable"
      :data="options"
      v-model="selectedItems"
      :props="props"
      @change="$emit('input', $event)"
    >
    </el-transfer>
  </el-form-item>
</template>

<script>
import inputMixin from '@/mixins/input-mixin'
import _ from 'lodash'
export default {
  name: 'TransferInput',
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
    propsOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    titles: {
      type: Array,
      default() {
        return ['数据源', '已选列表']
      }
    }
  },
  data() {
    return {
      options: [],
      selectedItems: [],
      props: {
        label: 'name',
        key: 'id',
        disabled: 'disabled'
      }
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
      }
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
