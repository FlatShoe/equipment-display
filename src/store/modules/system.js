import {login, getUserInfo} from '@/api/auth'
import {sessionStorage} from '@/modules/storage'
import {LOGIN_PATH, TOKEN} from '@/constant'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    webApiUrls: {},
    token: sessionStorage.get(TOKEN) || '',
    userInfo: {}
  },
  mutations: {
    setWebApiUrls(state, webApiUrls) {
      state.webApiUrls = webApiUrls
    },
    setToken(state, token) {
      state.token = token
      sessionStorage.set(TOKEN, token)
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    logout(state) {
      state.token = ''
      state.userInfo = {}
      sessionStorage.removeAllItem()
      router.push(LOGIN_PATH)
    }
  },
  actions: {
    login({commit}, formData) {
      return new Promise((resolve, reject) => {
        // login(formData)
        //   .then(({access_token: accessToken, token_type: tokenType}) => {
        //     if (!tokenType || !accessToken) return reject()
        //     commit('setToken', `${tokenType} ${accessToken}`)
        //     router.push('/')
        //     resolve()
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
        commit('setToken', `${'123'} ${'456'}`)
        router.push('/')
        resolve()
      })
    },
    async getUserInfo({commit}) {
      const result = await getUserInfo()
      commit('setUserInfo', result)
      return result
    }
  }
}
