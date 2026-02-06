import axios from 'axios'
import store from '@/store'
import {getApiBaseUrls, getServerType} from '@/modules/utils'
import {MessageBox} from 'element-ui'

export class Request {
  constructor(timeout = 10000) {
    this.timeout = timeout
    this.instance = null
    this.pendingMap = new Map()
  }
  create() {
    this.instance = axios.create({
      timeout: this.timeout
    })
    this._interceptorsRequest()
    this._interceptorsResponse()
    return this.instance
  }
  static getPendingKey(config) {
    const {url, method, params} = config
    let {data} = config
    if (typeof data === 'string') data = JSON.parse(data)
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
  }
  static async getApiUrls() {
    if (!store.getters.hasWebApiUrls) {
      const {
        data: {data}
      } = await axios.get(getApiBaseUrls(), {params: {serverType: getServerType()}}).catch(err => {
        MessageBox.alert('获取ApiUrls失败', '错误提示', {
          showClose: false
        })
      })
      store.commit('system/setWebApiUrls', data)
    }
  }
  _addPending(config) {
    const pendingKey = Request.getPendingKey(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken(cancel => {
        if (!this.pendingMap.has(pendingKey)) {
          this.pendingMap.set(pendingKey, cancel)
        }
      })
  }
  _removePending(config) {
    const pendingKey = Request.getPendingKey(config)
    if (this.pendingMap.has(pendingKey)) {
      const cancelToken = this.pendingMap.get(pendingKey)
      cancelToken(pendingKey)
      this.pendingMap.delete(pendingKey)
    }
  }
  _interceptorsRequest() {
    this.instance.interceptors.request.use(async request => {
      await Request.getApiUrls()
      request.baseURL = 'http://192.168.50.131:31000'
      this._removePending(request)
      this._addPending(request)
      const token = store.getters.token
      if (token) {
        request.headers['Authorization'] || (request.headers['Authorization'] = `${token}`)
      }
      return request
    })
  }
  _interceptorsResponse() {
    this.instance.interceptors.response.use(
      async response => {
        this._removePending(response.config)
        if (response.data.success !== false) {
          if (response.data.data !== null && response.data.data !== undefined) {
            return response.data.data
          } else {
            return response.data
          }
        } else {
          MessageBox.alert(response.data.message, '错误提示', {
            showClose: false
          })
          return response.data
        }
      },
      async error => {
        error.config && this._removePending(error.config)

        if (axios.isCancel(error)) {
          const url = error.message.split('&')[0]
          console.warn(
            `基于相同接口相同参数，未响应时，拦截到意外的重复请求。 已取消对 ${this.baseURL}/${url} 的重复请求`
          )
          return
        }
        if (error.response && error.response.status === 401) {
          await MessageBox.alert('登录状态已过期，请重新登录', '错误提示', {
            showClose: false
          })
          store.commit('system/logout')
        } else if (error.response && error.response.status === 404) {
          await MessageBox.alert('请求资源不存在', '错误提示', {
            showClose: false
          })
        } else if (error.response && error.response.data && error.response.data.message) {
          await MessageBox.alert(error.response.data.message.slice(0, 100), '错误提示', {
            showClose: false
          })
        } else {
          await MessageBox.alert(
            `您的网络走丢了，请稍后再试。${
              error.response ? '错误码：' + error.response.status : ''
            }`,
            '错误提示',
            {showClose: false}
          )
        }
      }
    )
  }
}

const request = new Request()
export default request.create()
