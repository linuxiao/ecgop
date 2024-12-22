<template>
  <div class="dashboard">
    <!-- 第一行：数据概览 -->
    <div class="dashboard-section">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card class="data-card" shadow="hover">
            <div class="data-header">
              <span class="label">今日检查</span>
              <div class="header-actions">
                <el-tooltip content="实时数据" placement="top">
                  <el-tag size="small" :type="realTimeStatus ? 'success' : 'info'">
                    <el-icon><VideoPlay /></el-icon>
                  </el-tag>
                </el-tooltip>
                <el-icon class="icon"><Calendar /></el-icon>
              </div>
            </div>
            <div class="data-content">
              <div class="number-wrapper">
                <span class="number">{{ stats.todayExams }}</span>
                <span class="unit">例</span>
              </div>
              <div class="trend" :class="{ up: stats.examTrend > 0, down: stats.examTrend < 0 }">
                {{ stats.examTrend > 0 ? '+' : '' }}{{ stats.examTrend }}%
                <span class="trend-text">较昨日</span>
              </div>
            </div>
            <div class="data-footer">
              <div class="footer-item">
                <span class="label">待上传</span>
                <span class="value">{{ stats.pendingUpload }}</span>
              </div>
              <div class="footer-item">
                <span class="label">已完成</span>
                <span class="value">{{ stats.completedExams }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card" shadow="hover">
            <div class="data-header">
              <span class="label">待判读</span>
              <div class="header-actions">
                <el-tag size="small" :type="stats.pendingDiagnosis > 10 ? 'warning' : 'info'">
                  {{ stats.pendingDiagnosis > 10 ? '较多' : '正常' }}
                </el-tag>
                <el-icon class="icon"><Document /></el-icon>
              </div>
            </div>
            <div class="data-content">
              <div class="number-wrapper">
                <span class="number">{{ stats.pendingDiagnosis }}</span>
                <span class="unit">例</span>
              </div>
              <el-button type="primary" link @click="handleViewDiagnosis">
                <el-icon><ArrowRight /></el-icon>去判读
              </el-button>
            </div>
            <div class="data-footer">
              <div class="footer-item">
                <span class="label">今日判读</span>
                <span class="value">{{ stats.todayDiagnosed }}</span>
              </div>
              <div class="footer-item">
                <span class="label">平均耗时</span>
                <span class="value">{{ stats.avgDiagnosisTime }}分钟</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card" shadow="hover">
            <div class="data-header">
              <span class="label">设备在线</span>
              <div class="header-actions">
                <el-tooltip :content="`最后更新: ${stats.lastDeviceCheck}`" placement="top">
                  <el-icon class="refresh-icon" @click="refreshDeviceStatus">
                    <Refresh />
                  </el-icon>
                </el-tooltip>
                <el-icon class="icon"><Monitor /></el-icon>
              </div>
            </div>
            <div class="data-content">
              <div class="number-wrapper">
                <span class="number">{{ stats.onlineDevices }}</span>
                <span class="separator">/</span>
                <span class="total">{{ stats.totalDevices }}</span>
              </div>
              <div class="status-tag" :class="{ warning: stats.onlineRate < 80 }">
                在线率 {{ stats.onlineRate }}%
              </div>
            </div>
            <div class="data-footer">
              <div class="footer-item">
                <span class="label">使用中</span>
                <span class="value">{{ stats.devicesInUse }}</span>
              </div>
              <div class="footer-item">
                <span class="label">空闲</span>
                <span class="value">{{ stats.devicesIdle }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card" shadow="hover">
            <div class="data-header">
              <span class="label">医共体上传</span>
              <div class="header-actions">
                <el-tooltip content="自动修复已启用" placement="top">
                  <el-tag size="small" :type="stats.autoFixEnabled ? 'success' : 'info'">
                    <el-icon><SetUp /></el-icon>
                  </el-tag>
                </el-tooltip>
                <el-icon class="icon"><Upload /></el-icon>
              </div>
            </div>
            <div class="data-content">
              <div class="number-wrapper">
                <span class="number">{{ stats.uploadCount }}</span>
                <span class="unit">次</span>
              </div>
              <div class="status-tag" :class="{ warning: stats.uploadRate < 95 }">
                成功率 {{ stats.uploadRate }}%
              </div>
            </div>
            <div class="data-footer">
              <div class="footer-item">
                <span class="label">自动修复</span>
                <span class="value success">{{ stats.autoFixedCount }}</span>
              </div>
              <div class="footer-item">
                <span class="label">待处理</span>
                <span class="value warning">{{ stats.pendingFixCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 第二行：告警信息和快捷入口 -->
    <div class="dashboard-section">
      <el-row :gutter="16">
        <el-col :span="16">
          <el-card class="alert-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="warning-icon"><Warning /></el-icon>
                  <span>告警信息</span>
                  <el-tag size="small" type="danger" class="alert-count">{{ alerts.length }}</el-tag>
                  <el-divider direction="vertical" />
                  <el-tooltip content="机器人自动修复统计" placement="top">
                    <div class="robot-stats">
                      <el-icon><SetUp /></el-icon>
                      <span class="robot-count">{{ robotStats.totalFixed }}</span>
                      <el-tag size="small" type="success">今日: {{ robotStats.todayFixed }}</el-tag>
                    </div>
                  </el-tooltip>
                </div>
                <div class="header-actions">
                  <el-tooltip content="自动修复" placement="top">
                    <el-button :type="autoFix ? 'success' : 'default'" @click="toggleAutoFix">
                      <el-icon><SetUp /></el-icon>
                      {{ autoFix ? '已开启' : '已关闭' }}
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="刷新" placement="top">
                    <el-button @click="refreshAlerts">
                      <el-icon><Refresh /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-divider direction="vertical" />
                  <el-button type="primary" link @click="handleViewAlerts">
                    查看全部<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>
            <div class="alert-list">
              <div v-for="alert in topAlerts" :key="alert.id" class="alert-item" :class="alert.level">
                <div class="alert-icon">
                  <el-icon><component :is="getAlertIcon(alert.type)" /></el-icon>
                </div>
                <div class="alert-content">
                  <div class="alert-title">{{ alert.title }}</div>
                  <div class="alert-info">
                    <span>{{ alert.time }}</span>
                    <span class="alert-source">{{ alert.source }}</span>
                  </div>
                </div>
                <div class="alert-actions">
                  <el-button type="primary" link size="small" @click="handleAlertAction(alert)">
                    {{ getAlertActionText(alert) }}
                  </el-button>
                </div>
              </div>
              <div v-if="alerts.length === 0" class="no-alerts">
                <el-icon><CircleCheck /></el-icon>
                <span>暂无告警信息</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <quick-access />
        </el-col>
      </el-row>
    </div>

    <!-- 第三行：图表区域 -->
    <div class="dashboard-section">
      <el-row :gutter="16">
        <el-col :span="16">
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>检查量趋势</span>
                <el-radio-group v-model="examChartRange" size="small">
                  <el-radio-button label="week">周</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div class="chart-container">
              <div id="examChart" style="width: 100%; height: 100%;"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>设备使用率</span>
              </div>
            </template>
            <div class="chart-container">
              <div id="deviceChart" style="width: 100%; height: 100%;"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 第四行：状态和活动 -->
    <div class="dashboard-section">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-card class="status-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>设备状态</span>
                <el-button type="primary" link>查看详情</el-button>
              </div>
            </template>
            <template #default>
              <div class="device-list">
                <div v-for="device in deviceList" :key="device.deviceNo" class="device-item">
                  <div class="device-info">
                    <span class="device-name">{{ device.deviceName }}</span>
                    <span class="device-meta">
                      最后活动: {{ device.lastActiveTime }} | 今日检查: {{ device.examCount }}
                    </span>
                  </div>
                  <el-tag :type="device.status === 'online' ? 'success' : 'danger'">
                    {{ device.status === 'online' ? '在线' : '离线' }}
                  </el-tag>
                </div>
              </div>
            </template>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="status-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>最近活动</span>
                <el-button type="primary" link>查看更多</el-button>
              </div>
            </template>
            <template #default>
              <div class="activity-list">
                <div v-for="activity in activities" :key="activity.id" class="activity-item">
                  <el-icon :class="getActivityIcon(activity.type)">
                    <component :is="getActivityIcon(activity.type)" />
                  </el-icon>
                  <div class="activity-content">
                    <div>{{ activity.content }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                  <el-tag size="small" :type="activity.status === 'success' ? 'success' : 'danger'">
                    {{ activity.status === 'success' ? '成功' : '失败' }}
                  </el-tag>
                </div>
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { Calendar, Document, Monitor, Upload, Connection, CircleCheck, Warning, VideoPlay, Refresh, ArrowRight, SetUp, Search, Operation } from '@element-plus/icons-vue'
import QuickAccess from '@/components/QuickAccess.vue'
import '@/styles/dashboard.css'

const router = useRouter()
const examChartRange = ref('week')
let examChart = null
let deviceChart = null

// 添加实时状态
const realTimeStatus = ref(true)

// 扩展统计数据
const stats = ref({
  todayExams: 156,
  examTrend: 12.5,
  pendingDiagnosis: 23,
  onlineDevices: 8,
  totalDevices: 10,
  onlineRate: 80,
  uploadCount: 1205,
  uploadRate: 98.5,
  pendingUpload: 5,
  completedExams: 151,
  lastUpdateTime: null,
  todayDiagnosed: 45,
  avgDiagnosisTime: 8,
  lastDeviceCheck: '10:30:00',
  devicesInUse: 3,
  devicesIdle: 5,
  autoFixEnabled: true,
  autoFixedCount: 15,
  pendingFixCount: 3
})

// 设备状态列表
const deviceList = ref([
  {
    deviceNo: 'ECG001',
    deviceName: '心电图机1号',
    status: 'online',
    lastActiveTime: '2024-03-14 10:30:00',
    examCount: 25
  },
  {
    deviceNo: 'ECG002',
    deviceName: '心电图机2号',
    status: 'offline',
    lastActiveTime: '2024-03-14 09:15:00',
    examCount: 18
  }
])

// 最近活动列表
const activities = ref([
  {
    id: 1,
    type: 'exam',
    content: '张三完成心电图检查',
    time: '10:30:00',
    status: 'success'
  },
  {
    id: 2,
    type: 'diagnosis',
    content: '李生完成心电图判读',
    time: '10:25:00',
    status: 'success'
  },
  {
    id: 3,
    type: 'upload',
    content: '上传医共体平台失败',
    time: '10:20:00',
    status: 'error'
  }
])

// 图表数据
const chartData = {
  week: {
    dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    values: [30, 45, 35, 50, 40, 25, 35]
  },
  month: {
    dates: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
    values: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50 + 20))
  },
  year: {
    dates: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
    values: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000 + 500))
  }
}

// 获取活动图标
const getActivityIcon = (type) => {
  const icons = {
    exam: Monitor,
    diagnosis: Document,
    upload: Upload
  }
  return icons[type] || Document
}

// 初始化检查量趋势图表
const initExamChart = () => {
  const chartDom = document.getElementById('examChart')
  examChart = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData[examChartRange.value].dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '检查量',
        type: 'line',
        smooth: true,
        data: chartData[examChartRange.value].values,
        areaStyle: {
          opacity: 0.1
        },
        lineStyle: {
          width: 3
        },
        itemStyle: {
          borderWidth: 2
        }
      }
    ]
  }
  
  examChart.setOption(option)
}

