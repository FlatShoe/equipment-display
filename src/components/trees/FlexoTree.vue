<!--
* @Description 多功能树
* @Date
-->
<template>
  <div class="flexo-tree">
    <el-tree
      v-if="data.length"
      class="tree-root"
      ref="treeRef"
      :empty-text="emptyText"
      :default-expand-all="expandAll"
      :show-checkbox="showCheckboxCopy"
      :node-key="nodeKey"
      :data="data"
      :props="defaultProps"
      :check-strictly="checkStrictlyCopy"
      :expand-on-click-node="expandOnClickNode"
      :highlight-current="highlightCurrent"
      :default-checked-keys="defaultCheckedKeys"
      :current-node-key="currentNodeKey"
      :render-content="renderContent"
      :filter-node-method="filterNodeFn"
      @check="check"
    ></el-tree>
    <span class="tree-empty" v-else>{{ emptyText }}</span>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'FlexoTree',
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    // 是否展开全部
    expandAll: {
      type: Boolean,
      default: true
    },
    // 开启选框 （多选模式）
    showCheckbox: {
      type: Boolean,
      default: false
    },
    // 开启选框 （单选模式）
    showRadiobox: {
      type: Boolean,
      default: false
    },
    // 点击节点可以进行折叠
    expandOnClickNode: {
      type: Boolean,
      default: false
    },
    // 节点标识字段
    nodeKey: {
      type: String,
      default: 'id'
    },
    // 默认数据对应字段
    defaultProps: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'name'
        }
      }
    },
    // 多选框模式下是否父子关联
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 默认勾选的数组
    defaultCheckedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    currentNodeKey: {
      type: String | Number,
      default: ''
    },
    // 高亮显示当前项
    highlightCurrent: {
      type: Boolean,
      default: true
    },
    // 函数模版
    render: {
      type: Function,
      default(h, {node, data}) {
        return (
          <div class="custom-tree-node" on-click={this.nodeClick.bind(this, {node, data})}>
            <span>{data[this.defaultProps.label]}</span>
          </div>
        )
      }
    },
    // 过滤函数
    filterNode: {
      type: Function,
      default(value, data) {
        if (!value) return true
        return data[this.defaultProps.label].indexOf(value) !== -1
      }
    }
  },
  data() {
    return {
      // 判断后是否显示多选框
      showCheckboxCopy: false,
      // 复选模式下是否父子关联开启，单选模式下是处于关闭状态
      checkStrictlyCopy: false,
      data: [],
      currentId: ''
    }
  },
  methods: {
    _cloneTree() {
      const data = _.cloneDeep(this.treeData)
      this.data = data
    },
    /*
     * @Description 选择节点
     */
    check(data) {
      // 是否开启单选
      const isRadio = this.showRadiobox
      const currentId = this.currentId
      const {id} = data
      // 单选情况下选择同一个，清空相应数据
      if (isRadio && id === currentId) {
        this.$refs.treeRef.setCheckedKeys([])
        this.$refs.treeRef.setCheckedNodes([])
        this.currentId = ''
      }
      // 单选情况下选择非同一个，保存相应数据
      if (isRadio && id !== currentId) {
        this.$refs.treeRef.setCheckedKeys([])
        this.$refs.treeRef.setCheckedKeys([id])
        this.$refs.treeRef.setCheckedNodes([data])
        this.currentId = id
      }

      const checkedNodes = this.$refs.treeRef.getCheckedNodes()
      this.$emit('check', checkedNodes)
    },
    /*
     * @Description 点击当前节点
     * @param {Object} node 当前节点相关信息 data 当前节点相关数据 type 操作类型
     */
    nodeClick({node, data}) {
      this.$emit('node-click', {node, data})
    },
    /*
    * @Description 设置目前勾选的节点 提供外部使用
    */
    setCheckedNodes(nodes) {
      this.$refs.treeRef.setCheckedNodes(nodes)
    },
    /*
    * @Description 通过 keys 设置目前勾选的节点 提供外部使用
    */
    setCheckedKeys(keys) {
      this.$refs.treeRef.setCheckedKeys(keys)
    },
    /*
     * @Description 获取已被选择的节点 提供外部使用
     */
    getCheckedKeys() {
      return this.$refs.treeRef.getCheckedKeys()
    },
    /*
    * @Description 清空已选
    */
    clear() {
      const dataCopy = JSON.parse(JSON.stringify(this.data))
      this.data = []
      this.data = dataCopy
      this.currentId = null
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys([])
        this.$refs.treeRef.setCheckedNodes([])
      })
    },
    /**
     * 通过render函数渲染内容
     */
    renderContent(h, {node, data, store}) {
      return this.render.call(this, h, {
        node,
        data,
        store
      })
    },
    /*
     * @Description 给过滤函数绑定this
     */
    filterNodeFn(value, data) {
      return this.filterNode.call(this, value, data)
    },
    getRef() {
      return this.$refs.treeRef
    },
    /*
     * @Descriptoin 调用该方法进行过滤，提供外部使用
     */
    filter(value) {
      this.$refs.treeRef.filter(value)
    }
  },
  watch: {
    showCheckbox: {
      handler(value) {
        // 如果多选和单选都开启，则什么不显示选框
        if (value && this.showRadiobox) return (this.showCheckboxCopy = false)
        // 不管是单选开始多选，显示选框
        if (value || this.showRadiobox) this.showCheckboxCopy = true
      },
      immediate: true
    },
    checkStrictly: {
      handler(value) {
        // 在单选情况下 父子关联永远是开启状态
        if (this.showRadiobox) return (this.checkStrictlyCopy = true)
        this.checkStrictlyCopy = value
      },
      immediate: true
    },
    treeData: {
      handler() {
        this._cloneTree()
      },
      immediate: true
    }
  }
}
</script>

<!-- scoped -->
<style lang="scss">
.flexo-tree {
  .el-tree-node__content {
    padding: 3px;
    width: 100%;
    box-sizing: border-box;
  }
  .el-tree-node > .el-tree-node__children {
    overflow: inherit;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>

<style scoped lang="scss">
.flexo-tree {
  position: relative;
  min-height: 100%;
  box-sizing: border-box;
  .el-tree {
    display: inline-block;
    width: 100%;
    background-color: transparent;
  }
  .tree-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    color: #606266;
  }
}
</style>
