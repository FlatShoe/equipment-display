/**
 * 获取URL中的参数值
 * @param {String} key 
 * @returns String
 */
export function getUrlParam(key) {
  const reg = new RegExp('(\\?|&)' + key + '=([^&]*)(&|$)')
  const result = window.location.href.match(reg)
  return result ? decodeURIComponent(result[2]) : null
}