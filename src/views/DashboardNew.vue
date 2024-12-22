# Create new file
<template>
  <div class="dashboard">
    <!-- 快捷操作区域 -->
    <div class="quick-tools">
      <el-row :gutter="16">
        <el-col :span="6" v-for="tool in quickTools" :key="tool.name">
          <el-card class="tool-card" shadow="hover" @click="handleQuickAction(tool.action)">
            <div class="tool-content">
              <el-icon class="tool-icon"><component :is="tool.icon" /></el-icon>
              <span class="tool-name">{{ tool.name }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 数据统计区域 -->
    <div class="statistics mt-4">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-card class="stat-card" shadow="hover">
            <template #header>
              <div class="stat-header">
                <span>检查统计</span>
                <el-tag size="small" type="success">实时</el-tag>
              </div>
            </template>
            <div class="stat-content">
              <div class="stat-item">
                <span class="label">今日检查</span>
                <span class="value">{{ stats.todayExams }}</span>
              </div>
              <div class="stat-item">
                <span class="label">本周检查</span>
                <span class="value">{{ stats.weekExams }}</span>
              </div>
              <div class="stat-item">
                <span class="label">本月检查</span>
                <span class="value">{{ stats.monthExams }}</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="stat-card" shadow="hover">
            <template #header>
              <div class="stat-header">
                <span>设备状态</span>
                <el-button type="primary" link size="small" @click="refreshDevices">
                  <el-icon><Refresh /></el-icon>
                </el-button>
              </div>
            </template>
            <div class="stat-content">
              <div class="stat-item">
                <span class="label">在线设备</span>
                <span class="value">{{ stats.onlineDevices }}</span>
              </div>
              <div class="stat-item">
                <span class="label">离线设备</span>
                <span class="value">{{ stats.offlineDevices }}</span>
              </div>
              <div class="stat-item">
                <span class="label">总设备数</span>
                <span class="value">{{ stats.totalDevices }}</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="stat-card" shadow="hover">
            <template #header>
              <div class="stat-header">
                <span>系统状态</span>
                <el-tag size="small" :type="systemStatus.type">{{ systemStatus.text }}</el-tag>
              </div>
            </template>
            <div class="stat-content">
              <div class="stat-item">
                <span class="label">未处理告警</span>
                <span class="value warning">{{ stats.pendingAlerts }}</span>
              </div>
              <div class="stat-item">
                <span class="label">待上传数据</span>
                <span class="value">{{ stats.pendingData }}</span>
              </div>
              <div class="stat-item">
                <span class="label">运行时间</span>
                <span class="value">{{ stats.uptime }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts mt-4">
      <el-row :gutter="16">
        <el-col :span="16">
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <div class="chart-header">
                <span>检查趋势</span>
                <el-radio-group v-model="timeRange" size="small">
                  <el-radio-button label="week">本周</el-radio-button>
                  <el-radio-button label="month">本月</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div ref="trendChart" class="chart-container"></div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="alert-card" shadow="hover">
            <template #header>
              <div class="alert-header">
                <span>最新告警</span>
                <el-button type="primary" link size="small" @click="viewAllAlerts">
                  查看全部
                </el-button>
              </div>
            </template>
            <div class="alert-list">
              <div v-for="alert in recentAlerts" :key="alert.id" class="alert-item">
                <el-tag size="small" :type="alert.level">{{ alert.levelText }}</el-tag>
                <div class="alert-info">
                  <div class="alert-title">{{ alert.title }}</div>
                  <div class="alert-time">{{ alert.time }}</div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import {
  Plus,
  Search,
  Document,
  Setting,
  Refresh,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()
const trendChart = ref(null)
const timeRange = ref('week')

// 快捷工具
const quickTools = [
  { name: '新建检查', icon: 'Plus', action: 'newExam' },
  { name: '查询记录', icon: 'Search', action: 'searchRecord' },
  { name: '检查报告', icon: 'Document', action: 'viewReport' },
  { name: '系统设置', icon: 'Setting', action: 'systemSettings' }
]

// 统计数据
const stats = ref({
  todayExams: 156,
  weekExams: 1024,
  monthExams: 3580,
  onlineDevices: 12,
  offlineDevices: 3,
  totalDevices: 15,
  pendingAlerts: 5,
  pendingData: 28,
  uptime: '7天5小时'
})

// 系统状态
const systemStatus = ref({
  type: 'success',
  text: '运行正常'
})

// 最新告警
const recentAlerts = ref([
  {
    id: 1,
    title: 'ECG001设备离线',
    level: 'error',
    levelText: '严重',
    time: '10分钟前'
  },
  {
    id: 2,
    title: '数据上传异常',
    level: 'warning',
    levelText: '警告',
    time: '30分钟前'
  },
  {
    id: 3,
    title: '存储空间不足',
    level: 'info',
    levelText: '提示',
    time: '1小时前'
  }
])

// 快捷操作处理
const handleQuickAction = (action) => {
  switch (action) {
    case 'newExam':
      router.push('/patients/new')
      break
    case 'searchRecord':
      router.push('/patients/records')
      break
    case 'viewReport':
      router.push('/patients/reports')
      break
    case 'systemSettings':
      router.push('/settings')
      break
  }
}

// 刷新设备状态
const refreshDevices = () => {
  // TODO: 实现设备状态刷新逻辑
}

// 查看所有告警
const viewAllAlerts = () => {
  router.push('/operation/alerts')
}

// 初始化趋势图
const initTrendChart = () => {
  const chart = echarts.init(trendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: 40,
      right: 20,
      bottom: 40,
      left: 60
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        lineStyle: {
          color: '#909399'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#909399'
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '检查数量',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(64,158,255,0.3)'
            },
            {
              offset: 1,
              color: 'rgba(64,158,255,0.1)'
            }
          ])
        }
      }
    ]
  }
  chart.setOption(option)
}

onMounted(() => {
  initTrendChart()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.mt-4 {
  margin-top: 16px;
}

/* 快捷工具样式 */
.tool-card {
  cursor: pointer;
  transition: all 0.3s;
}

.tool-card:hover {
  transform: translateY(-2px);
}

.tool-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.tool-icon {
  font-size: 24px;
  margin-bottom: 8px;
  color: #409EFF;
}

.tool-name {
  font-size: 14px;
  color: #606266;
}

/* 统计卡片样式 */
.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-content {
  padding: 10px 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-item .label {
  color: #909399;
  font-size: 14px;
}

.stat-item .value {
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.stat-item .value.warning {
  color: #E6A23C;
}

/* 图表样式 */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 350px;
}

/* 告警列表样式 */
.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-list {
  max-height: 350px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #EBEEF5;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-info {
  margin-left: 12px;
  flex: 1;
}

.alert-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.alert-time {
  font-size: 12px;
  color: #909399;
}
</style> 