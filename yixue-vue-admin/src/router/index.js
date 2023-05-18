import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user',
    children: [{
      path: 'user',
      component: () => import('@/views/user.vue'),
      name: '用户管理',
      meta: { title: '用户管理', icon: 'dashboard' }
    }]
  },
  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/blog',
    name: '博客管理',
    meta: { title: '博客管理', icon: 'edit' },
    children: [
      {
        path: 'blog',
        name: '博客管理',
        component: () => import('@/views/blog/blog'),
        meta: { title: '博客管理', icon: 'blog' }
      },
      {
        path: 'blogTag',
        name: '标签管理',
        component: () => import('@/views/blog/blogTag'),
        meta: { title: '标签管理', icon: 'tag' }
      },
      {
        path: 'blogSort',
        name: '分类管理',
        component: () => import('@/views/blog/blogSort'),
        meta: { title: '分类管理', icon: 'sort' }
      },
      {
        path: 'blogRecommend',
        name: '推荐管理',
        component: () => import('@/views/blog/blogRecommend'),
        meta: { title: '推荐管理', icon: 'recommend' }
      }
    ]
  },
  {
    path: '/subject',
    component: Layout,
    redirect: '/subject',
    name: '专题管理',
    meta: { title: '专题管理', icon: 'el-icon-picture-outline' },
    children: [
      {
        path: 'subject',
        name: '专题管理',
        component: () => import('@/views/subject/subject'),
        meta: { title: '专题管理', icon: 'el-icon-picture-outline' }
      },
      {
        path: 'subjectItem',
        name: '专题元素管理',
        component: () => import('@/views/subject/subjectItem'),
        meta: { title: '专题元素管理', icon: 'pictureSort' }
      }
    ]
  },
  {
    path: '/picture',
    component: Layout,
    redirect: '/picture/pictureSort',
    name: '图片管理',
    meta: { title: '图片管理', icon: 'el-icon-picture-outline' },
    children: [
      {
        path: 'picture',
        name: '图片管理',
        component: () => import('@/views/picture/picture'),
        meta: { title: '图片管理', icon: 'el-icon-picture-outline' }
      },
      {
        path: 'pictureSort',
        name: '图片类别管理',
        component: () => import('@/views/picture/pictureSort'),
        meta: { title: '图片类别管理', icon: 'pictureSort' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
