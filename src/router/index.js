import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Type.vue'),
          meta: { title: '分类管理' }
        },
        {
          path: '/brand',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Brand.vue'),
          meta: { title: '品牌管理' }
        },
        {
          path: '/property',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/property.vue'),
          meta: { title: '商品管理' }
        },
        {
          path: '/goods',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/goods.vue'),
          meta: { title: '商品管理' }
        },
      ]
    },
  ]
})
