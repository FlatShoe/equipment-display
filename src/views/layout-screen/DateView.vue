<!-- 
* @Description 时间查看
* @Date
-->
<template>
  <div class="date-view date-view-rn">
    <div class="week" style="padding-left: 32px">{{ week[day] }}</div>
    <div class="date" style="padding-left: 45px">
      {{ date | dateFormat('YYYY-MM-DD HH:mm:ss') }}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
const week = ['Sun', 'Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat']
export default {
  name: 'DateView',
  data() {
    return {
      timer: null,
      week,
      day: 0,
      date: Date.now()
    }
  },
  methods: {
    getDate() {
      this.day = dayjs().day()
      this.timer = setInterval(() => {
        this.date = Date.now()
        this.day = dayjs().day()
      }, 1000)
    }
  },
  mounted() {
    this.getDate()
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.date-view {
  display: flex;
  font-family: LiquidCrystal-Light;
  font-weight: 700;
  color: #f9d784;
  user-select: none;
  .week,
  .date {
    font-family: inherit;
  }
  &.date-view-rn {
    letter-spacing: 2px;
    font-size: 18px;
    padding-left: 30px;
  }
}
</style>