// 初始化设备使用率图表
const initDeviceChart = () => {
  const chartDom = document.getElementById('deviceChart')
  deviceChart = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '设备使用情况',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 35, name: '正在使用' },
          { value: 45, name: '空闲' },
          { value: 20, name: '离线' }
        ]
      }
    ]
  }
  
  deviceChart.setOption(option)
}

// 监听图表范��变化
watch(examChartRange, () => {
  if (examChart) {
    examChart.setOption({
      xAxis: {
        data: chartData[examChartRange.value].dates
      },
      series: [{
        data: chartData[examChartRange.value].values
      }]
    })
  }
})

// 处理窗口大小变化
const handleResize = () => {
  examChart?.resize()
  deviceChart?.resize()
}

// 添加数据刷新函数
const refreshData = async () => {
  try {
    // TODO: 调用API获取最新数据
    // const response = await api.getDashboardStats()
    // stats.value = response.data
    
    // 模拟数据更新
    stats.value = {
      ...stats.value,
      todayExams: stats.value.todayExams + Math.floor(Math.random() * 3),
      lastUpdateTime: new Date()
    }
  } catch (error) {
    console.error('Failed to refresh data:', error)
    ElMessage.error('数据刷新失败')
  }
}

// 添加定时刷新
let refreshTimer = null

