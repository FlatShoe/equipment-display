import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './global'
import './modules/permission'
import './plugins'
import './assets/style/index.scss'
import './utils/rem.js'
import './utils/permission'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
