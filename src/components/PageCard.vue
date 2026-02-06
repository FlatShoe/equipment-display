<!-- 
* @Description 页面视图卡
-->
<template>
  <div
    class="page-card-wrapper"
    :class="{
      'always-shadow': shadow,
      'always-border': border,
      'clear-margin': clearMargin,
      'margin-top': marginTop,
      'margin-bottom': marginBottom
    }"
  >
    <div class="page-card-header" v-if="showHeader">
      <slot name="header" />
    </div>
    <div class="page-card-inner">
      <scroll-view v-if="scrollable">
        <slot />
      </scroll-view>
      <slot v-else />
    </div>
    <div class="page-card-footer" v-if="showFooter">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import ScrollView from './ScrollView'
export default {
  name: 'PageCard',
  props: {
    scrollable: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    marginTop: {
      type: Boolean,
      default: true
    },
    marginBottom: {
      type: Boolean,
      default: true
    },
    clearMargin: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ScrollView
  }
}
</script>

<style lang="scss" scoped>
.page-card-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  background-color: #f8f8f8;
  box-sizing: border-box;
  margin: 0px 10px 0 10px;
  overflow: hidden;
  &.margin-top {
    margin-top: 10px;
  }
  &.margin-bottom {
    margin-bottom: 10px;
  }
  &.clear-margin {
    margin: 0;
    width: 100%;
  }
  &.always-shadow {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
  &.always-border {
    border: 1px solid #f1f1f1;
  }
  .page-card-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .page-card-header,
  .page-card-inner,
  .page-card-footer {
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>
