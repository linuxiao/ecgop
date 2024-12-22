<template>
  <div class="ecg-devices">
    <el-card class="device-list">
      <template #header>
        <div class="card-header">
          <span class="title">心电设备列表</span>
          <el-button type="primary" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>刷新
          </el-button>
        </div>
      </template>

      <el-table :data="deviceList" border style="width: 100%">
        <el-table-column prop="deviceNo" label="设备编号" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewDevice(row)">{{ row.deviceNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="deviceName" label="设备名称" width="150" />
        <el-table-column prop="model" label="型号" width="120" />
        <el-table-column prop="manufacturer" label="厂商" width="120" />
        <el-table-column prop="department" label="使用科室" width="120" />
        <el-table-column prop="ip" label="IP地址" width="130" />
        <el-table-column prop="lastLoginTime" label="最后登录" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'danger'">
              {{ row.status === '1' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                link 
                type="primary" 
                :disabled="row.status !== '1'"
                @click="handleStartRecord(row)"
              >
                开始检查
              </el-button>
              <el-button
                link
                type="primary"
                @click="handleTestConnection(row)"
              >
                测试连接
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const router = useRouter()

// 设备列表数据
const deviceList = ref([
  {
    deviceNo: 'ECG001',
    deviceName: '心电图机1号',
    model: 'ECG-1200G',
    manufacturer: '科强',
    department: '心内科',
    ip: '192.168.1.100',
    lastLoginTime: '2024-03-14 10:00:00',
    status: '1'
  },
  {
    deviceNo: 'ECG002',
    deviceName: '心电图机2号',
    model: 'ECG-1200G',
    manufacturer: '科强',
    department: '心内科',
    ip: '192.168.1.101',
    lastLoginTime: '2024-03-14 09:30:00',
    status: '0'
  }
])

// 处理查看设备详情
const handleViewDevice = (row) => {
  router.push(`/devices/ecg/${row.deviceNo}`)
}

// 处理开始检查
const handleStartRecord = (row) => {
  ElMessage.success(`开始使用${row.deviceName}进行检查`)
}

// 处理测试连接
const handleTestConnection = (row) => {
  ElMessage.success(`${row.deviceName}连接测试正常`)
}

// 处理刷新
const handleRefresh = () => {
  ElMessage.success('设备列表已更新')
}

onMounted(() => {
  // TODO: 从后端加载设备列表数据
})
</script>

<style scoped>
.ecg-devices {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.device-list {
  background-color: #fff;
}

.device-list :deep(.el-card__header) {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}
</style> 