import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {},
    roles: []
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo.username || ''
  },

  actions: {
    // 登录
    async login(username, password) {
      try {
        // 这里应该调用实际的登录 API
        const token = 'mock-token' // 模拟返回 token
        localStorage.setItem('token', token)
        this.token = token
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    // 登出
    async logout() {
      try {
        // 这里应该调用实际的登出 API
        localStorage.removeItem('token')
        this.token = ''
        this.userInfo = {}
        this.roles = []
        return true
      } catch (error) {
        console.error('Logout failed:', error)
        return false
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        // 这里应该调用实际的用户信息 API
        const userInfo = {
          id: 1,
          username: 'admin',
          realName: '管理员',
          avatar: '',
          roles: ['admin']
        }
        this.userInfo = userInfo
        this.roles = userInfo.roles
        return userInfo
      } catch (error) {
        console.error('Get user info failed:', error)
        throw error
      }
    }
  }
})