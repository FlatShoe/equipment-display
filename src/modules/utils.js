import {isExternal} from '@/utils/validate'
import store from '@/store'
// 获取阿里云地址
export const getApiBaseUrls = () => {
  return `${process.env.WEB_API_URLS}/apiConfig/getApiUrls`
}
// 获取服务类型
export const getServerType = () => {
  return `${process.env.SERVER_TYPE}`
}
// 获取静态资源服务地址
export const getFileUrl = () => {
  return `${store.state.system.webApiUrls.gsFileUrl}`
}
// 获取上传地址
export const getUploadURL = () => {
  return `${store.state.system.webApiUrls.gsCoMainApiUrl}/currency/upload`
}
// 获取文件预览服务地址
export const getFileViewUrl = () => {
  return `${store.state.system.webApiUrls.fileViewUrl}`
}
/*
* @Description 拼接本服服务器地址
*/
export const jointServePrefix = (src) => {
  if (!src) return ''
  if (isExternal(src)) return src
  return `${getFileUrl()}${src}`
}