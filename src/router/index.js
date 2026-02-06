import Vue from 'vue'
import VueRouter from 'vue-router'

import privateRoutes from './privateRoutes'
import publicRoutes from './publicRoutes'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [...privateRoutes, ...publicRoutes]
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
