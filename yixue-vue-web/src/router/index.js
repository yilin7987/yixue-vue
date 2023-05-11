import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeIndex from '@/views/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: HomeIndex,
    children: [
      { path: '/', component: () => import('@/views/index') },
      { path: '/info', component: () => import('@/views/info') },
      { path: '/archive', component: () => import('@/views/archive.vue') },
      { path: '/sort', component: () => import('@/views/sort.vue') },
      { path: '/tag', component: () => import('@/views/tag') },
      { path: '/list', component: () => import('@/views/list') },
      { path: '/subject', component: () => import('@/views/subject') },
      { path: '/messageBoard', component: () => import('@/views/messageBoard') },
      { path: '/about', component: () => import('@/views/about') },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
