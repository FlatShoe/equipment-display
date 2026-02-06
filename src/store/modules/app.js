import {HISTORY_TAGS} from '@/constant'
import {sessionStorage} from '@/modules/storage'
import router from '@/router'
export default {
  namespaced: true,
  state: {
    sidebarStatus: true,
    historyTags: sessionStorage.get(HISTORY_TAGS) || []
  },
  mutations: {
    setSidebarStatus(state, status) {
      state.sidebarStatus = status
    },
    setHistoryTags(state, tag) {
      const isHas = state.historyTags.find(item => tag.path === item.path)
      if (!isHas) {
        state.historyTags.push(tag)
        sessionStorage.set(HISTORY_TAGS, state.historyTags)
      }
    },
    removeTags(state, payload) {
      const {type, index, to} = payload
      if (type === 'current') {
        state.historyTags.splice(index, 1)
      } else if (type === 'other') {
        state.historyTags.splice(index + 1, state.historyTags.length - index + 1)
        state.historyTags.splice(0, index)
      } else if (type === 'left') {
        state.historyTags.splice(0, index)
      } else if (type === 'right') {
        state.historyTags.splice(index + 1, state.historyTags.length - index + 1)
      }
      sessionStorage.set(HISTORY_TAGS, state.historyTags)
      if (!to) return
      router.push(to)
    }
  }
}
