<!-- 
* @Description 头部区域
* @Date 2022-05-27
-->
<template>
  <header class="header-container">
    <div class="header-container-top">
      <div class="header-start">
        <div class="munu-control">
          <hamburger />
        </div>
      </div>
      <div class="header-center">
        <!-- <div class="history-tags-control">
        <history-tags />
      </div> -->
      </div>
      <div class="header-end">
        <div class="page-search-control control-parts">
          <page-search></page-search>
        </div>
        <div class="screen-full-control control-parts">
          <screen-full></screen-full>
        </div>
        <div class="user-control">
          <el-dropdown class="dropdown-wrapper" trigger="click" @command="handleCommand">
            <div class="dropdown-avatar">
              <el-avatar
                class="avatar-wrapper"
                shape="square"
                src="https://img2.baidu.com/it/u=420156118,3874648934&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800"
              ></el-avatar>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="herder-container-bottom">
      <history-tags />
    </div>
  </header>
</template>

<script>
import {mapMutations} from 'vuex'
import Hamburger from './Hamburger.vue'
import HistoryTags from './HistoryTags.vue'
import PageSearch from './PageSearch.vue'
import ScreenFull from './ScreenFull.vue'
export default {
  name: 'Header',
  components: {
    Hamburger,
    HistoryTags,
    PageSearch,
    ScreenFull
  },
  methods: {
    ...mapMutations('system', ['logout']),
    /**
     * @Description 操作指令
     */
    handleCommand(command) {
      if (command === 'logout') {
        this.logout()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .header-container-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
    box-sizing: border-box;
    padding: 0 10px;
    border-bottom: 1px solid rgb(241, 241, 241);
    .header-start,
    .header-center,
    .header-end {
      display: flex;
      align-items: center;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .header-center {
      flex: 1;
      margin: 0 10px;
      .history-tags-control {
        overflow: hidden;
      }
    }

    .header-end {
      .control-parts {
        margin-right: 10px;
      }
      .user-control {
        user-select: none;
        height: fit-content;
        .dropdown-avatar {
          cursor: pointer;
          .avatar-wrapper {
            img {
              width: 50px;
              height: 50px;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
}
</style>
