import Layout from '@/views/layout/Layout.vue'
export default {
  path: '/thres-hold-parameter',
  name: 'ThresHoldParameter',
  component: Layout,
  redirect: '/thres-hold-parameter-inner',
  children: [
    {
      path: '/thres-hold-parameter-inner',
      name: 'ThresHoldParameterInner',
      component: () => import(/* webpackChunkName: "ThresHoldParameter" */ '@/views/iframe-ui/ThresHoldParameter.vue'),
      meta: {
        title: '首页',
        icon: 'home',
        primary: true
      }
    }
  ]
}
