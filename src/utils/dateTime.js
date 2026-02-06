// 关于日期时间处理
import dayjs from 'dayjs'

/*
 * @Description 获取日期区间
 * @param {Date} startDate 开日日期
 * @param {Number} range 结束范围
 * @return Array
 */
export const getDateInterval = (startDate, range) => {
  const temp = []
  let i = 1
  while (i <= range) {
    temp.push(dayjs(startDate).add(i, 'day').format('YYYY-MM-DD'))
    i++
  }
  return temp
}
