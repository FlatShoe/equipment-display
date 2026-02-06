import _ from 'lodash'
import Vue from 'vue'
const requireComponent = require.context('@/components/inputs', false, /[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(fileName => {
  const componentName = _.upperFirst(_.camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1')))
  const componentConfig = requireComponent(fileName)
  Vue.component(componentName, componentConfig.default || componentConfig)
})
