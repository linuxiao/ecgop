import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: true
    },
    currentHospital: 1
  }),

  getters: {
    sidebarOpened: (state) => state.sidebar.opened
  },

  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
    },
    
    changeHospital(hospitalId) {
      this.currentHospital = hospitalId
    }
  }
}) 