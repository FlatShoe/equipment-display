/**
 * @Description 全局指令注册
 */
import _ from 'lodash'
import Vue from 'vue'
const requireDirectives = require.context('./', false, /_directive\.(js)/)
requireDirectives.keys().forEach(fileName => {
  let directivesModule = requireDirectives(fileName)
  directivesModule = directivesModule.default || directivesModule
  Vue.directive(directivesModule.name, directivesModule.directive)
})
