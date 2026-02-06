<!-- 
* @Description 伸缩按钮
-->
<template>
  <div class="hamburger" @click="change">
    <img :src="require(`@/assets/images/${icon}.png`)" />
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'Hamburger',
  computed: {
    ...mapGetters(['collapse']),
    icon() {
      return !this.collapse ? 'hamburger-open' : 'hamburger-close'
    }
  },
  methods: {
    ...mapMutations('app', ['setSidebarStatus']),
    change() {
      this.setSidebarStatus(!this.collapse)
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger {
  cursor: pointer;
  img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
}
</style>
