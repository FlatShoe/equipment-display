// 随机数
export const getRandom = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 随机日期
export const consoleRandomDate = () => {
  const maxdaterandom = new Date().getTime()
  const mindaterandom = new Date(1970, 0, 1, 8).getTime()
  const randomdate = getRandom(mindaterandom, maxdaterandom)
  return randomdate
}