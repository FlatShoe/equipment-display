<!-- 
* @Description 页面检索
* @Date
-->
<template>
  <div class="page-search" :class="{'search-input-show': isShow}" @click.stop="handleClick">
    <img src="@/assets/images/search.png" />
    {{ keyword }}
    <el-select
      class="page-search-select"
      ref="selectRef"
      placeholder="页面检索"
      filterable
      default-first-option
      remote
      v-model="keyword"
      :remote-method="remoteSearch"
      @change="change"
    >
      <el-option
        v-for="option in options"
        :key="option.item.path"
        :label="option.item.title.join(' > ')"
        :value="option.item.path"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import routeMenus from '@/modules/routeMenus'
import Fuse from 'fuse.js'
export default {
  name: 'PageSearch',
  computed: {
    dataSource() {
      return routeMenus.generateRoutes(this.$router.options.routes)
    }
  },
  data() {
    return {
      instance: null,
      isShow: false,
      keyword: '',
      options: []
    }
  },
  methods: {
    /**
     * @Description 初始化
     */
    init() {
      this.instance = new Fuse(this.dataSource, {
        shouldSort: true,
        minMatchCharLength: 1,
        keys: [
          {name: 'title', weight: 0.7},
          {name: 'path', weight: 0.3}
        ]
      })
    },
    /**
     * @Description 点击显示隐藏搜索框
     */
    handleClick() {
      this.isShow = !this.isShow
    },
    /**
     * @Description 选中搜索项
     */
    change(route) {
      this.$router.push(route).catch(err => err)
      this.handleClose()
    },
    /**
     * @Description 内容检索
     */
    remoteSearch(value) {
      if (value == '') return (this.options = [])
      this.options = this.instance.search(value)
    },
    /**
     * @Description 关闭
     */
    handleClose() {
      this.$refs.selectRef.blur()
      this.isShow = false
      this.keyword = ''
      this.options = []
    }
  },
  watch: {
    isShow(value) {
      if (!value) return document.body.removeEventListener('click', this.handleClose)
      this.$refs.selectRef.focus()
      document.body.addEventListener('click', this.handleClose)
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss">
.page-search {
  .el-input__inner {
    border-radius: 0;
    border: 0;
    padding-left: 0;
    padding-right: 0 !important;
    box-shadow: none !important;
    border-bottom: 1px solid #d9d9d9;
    vertical-align: middle;
    background-color: transparent;
  }
}
</style>
<style lang="scss" scoped>
@import '~@/assets/style/variables.scss';
.page-search {
  cursor: pointer;
  img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
  .page-search-select {
    font-size: 18px;
    transition: width $sidebarDurtion;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;
  }
  &.search-input-show {
    .page-search-select {
      width: 180px;
    }
  }
}
</style>
