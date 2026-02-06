import Layout from '@/views/layout/Layout.vue'
export default [
  {
    path: '*',
    component: () => import(/* webpackChunkName: "errors-404" */ '@/views/errors/404')
  },
  {
    path: '/',
    redirect: '/home'
  }
]
