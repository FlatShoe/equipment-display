// 获取网络资源名字
export const getResourceName = url => {
  const REG = /^.*[\\\/]/
  return decodeURIComponent(url.replace(REG, ''))
}
// 获取文件后缀
export const getFIleSuffix = fileName => {
  return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
}
