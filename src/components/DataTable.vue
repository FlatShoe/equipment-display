<!--
  @Description 表格
-->
<template>
  <div class="data-table page">
    <slot name="toolbar" v-if="showToolbar"></slot>
    <el-table
      ref="tableRef"
      class="table-content"
      v-if="tableComponent"
      :data="data"
      :highlight-current-row="highlightCurrentRow"
      :height="height"
      :stripe="stripe"
      :border="border"
      :show-summary="showSummary"
      :header-cell-style="HeaderCellStyle"
      :summary-method="summaryMethod"
      :default-sort="sortrules"
      :row-key="rowKey"
      :expand-row-keys="expandRowKeys"
      @row-click="handleRowClick"
      @expand-change="expandChange"
      @selection-change="$emit('selectionChange', $event)"
    >
      <template v-for="(column, index) in columns">
        <el-table-column
          v-if="column.name && column.name.startsWith('__slot:')"
          :key="column.key ? column.key + index : index"
          :type="column.type"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :prop="column.name"
          :label="column.label"
          :width="column.width"
          :align="column.align || columnAlign"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <slot :row="scope.row" :name="column.name.replace('__slot:', '')"></slot>
          </template>
        </el-table-column>
        <template v-else-if="column.type === 'expand'">
          <el-table-column :key="column.key ? column.key + index : index" type="expand">
            <template slot-scope="scope">
              <slot :row="scope.row" name="expand"></slot>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :key="column.key ? column.key + index : index"
            :type="column.type"
            :fixed="column.fixed"
            :prop="column.name"
            :label="column.label"
            :width="column.width"
            :align="column.align || columnAlign"
            :sortable="column.sortable"
            show-overflow-tooltip
            :formatter="
              column.type === 'date' ||
              column.type === 'dateTime' ||
              column.type === 'datetime' ||
              column.type === 'dateTimeAll'
                ? strftime
                : null
            "
          >
          </el-table-column>
        </template>
      </template>
      <template slot="empty">
        <empty></empty>
      </template>
    </el-table>
    <slot v-else></slot>
    <div class="bottom-bar" v-if="showBottomBar">
      <div class="bottom-bar-left">
        <slot name="bottom-left-bar"></slot>
      </div>
      <div class="bottom-bar-right">
        <pagination
          :paginationBackground="paginationBackground"
          :layout="layout"
          :pageSizes="pageSizes"
          :total="total"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @page-size-change="$emit('page-size-change', $event)"
          @page-change="$emit('page-change', $event)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import Pagination from './Pagination'
import Empty from '@/components/Empty.vue'
export default {
  name: 'DataTable',
  props: {
    tableComponent: {
      type: Boolean,
      default: true
    },
    // 排序规则结合列里面的sortable
    sortrules: {
      type: Object,
      default: () => {}
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    HeaderCellStyle: {
      type: Object,
      default: () => {
        background: '#FFFFFF'
      }
    },
    height: {
      type: Number,
      default: 200
    },
    columnAlign: {
      type: String,
      default: 'center'
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryMethod: {
      type: Function || null,
      default: null
    },
    showBottomBar: {
      type: Boolean,
      default: false
    },
    paginationBackground: {
      type: Boolean,
      default: true
    },
    // 当可以展开时，是否开启手风琴模式
    accordion: {
      type: Boolean,
      default: true
    },
    // 当前行唯一标识
    rowKey: {
      type: String,
      default: 'id'
    },
    layout: {
      type: String,
      default: 'sizes, prev, pager, next, total'
    },
    pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100, 200]
      }
    },
    pageSize: {
      type: Number,
      default: 20
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    rowClick: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Pagination,
    Empty
  },
  data() {
    return {
      expandRowKeys: []
    }
  },
  methods: {
    doLayout() {
      this.$nextTick(() => {
        this.$refs.tableRef.doLayout()
      })
    },
    strftime(row, column, cellValue, index) {
      if (!cellValue) return ''
      const dateTypes = {
        date: 'YYYY-MM-DD',
        dateTime: 'YYYY-MM-DD HH:mm',
        dateTimeAll: 'YYYY-MM-DD HH:mm:ss'
      }
      if (!dateTypes[column.type]) return cellValue
      return dayjs(cellValue).format(dateTypes[column.type])
    },
    handleRowClick(row) {
      if (this.rowClick) {
        this.$emit('row-click', row)
      }
    },
    expandChange(row, expandedRows) {
      // 是否开启了手风琴模式
      if (this.accordion) {
        if (expandedRows.length) {
          if (row) {
            this.expandRowKeys = [row[this.rowKey]]
          } else {
            this.expandRowKeys = []
          }
        } else {
          this.expandRowKeys = expandedRows.map(item => item[this.rowKey])
        }
        this.$emit('expandChange', {row, expandedRows: [row]})
      } else {
        this.$emit('expandChange', {row, expandedRows})
      }
    },
    clearSelection() {
      this.$refs.tableRef.clearSelection()
    }
  },
  watch: {
    columns() {
      this.doLayout()
    },
    border() {
      this.doLayout()
    },
    showSummary() {
      this.doLayout()
    }
  }
}
</script>
<style lang="scss" scoped>
.data-table {
  .table-content {
    flex: 1;
    box-sizing: border-box;
  }
  .bottom-bar {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 5px 10px;
  }
}
</style>