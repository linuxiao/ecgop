<template>
  <div class="monitor-page">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="statistics">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>设备总数</span>
              <el-tag type="info">{{ statistics.total }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <el-row>
              <el-col :span="12">
                <div class="status-item">
                  <div class="label">在线</div>
                  <div class="value success">{{ statistics.online }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="status-item">
                  <div class="label">离线</div>
                  <div class="value danger">{{ statistics.offline }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日告警</span>
              <el-tag type="danger">{{ statistics.todayAlarms }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <el-row>
              <el-col :span="12">
                <div class="status-item">
                  <div class="label">未处理</div>
                  <div class="value warning">{{ statistics.pendingAlarms }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="status-item">
                  <div class="label">已处理</div>
                  <div class="value success">{{ statistics.handledAlarms }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日检查</span>
              <el-tag type="success">{{ statistics.todayChecks }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <el-row>
              <el-col :span="12">
                <div class="status-item">
                  <div class="label">正常</div>
                  <div class="value success">{{ statistics.normalChecks }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="status-item">
                  <div class="label">异常</div>
                  <div class="value danger">{{ statistics.abnormalChecks }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日维护</span>
              <el-tag type="warning">{{ statistics.todayMaintenance }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <el-row>
              <el-col :span="12">
                <div class="status-item">
                  <div class="label">已完成</div>
                  <div class="value success">{{ statistics.completedMaintenance }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="status-item">
                  <div class="label">待处理</div>
                  <div class="value warning">{{ statistics.pendingMaintenance }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 设备状态和告警列表 -->
    <el-row :gutter="16" class="monitor-content">
      <el-col :span="16">
        <el-card class="device-status">
          <template #header>
            <div class="card-header">
              <span>设备状态</span>
              <el-radio-group v-model="viewType" size="small">
                <el-radio-button label="list">列表</el-radio-button>
                <el-radio-button label="grid">网格</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <!-- 列表视图 -->
          <el-table
            v-if="viewType === 'list'"
            :data="deviceList"
            style="width: 100%"
          >
            <el-table-column prop="deviceNo" label="设备编号" width="120" />
            <el-table-column prop="name" label="设备名称" width="150" />
            <el-table-column prop="location" label="位置" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'online' ? 'success' : 'danger'">
                  {{ row.status === 'online' ? '在线' : '离线' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastHeartbeat" label="最后心跳" width="180" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleViewDetail(row)">详情</el-button>
                <el-button link type="warning" @click="handleCheck(row)">检查</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 网格视图 -->
          <div v-else class="device-grid">
            <el-card
              v-for="device in deviceList"
              :key="device.deviceNo"
              class="device-card"
              :class="{ 'offline': device.status === 'offline' }"
              shadow="hover"
            >
              <div class="device-info">
                <div class="device-name">{{ device.name }}</div>
                <div class="device-no">{{ device.deviceNo }}</div>
                <div class="device-location">{{ device.location }}</div>
                <div class="device-status">
                  <el-tag :type="device.status === 'online' ? 'success' : 'danger'" size="small">
                    {{ device.status === 'online' ? '在线' : '离线' }}
                  </el-tag>
                </div>
                <div class="device-actions">
                  <el-button link type="primary" @click="handleViewDetail(device)">详情</el-button>
                  <el-button link type="warning" @click="handleCheck(device)">检查</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="alarm-list">
          <template #header>
            <div class="card-header">
              <span>实时告警</span>
              <el-button link type="primary" @click="handleViewAllAlarms">查看全部</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="alarm in alarmList"
              :key="alarm.id"
              :type="alarm.level === 'critical' ? 'danger' : alarm.level === 'warning' ? 'warning' : 'info'"
              :timestamp="alarm.time"
              size="large"
            >
              <div class="alarm-item">
                <div class="alarm-title">
                  {{ alarm.title }}
                  <el-tag
                    :type="alarm.level === 'critical' ? 'danger' : alarm.level === 'warning' ? 'warning' : 'info'"
                    size="small"
                  >
                    {{ alarm.level === 'critical' ? '严重' : alarm.level === 'warning' ? '警告' : '提示' }}
                  </el-tag>
                </div>
                <div class="alarm-content">{{ alarm.content }}</div>
                <div class="alarm-device">
                  设备：{{ alarm.deviceNo }} - {{ alarm.deviceName }}
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 设备详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="设备详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备编号">{{ currentDevice.deviceNo }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ currentDevice.name }}</el-descriptions-item>
        <el-descriptions-item label="位置">{{ currentDevice.location }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentDevice.status === 'online' ? 'success' : 'danger'">
            {{ currentDevice.status === 'online' ? '在线' : '离线' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最后心跳">{{ currentDevice.lastHeartbeat }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentDevice.ip }}</el-descriptions-item>
        <el-descriptions-item label="MAC地址">{{ currentDevice.mac }}</el-descriptions-item>
        <el-descriptions-item label="固件版本">{{ currentDevice.firmwareVersion }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleCheck(currentDevice)">设备检查</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'

// 视图类型
const viewType = ref('list')

// 统计数据
const statistics = reactive({
  total: 100,
  online: 85,
  offline: 15,
  todayAlarms: 5,
  pendingAlarms: 2,
  handledAlarms: 3,
  todayChecks: 50,
  normalChecks: 48,
  abnormalChecks: 2,
  todayMaintenance: 8,
  completedMaintenance: 6,
  pendingMaintenance: 2
})

// 设备列表数据
const deviceList = ref([
  {
    deviceNo: 'ECG001',
    name: '心电图机1号',
    location: '心内科1诊室',
    status: 'online',
    lastHeartbeat: '2024-03-14 15:30:00',
    ip: '192.168.1.100',
    mac: '00:11:22:33:44:55',
    firmwareVersion: 'v1.2.3'
  },
  {
    deviceNo: 'ECG002',
    name: '心电图机2号',
    location: '心内科2诊室',
    status: 'offline',
    lastHeartbeat: '2024-03-14 14:30:00',
    ip: '192.168.1.101',
    mac: '00:11:22:33:44:56',
    firmwareVersion: 'v1.2.3'
  }
])

// 告警列表数据
const alarmList = ref([
  {
    id: 1,
    title: '设备离线告警',
    content: '设备已超过30分钟未上报心跳',
    level: 'critical',
    time: '2024-03-14 14:30:00',
    deviceNo: 'ECG002',
    deviceName: '心电图机2号'
  },
  {
    id: 2,
    title: '电量低告警',
    content: '设备电量低于20%',
    level: 'warning',
    time: '2024-03-14 14:00:00',
    deviceNo: 'ECG001',
    deviceName: '心电图机1号'
  }
])

// 设备详情对话框
const detailVisible = ref(false)
const currentDevice = ref({})

// 处理查看设备详情
const handleViewDetail = (device) => {
  currentDevice.value = device
  detailVisible.value = true
}

// 处理设备检查
const handleCheck = (device) => {
  ElMessage.success(`开始检查设备：${device.deviceNo}`)
}

// 处理查看所有告警
const handleViewAllAlarms = () => {
  ElMessage('查看所有告警')
}

// 模拟实时数据更新
let timer
onMounted(() => {
  // 每30秒更新一次数据
  timer = setInterval(() => {
    // 更新设备状态
    deviceList.value.forEach(device => {
      if (Math.random() > 0.8) {
        device.status = device.status === 'online' ? 'offline' : 'online'
        device.lastHeartbeat = new Date().toLocaleString()
      }
    })
    
    // 更新统计数据
    statistics.online = deviceList.value.filter(d => d.status === 'online').length
    statistics.offline = deviceList.value.length - statistics.online
    
    // 随机添加新告警
    if (Math.random() > 0.7) {
      const newAlarm = {
        id: Date.now(),
        title: Math.random() > 0.5 ? '设备离线告警' : '电量低告警',
        content: Math.random() > 0.5 ? '设备已超过30分钟未上报心跳' : '设备电量低于20%',
        level: Math.random() > 0.5 ? 'critical' : 'warning',
        time: new Date().toLocaleString(),
        deviceNo: Math.random() > 0.5 ? 'ECG001' : 'ECG002',
        deviceName: Math.random() > 0.5 ? '心电图机1号' : '心电图机2号'
      }
      alarmList.value.unshift(newAlarm)
      if (alarmList.value.length > 10) {
        alarmList.value.pop()
      }
      statistics.todayAlarms++
      statistics.pendingAlarms++
    }
  }, 30000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.monitor-page {
  height: 100%;
  padding: 16px;
  background-color: #f0f2f5;
}

.statistics {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  padding: 8px 0;
}

.status-item {
  text-align: center;
  padding: 8px;
}

.status-item .label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.status-item .value {
  font-size: 24px;
  font-weight: bold;
}

.status-item .value.success {
  color: #67c23a;
}

.status-item .value.warning {
  color: #e6a23c;
}

.status-item .value.danger {
  color: #f56c6c;
}

.monitor-content {
  height: calc(100% - 140px);
}

.device-status, .alarm-list {
  height: 100%;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 16px;
}

.device-card {
  cursor: pointer;
  transition: all 0.3s;
}

.device-card:hover {
  transform: translateY(-4px);
}

.device-card.offline {
  opacity: 0.7;
}

.device-info {
  text-align: center;
}

.device-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.device-no {
  color: #909399;
  margin-bottom: 8px;
}

.device-location {
  color: #606266;
  margin-bottom: 8px;
}

.device-status {
  margin-bottom: 8px;
}

.device-actions {
  margin-top: 8px;
}

.alarm-list {
  overflow-y: auto;
}

.alarm-item {
  padding: 8px;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
}

.alarm-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
}

.alarm-content {
  color: #606266;
  margin-bottom: 8px;
}

.alarm-device {
  color: #909399;
  font-size: 12px;
}

:deep(.el-timeline-item__node--large) {
  width: 16px;
  height: 16px;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 28px;
}
</style> 