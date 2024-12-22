<template>
  <div class="sidebar">
    <div class="logo">
      <h1 class="logo-text" v-if="!isCollapse">心电管理系统</h1>
      <h1 class="logo-text" v-else>心</h1>
    </div>
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409EFF"
        :router="true"
        @select="handleSelect"
        unique-opened
      >
        <template v-for="item in filteredMenuItems" :key="item.path">
          <!-- 没有子菜单的情况 -->
          <el-menu-item 
            v-if="!item.children" 
            :index="`/${item.path}`"
          >
            <el-icon><component :is="item.meta?.icon" /></el-icon>
            <template #title>{{ item.meta?.title }}</template>
          </el-menu-item>

          <!-- 有子菜单的情况 -->
          <el-sub-menu 
            v-else-if="hasVisibleChildren(item)" 
            :index="`/${item.path}`"
          >
            <template #title>
              <el-icon><component :is="item.meta?.icon" /></el-icon>
              <span>{{ item.meta?.title }}</span>
            </template>
            <el-menu-item 
              v-for="child in visibleChildren(item)"
              :key="child.path"
              :index="`/${item.path}/${child.path}`"
            >
              <el-icon><component :is="child.meta?.icon" /></el-icon>
              <template #title>{{ child.meta?.title }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { menuItems } from '@/router/menus'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const isCollapse = computed(() => !appStore.sidebar.opened)

// 过滤掉隐藏的菜单项
const filteredMenuItems = computed(() => {
  return menuItems?.filter(item => !item?.meta?.hidden) || []
})

// 检查是否有可见的子菜单
const hasVisibleChildren = (item) => {
  if (!item?.children) {
    return false
  }
  return item.children.some(child => !child?.meta?.hidden)
}

// 获取可见的子菜单
const visibleChildren = (item) => {
  if (!item?.children) {
    return []
  }
  return item.children.filter(child => !child?.meta?.hidden)
}

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 处理菜单选择
const handleSelect = (index) => {
  if (route.path !== index) {
    router.push(index).catch(() => {})
  }
}
</script>

<style scoped>
.sidebar {
  height: 100%;
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b2f3a;
}

.logo-text {
  color: #fff;
  font-size: 20px;
  margin: 0;
  white-space: nowrap;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 210px;
}

:deep(.el-sub-menu__title) {
  &:hover {
    background-color: #263445 !important;
  }
}

:deep(.el-menu-item) {
  &:hover {
    background-color: #263445 !important;
  }
  
  &.is-active {
    background-color: #263445 !important;
  }
}

/* 隐藏多余的文字 */
.el-menu--collapse .el-sub-menu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}

/* 修复折叠菜单的弹出样式 */
:deep(.el-menu--popup) {
  background-color: #1f2d3d;
  .el-menu-item {
    background-color: #1f2d3d;
    &:hover {
      background-color: #001528;
    }
  }
}
</style> 