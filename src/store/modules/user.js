import { defineStore } from 'pinia'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => {
    const token = localStorage.getItem('token')
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const roles = userInfo.roles || []
    
    return {
      token,
      userInfo,
      roles
    }
  },

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
        const userInfo = {
          id: 1,
          username: username,
          realName: '管理员',
          avatar: '',
          roles: ['admin'],
          phone: '13800138000',
          email: 'admin@example.com'
        }
        
        // 先保存 token
        localStorage.setItem('token', token)
        this.token = token
        
        // 保存用户信息
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        this.userInfo = userInfo
        this.roles = userInfo.roles
        
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
        localStorage.removeItem('userInfo')
        this.token = ''
        this.userInfo = {}
        this.roles = []
        
        router.push('/login')
        
        return true
      } catch (error) {
        console.error('Logout failed:', error)
        return false
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        // 如果已经有用户信息，直接返回
        if (this.token && Object.keys(this.userInfo).length > 0) {
          return this.userInfo
        }

        // 检查 token
        const token = localStorage.getItem('token')
        if (!token) {
          await this.logout()
          throw new Error('No token found')
        }

        // 从 localStorage 获取用户信息
        const storedUserInfo = localStorage.getItem('userInfo')
        if (storedUserInfo) {
          const userInfo = JSON.parse(storedUserInfo)
          this.userInfo = userInfo
          this.roles = userInfo.roles
          return userInfo
        }

        // 如果没有存储的用户信息，则获取默认信息
        const userInfo = {
          id: 1,
          username: 'admin',
          realName: '管理员',
          avatar: '',
          roles: ['admin'],
          phone: '13800138000',
          email: 'admin@example.com'
        }
        
        this.userInfo = userInfo
        this.roles = userInfo.roles
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        
        return userInfo
      } catch (error) {
        console.error('Get user info failed:', error)
        throw error
      }
    },

    // 更新用户信息
    async updateUserInfo(userInfo) {
      try {
        // 这里应该调用实际的更新用户信息 API
        this.userInfo = { ...this.userInfo, ...userInfo }
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        return true
      } catch (error) {
        console.error('Update user info failed:', error)
        throw error
      }
    },

    // 修改密码
    async changePassword({ oldPassword, newPassword }) {
      try {
        // 这里应该调用实际的修改密码 API
        console.log('Changing password:', { oldPassword, newPassword })
        return true
      } catch (error) {
        console.error('Change password failed:', error)
        throw error
      }
    }
  }
})