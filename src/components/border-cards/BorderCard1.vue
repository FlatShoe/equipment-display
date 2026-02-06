<!-- 
* @Description border-card-1
* @Date
-->
<template>
  <div class="border-card-1 page">
    <div class="header header-nr">
      <slot name="header"></slot>
    </div>
    <div class="split-line"></div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BorderCard1'
}
</script>

<style lang="scss" scoped>
  .border-card-1 {
    background: url('@/assets/images/border-card.png') no-repeat;
    background-color: rgba(17, 22, 75, .5);
    background-size: 100% 100%;
    overflow: hidden;
    .header {
      color: #fff;
      font-size: 18px;
      font-family: YouSheBiaoTiHei;
    }
    .header-nr {
      padding: 10px;
      height: 40px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .split-line {
      width: 100%;
      background: url('@/assets/images/border-card-split-line.png') no-repeat;
      background-size: 100% 100%;
      height: 4px;
    }
    .content {
      flex: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
</style>
