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
          meta: { title: '属性管理' }
        },
        {
          path: '/goods',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/goods.vue'),
          meta: { title: '商品新增' }
        },
        {
          path: '/queryGoods',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/queryGoods.vue'),
          meta: { title: '商品管理' }
        },
        {
          path: '/menu',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Menu.vue'),
          meta: { title: '权限管理' }
        },
        {
          path: '/role',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Role.vue'),
          meta: { title: '角色管理' }
        },
        {
          path: '/user',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/User.vue'),
          meta: { title: '用户管理' }
        },
      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../components/shop/Login.vue'),
      meta: { title: '登录' }
    },
  ]
})
