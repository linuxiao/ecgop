<template>
  <div class="navbar">
    <div class="left">
      <div class="hamburger" @click="toggleSidebar">
        <el-icon :class="{ 'is-active': !sidebarOpened }"><Fold /></el-icon>
      </div>
      <breadcrumb class="breadcrumb" />
    </div>

    <div class="right">
      <!-- 医院选择 -->
      <div class="hospital-wrapper">
        <el-select
          v-model="currentHospital"
          class="hospital-select"
          placeholder="请选择医院"
          :loading="loading"
          @change="handleHospitalChange"
        >
          <el-option
            v-for="item in hospitals"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <template #default>
              <div class="hospital-option">
                <span>{{ item.name }}</span>
                <el-tag 
                  size="small" 
                  :type="item.status === 'online' ? 'success' : 'danger'"
                >
                  {{ item.status === 'online' ? '在线' : '离线' }}
                </el-tag>
              </div>
            </template>
          </el-option>
        </el-select>

        <el-tooltip content="切换医院" placement="bottom">
          <el-button class="switch-btn" link @click="showHospitalDialog">
            <el-icon><Switch /></el-icon>
          </el-button>
        </el-tooltip>
      </div>

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="avatar-container">
          <el-avatar 
            :size="32"
            :icon="UserFilled"
            class="avatar"
          />
          <span class="name">{{ userStore.userInfo?.name || '未登录' }}</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 切换医院对话框 -->
    <el-dialog
      v-model="hospitalDialogVisible"
      title="切换医院"
      width="600px"
    >
      <div class="hospital-list">
        <el-row :gutter="16">
          <el-col v-for="item in hospitals" :key="item.id" :span="12">
            <div 
              class="hospital-card" 
              :class="{ active: currentHospital === item.id }"
              @click="selectHospital(item)"
            >
              <div class="hospital-info">
                <span class="hospital-name">{{ item.name }}</span>
                <el-tag 
                  size="small" 
                  :type="item.status === 'online' ? 'success' : 'danger'"
                >
                  {{ item.status === 'online' ? '在线' : '离线' }}
                </el-tag>
              </div>
              <div class="hospital-meta">
                <span>设备: {{ item.deviceCount }}台</span>
                <span>今日检查: {{ item.examCount }}例</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Fold, CaretBottom, Switch, UserFilled } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import Breadcrumb from './Breadcrumb.vue'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()
const userStore = useUserStore()

const sidebarOpened = computed(() => appStore.sidebar.opened)

const loading = ref(true)
const hospitals = ref([])

// 初始化医院数据
const initHospitals = () => {
  loading.value = true
  // 模拟异步加载
  setTimeout(() => {
    hospitals.value = [
      {
        id: 1,
        name: '第一人民医院',
        status: 'online',
        deviceCount: 5,
        examCount: 156
      },
      {
        id: 2,
        name: '第二人民医院',
        status: 'online',
        deviceCount: 3,
        examCount: 89
      },
      {
        id: 3,
        name: '社区医院',
        status: 'offline',
        deviceCount: 2,
        examCount: 45
      }
    ]
    loading.value = false
  }, 500)
}

onMounted(() => {
  userStore.getUserInfo()
  initHospitals()
})

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      // TODO: 跳转到个人信息页面
      break
    case 'logout':
      userStore.logout()
      break
  }
}

// 从 store 获取当前医院
const currentHospital = computed({
  get: () => appStore.currentHospital,
  set: (val) => appStore.changeHospital(val)
})

const hospitalDialogVisible = ref(false)

// 处理医院切换
const handleHospitalChange = (hospitalId) => {
  const hospital = hospitals.value.find(h => h.id === hospitalId)
  if (!hospital) return
  
  if (hospital.status === 'offline') {
    ElMessage.warning('该医院当前处于离线状态')
    return
  }

  // 调用 store action 切换医院
  appStore.changeHospital(hospitalId)
  ElMessage.success(`已切换到${hospital.name}`)
}

// 显示切换医院对话框
const showHospitalDialog = () => {
  hospitalDialogVisible.value = true
}

// 选择医院
const selectHospital = (hospital) => {
  if (hospital.status === 'offline') {
    ElMessage.warning('该医院当前处于离线状态')
    return
  }
  handleHospitalChange(hospital.id)
  hospitalDialogVisible.value = false
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 16px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hospital-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
}

.hospital-select {
  width: 180px;
}

.switch-btn {
  font-size: 16px;
  color: #606266;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.avatar-container:hover {
  background-color: #f5f7fa;
}

.name {
  font-size: 14px;
  color: #606266;
}

.hospital-list {
  max-height: 400px;
  overflow-y: auto;
}

.hospital-card {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.hospital-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.hospital-card.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.hospital-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.hospital-name {
  font-size: 16px;
  font-weight: 500;
}

.hospital-meta {
  display: flex;
  gap: 16px;
  color: #909399;
  font-size: 14px;
}

.hospital-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style> 