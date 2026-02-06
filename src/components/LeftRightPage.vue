<!-- 
* @Description 左右栏布局
-->
<template>
  <div class="left-right-page-wrapper">
    <div class="left-right-page-card">
      <div
        v-if="showHeader"
        class="page-header"
        :style="{padding: headerPadding}"
      >
        <slot name="header"></slot>
      </div>
      <div class="page-inner">
        <div
          v-if="leftPageShow"
          class="page-inner-left"
          :style="{
            width: rightFixed ? `calc(100% - ${rightWidth} - ${useSplitBlock ? splitBlockWidth : splitLineWidth})` : leftWidth,
            padding: leftPadding
          }"
        >
          <slot name="left-page"></slot>
        </div>
        <div
          class="page-inner-split"
          :style="{
            width: useSplitBlock ? splitBlockWidth : splitLineWidth,
            backgroundColor: splitColor
          }"
        ></div>
        <div
          class="page-inner-right"
          :style="{
            width: rightFixed ? rightWidth : leftPageShow ? `calc(100% - ${leftWidth} - ${useSplitBlock ? splitBlockWidth : splitLineWidth})` : '100%',
            padding: rightPadding
          }"
        >
          <div class="right-page-inner">
            <slot name="right-page"></slot>
          </div>
          <div class="right-page-footer" v-if="showRightPageFooter">
            <pagination
              :padding="paginationPadding"
              :paginationBackground="paginationBackground"
              :layout="layout"
              :page-sizes="pageSizes"
              :total="total"
              :page-size="pageSize"
              :current-page="currentPage"
              @page-size-change="$emit('page-size-change', $event)"
              @page-change="$emit('page-change', $event)"
            />
          </div>
        </div>
      </div>
      <div
        v-if="showFooter"
        class="page-footer"
        :style="{padding: footerPadding}"
      >
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LeftRightPage',
  props: {
    showHeader: {
      type: Boolean,
      default: false
    },
    headerPadding: {
      type: String,
      default: '10px'
    },
    leftPageShow: {
      type: Boolean,
      default: true
    },
    leftWidth: {
      type: String,
      default: '30%'
    },
    leftPadding: {
      type: String,
      default: '8px'
    },
    rightWidth: {
      type: String,
      default: '50%'
    },
    rightPadding: {
      type: String,
      default: '8px'
    },
    rightFixed: {
      type: Boolean,
      default: false
    },
    useSplitBlock: {
      type: Boolean,
      default: false
    },
    splitColor: {
      type: String,
      default: 'transparent'
    },
    splitLineWidth: {
      type: String,
      default: '1px'
    },
    splitBlockWidth: {
      type: String,
      default: '18px'
    },
    showRightPageFooter: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    footerPadding: {
      type: String,
      default: '10px'
    },
    paginationPadding: {
      type: String,
      default: '10px 0 0 0'
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .left-right-page-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .left-right-page-card {
      display: flex;
      flex-direction: column;
      width: 100%;
      .page-inner {
        flex: 1;
        display: flex;
        width: 100%;
        overflow: hidden;
        .page-inner-left,
        .page-inner-right {
          height: 100%;
          box-sizing: border-box;
          background-color: #fff;
          overflow: hidden;
        }
        .page-inner-split {
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .page-inner-right {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          //start
          .ts-type-lr-01 {
            padding: 0px!important; 
          }
          .right-page-inner {
            flex: 1;
            overflow: hidden;
          }
          .right-page-footer {
            display: flex;
            justify-content: flex-end;
          }
        }
      }
    }
  }
</style>
