<!--
  @Description 空数据展示
-->
<template>
  <div class="empty">
    <div class="empty-content">
      <div
        :style="{'width': width + 'px', 'height': height + 'px'}" 
        class="empty-content-img">
        <img src="@/assets/images/empty.png" />
      </div>
      <p 
        class="empty-content-tip"
        :style="{'fontSize': tipFontSize + 'px'}">{{tip}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    width: {
      type: Number,
      default: 240
    },
    height: {
      type: Number,
      default: 200
    },
    tip: {
      type: String,
      default: '暂无数据'
    },
    tipFontSize: {
      type: Number,
      default: 18
    }
  }
}
</script>

<style lang="scss" scoped>
  .empty {
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .empty-content {
      .empty-content-img {
        img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
        }
        margin-bottom: 20px;
      }
      .empty-content-tip {
        color: #304053;
        text-align: center;
        font-weight: 700;
        cursor: default;
        font-size: 16px;
      }
    }
  }
</style>