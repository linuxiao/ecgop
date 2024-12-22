import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { routes } from './routes'
import { useUserStore } from '@/store/modules/user'

// 配置 NProgress
NProgress.configure({ 
  showSpinner: false,
  minimum: 0.2,
  trickleSpeed: 200
})

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 白名单路由
const whiteList = ['/login', '/404']

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 心电管理系统` : '心电管理系统'

  // 获取token
  const token = localStorage.getItem('token')
  const userStore = useUserStore()

  if (token) {
    if (to.path === '/login') {
      // 已登录且要跳转的页面是登录页
      next({ path: '/dashboard' })
      NProgress.done()
    } else {
      try {
        // 获取用户信息
        await userStore.getUserInfo()
        next()
      } catch (error) {
        // 获取用户信息失败，清除token并跳转登录页
        localStorage.removeItem('token')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 在免登录白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面将重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 全局后置钩子
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

export default router