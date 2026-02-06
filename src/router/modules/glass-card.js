import Layout from '@/views/layout/Layout.vue'
export default {
  path: '/glass- card',
  name: 'glassCard',
  component: Layout,
  redirect: '/glass-card-inner',
  children: [
    {
      path: '/glass-card-inner',
      name: 'glassCardInner',
      component: () => import(/* webpackChunkName: "glassCardInner" */ '@/views/iframe-ui/GlassCard.vue'),
      meta: {
        title: '卡片',
        icon: 'home',
        primary: true
      }
    }
  ]
}
