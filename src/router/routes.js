import MainLayout from '@/layout/MainLayout.vue'
import { mainRoutes } from './menus'

// 基础路由
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { 
      title: '登录',
      requiresAuth: false 
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404',
      requiresAuth: false
    }
  },

 
]

// 主应用路由
const mainRoute = {
  path: '/',
  component: MainLayout,
  redirect: '/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardNew.vue'),
      meta: { 
        title: '仪表盘',
        icon: 'Odometer',
        requiresAuth: true 
      }
    },
    ...mainRoutes
  ]
}

// 错误处理路由 - 必须放在最后
const errorRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/404'
}

// 导出所有路由
export const routes = [
  ...constantRoutes,
  mainRoute,
  errorRoute
] 