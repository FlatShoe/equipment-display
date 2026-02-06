import _ from 'lodash'
export default {
  token: state => state.system.token,
  hasUserInfo: state => !_.isEmpty(state.system.userInfo),
  collapse: state => state.app.sidebarStatus,
  historyTags: state => state.app.historyTags,
  hasWebApiUrls: state => !_.isEmpty(state.system.webApiUrls)
}