const startRealTimeUpdate = () => {
  realTimeStatus.value = true
  refreshTimer = setInterval(refreshData, 30000) // 每30秒刷新一次
}

const stopRealTimeUpdate = () => {
  realTimeStatus.value = false
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

onMounted(() => {
  // 初始化图表
  nextTick(() => {
    initExamChart()
    initDeviceChart()
  })
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  startRealTimeUpdate()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  examChart?.dispose()
  deviceChart?.dispose()
  stopRealTimeUpdate()
})

// 处理点击事件
const handleViewDevices = () => {
  router.push('/devices/ecg')
}

const handleViewDiagnosis = () => {
  router.push('/patients/list?status=pending')
}

const handleViewMore = () => {
  router.push('/operation/logs')
}

// 添加刷新设备状态的方法
const refreshDeviceStatus = async () => {
  try {
    // TODO: 调用API刷新设备状态
    ElMessage.success('设备状态已更新')
    stats.value.lastDeviceCheck = new Date().toLocaleTimeString()
  } catch (error) {
    ElMessage.error('设备状态更新失败')
  }
}

// 添加告警数据
const alerts = ref([
  {
    id: 1,
    type: 'device',
    level: 'critical',
    title: '心电图机ECG001连接断',
    source: '设备管理',
    time: '10分钟前',
    status: 'pending',
    action: 'reconnect',
    autoFixAttempted: true,
    autoFixResult: 'failed',
    autoFixTime: '10:25:00'
  },
  {
    id: 2,
    type: 'upload',
    level: 'warning',
    title: '医共体数据上传失败（3次重试）',
    source: '数据同步',
    time: '15分钟前',
    status: 'retrying',
    action: 'retry',
    autoFixAttempted: true,
    autoFixResult: 'processing',
    autoFixTime: '10:20:00'
  },
  {
    id: 3,
    type: 'system',
    level: 'warning',
    title: 'HIS接口响应超时',
    source: '系统集成',
    time: '20分钟前',
    status: 'pending',
    action: 'check'
  }
])

// 获取Top5告警
const topAlerts = computed(() => {
  return alerts.value.slice(0, 5)
})

// 获取告警图标
const getAlertIcon = (type) => {
  const icons = {
    device: Monitor,
    upload: Upload,
    system: Connection,
    diagnosis: Document
  }
  return icons[type] || Warning
}

// 获取告警操作文本
const getAlertActionText = (alert) => {
  const actions = {
    reconnect: '重新连接',
    retry: '重试',
    check: '查看详情'
  }
  return actions[alert.action] || '处理'
}

// 处理告警操作
const handleAlertAction = (alert) => {
  switch (alert.action) {
    case 'reconnect':
      ElMessage.info(`正在重新连接设备：${alert.title}`)
      break
    case 'retry':
      ElMessage.info('正在重试上传...')
      break
    case 'check':
      router.push('/operation/alerts')
      break
  }
}

// 查看所有告警
const handleViewAlerts = () => {
  router.push('/operation/alerts')
}

// 添加机器人统计数据
const robotStats = ref({
  totalFixed: 128,  // 累计修复数量
  todayFixed: 15,   // 今日修复数量
  successRate: 95,  // 修复成功率
  avgTime: 30       // 平均修复时间(秒)
})

// 处理一键巡检
const handleInspection = () => {
  router.push('/operation/inspection')
}

// 处理心电图机测试
const handleEcgTest = () => {
  router.push('/devices/ecg')
}
</script>

<style scoped>
.dashboard {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.dashboard-section {
  margin-bottom: 16px;
}

.dashboard-section:last-child {
  margin-bottom: 0;
}

.alert-card,
.chart-card {
  height: 100%;
}

/* 调整布局间距 */
.overview-section,
.mt-16,
.chart-section,
.status-section {
  margin-bottom: 16px !important;
}

.chart-section {
  margin-top: 0 !important;
}

/* 移除多余的间距 */
.el-row {
  margin-bottom: 0 !important;
}

/* 图表容器样式 */
.chart-container {
  height: 100%;
  padding: 16px;
}

/* 其他样式保持不变 */
</style> 