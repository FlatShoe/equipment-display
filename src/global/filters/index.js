/**
 * @Description 全局过滤器
 */
import Vue from 'vue'
import dayjs from 'dayjs'

const filters = {
  // 保留位数
  toFixed(value, digit = 1) {
    return Number(value).toFixed(digit)
  },
  // 日期格式化
  dateFormat(value, type = 'YYYY-MM-DD HH:mm') {
    return dayjs(value).format(type)
  }
}

Object.keys(filters).forEach(key => {
  const value = filters[key]
  Vue.filter(key, value)
})
