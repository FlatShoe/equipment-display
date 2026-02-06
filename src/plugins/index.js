import Vue from 'vue'
import elementPluginFn from './element'
import './echarts'
import Vuebar from 'vuebar'

Vue.use(Vuebar)
elementPluginFn(Vue)