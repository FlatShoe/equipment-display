import Layout from '@/views/layout/Layout.vue'
export default {
  path: '/home',
  name: 'Home',
  component: Layout,
  redirect: '/home-inner',
  children: [
    {
      path: '/home-inner',
      name: 'HomeInner',
      component: () => import(/* webpackChunkName: "Home" */ '@/views/home/index.vue'),
      meta: {
        title: '首页',
        icon: 'home',
        primary: true
      }
    },
    {
      path: '/home-inner2',
      name: 'HomeInner',
      component: () => import(/* webpackChunkName: "Home2" */ '@/views/home/index2.vue'),
      meta: {
        title: '首页',
      }
    },
  ]
}
