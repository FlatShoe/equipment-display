<!--
  @Description 表格
-->
<template>
  <div class="data-table page">
    <div class='search'>
      <c-form inline :formSchema="searchConfig" :isSearchRules="true"  ref="searchFormRef"  @submit="submitSearch"></c-form>
      <div>
        <slot  name="searchButton"></slot>
      </div>
    </div>
    <el-table
      ref="tableRef"
      class="table-content"
      v-if="tableComponent"
      :data="tableData"
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
      <template v-for="(column, index) in tableColumns">
        <el-table-column
          v-if='!column.tableHidden'
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
          <template slot-scope="scope" >
            <div v-if="column.name && column.name.startsWith('__slot:')">
              <slot :row="scope.row" :name="column.name.replace('__slot:', '')"></slot>
            </div>
            <template slot-scope="scope"  v-else-if="column.type === 'expand'">
              <slot :row="scope.row" name="expand"></slot>
            </template>
            <template slot-scope="scope" v-else-if="column.type && column.type.startsWith('__dict:')">
              <div>{{getLabel(scope.row[column.name], column.type.replace('__dict:',''))}}</div>
            </template>
            <template slot-scope="scope"  v-else-if="column.type === 'date' || column.type === 'dateTime' || column.type === 'dateTimeAll'">
              {{strftime(scope.row,column,scope.row[column.name])}}
            </template>
            <div   v-else>
              {{scope.row[column.name]}}
            </div>
          </template>
        </el-table-column>
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
          @page-size-change="pageSizeChange"
          @page-change="pageChange"
        />
      </div>
    </div>
    <form-dialog
      class="file-view-dialog"
      :width="formDialogWidth"
      :visible="visible"
      title="新增"
      :showButtons="showButtons"
      @close="handleDialogClose"
      @confirm='submit'
    >
      <c-form :formSchema="columns"  ref="formRef"  @submit="submitForm">
        <template :slot="column.name" v-for="(column, index) in columns" >
          <slot v-if='column.slot' :name="column.name" :row="{key: column.name}"></slot>
        </template>
      </c-form>
    </form-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import Pagination from './Pagination'
import Empty from '@/components/Empty.vue'
import {getDictLabel} from '@/utils/dbConfig'
import {dict} from '../utils/dbConfig'
export default {
  name: 'DataTableExpand',
  props: {
    api: {
      type: Object,
      default: () => {}
    },
    formDialogWidth: {
      type: String,
      default: '800px'
    },
    tableComponent: {
      type: Boolean,
      default: true
    },
    // 排序规则结合列里面的sortable
    sortrules: {
      type: Object,
      default: () => {}
    },
    showButtons: {
      type: Boolean,
      default: true
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    specialUpdate: {
      type: Boolean,
      default: false
    },
    specialAdd: {
      type: Boolean,
      default: false
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
        '#FFFFFF'
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
      visible: false,
      searchConfig:[], // 搜索数据
      tableColumns: [], // table列
      tableData: this.data,
      expandRowKeys: [],
      page:{
        pageSize:20,
        currentPage:1
      }
    }
  },
  mounted() {
    console.log(this.tableData)
    this.doSearch()
    if (this.api.query){
      this.getList(this.page)
    }
  },
  methods: {
    pageSizeChange(){
    },
    pageChange(size){
      this.page.currentPage = size
      console.log('搜索参数', this.page)
    },
    getList(searchData){
      this.tableData = []
      this.api.list(searchData).then((res) => {
        this.$nextTick(() => {
          this.tableData.push(res)
        })
      })
    },
    getLabel(value, dictName){
      return getDictLabel(value, dictName)
    },
    handleDialogClose() {
      this.visible = false
    },
    // 搜索方法
    handleSearch() {
      this.$refs.searchFormRef.submitForm()
    },
    // 清除搜索方法
    handleClear() {
      this.$refs.searchFormRef.clearValidate()
    },
    handleAdd(){
      this.visible = true
      this.$nextTick(() => {
        this.$refs.formRef.resetForm()
      })
    },
    handleUpdate(id) {
      this.api.update().then((res) => {
        this.$refs.formRef.changeFormData(res)
      })
      this.visible = true
    },
    handleDel(row) {
      this.$confirm(`正在删除。。。${JSON.stringify(row)}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.api.del().then((res) => {
            console.log(res)
          })
        })
        .catch(err => err)
    },
    submitSearch(searchData){
      this.page = {...this.page, ...searchData}
      console.log('搜索条件', this.page )
      this.getList(this.page)
    },
    submitForm(formData) {
      console.log(formData)
      if (formData.isViewAll){
        if (this.specialAdd){
          this.$emit('handleSpecialUpdate', formData)
        } else {
          this.updateSubmit(formData)
        }

      } else {
        if (this.specialAdd){
          this.$emit('handleSpecialAdd', formData)
        } else {
          this.addSubmit(formData)
        }
      }
    },
    addSubmit(formData){
      this.$message.info('新增')
      this.api.add(formData).then((res) => {
        this.getList()
        this.visible = false
      })
    },
    updateSubmit(formData){
      this.$message.info('更新')
      this.api.update(formData).then((res) => {
        this.getList()
        this.visible = false
      })
    },
    submit() {
      this.$refs.formRef.submitForm()
    },
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
    },
    doSearch() {
      this.searchConfig = this.columns.filter(item => item.search)
    },
    syncColumns() {
      this.tableColumns = []
      this.columns.forEach(item => { // 整合table多列
        if (item.fieldset){
          this.tableColumns = [...this.tableColumns, ...item.inputs,]
        } else {
          this.tableColumns.push(item)
        }
      })
      console.log(this.tableColumns)
    }
  },
  watch: {
    columns: {
      handler(val) {
        this.doLayout()
        this.syncColumns()
      },
      deep: true, // 深度监听
      immediate:true,
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
.search{
  display: flex;
}
</style>
