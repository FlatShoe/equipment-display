import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import system from './modules/system'
import app from './modules/app'
import home from './modules/home'

Vue.use(Vuex)
const store = new Vuex.Store({
  getters,
  modules: {
    system,
    app,
    home
  }
})
export default store


