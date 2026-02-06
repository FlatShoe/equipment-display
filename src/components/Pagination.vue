<!-- 
* @Description 分页组件
* @Date 2022-05-16
-->
<template>
  <div
    class="pagination-wrapper"
    :style="{padding: padding}"
  >
    <el-pagination
      :background="paginationBackground"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    paginationBackground: {
      type: Boolean,
      default: true
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
    padding: {
      type: String,
      default: '10px 5px'
    }
  },
  methods: {
    sizeChange(size) {
      this.$emit('page-size-change', size)
    },
    currentChange(current) {
      this.$emit('page-change', current)
    },
  }
}
</script>
<style lang="scss" scoped>
  .pagination-wrapper {
    box-sizing: border-box;
  }
</style>
