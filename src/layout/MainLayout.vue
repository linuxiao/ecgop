<template>
  <div class="app-wrapper" :class="{ 'sidebar-collapse': isCollapse }">
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <Navbar />
      <router-view v-slot="{ Component }">
        <suspense>
          <template #default>
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </template>
          <template #fallback>
            <div class="loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              加载中...
            </div>
          </template>
        </suspense>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/NavBar.vue'

const appStore = useAppStore()
const isCollapse = computed(() => !appStore.sidebar.opened)
</script>

<style scoped>
.app-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
}

.sidebar-container {
  width: 210px;
  height: 100%;
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1001;
}

.main-container {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  margin-left: 210px;
  transition: margin-left 0.3s;
}

/* 当侧边栏收起时 */
.sidebar-collapse .sidebar-container {
  width: 64px;
}

/* 当侧边栏收起时，主容器自适应 */
.sidebar-collapse .main-container {
  margin-left: 64px;
}

.loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #909399;
}
</style> 