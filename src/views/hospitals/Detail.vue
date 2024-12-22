# Create new file
<template>
  <div class="hospital-detail">
    <!-- 基本信息 -->
    <el-card class="detail-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="医院名称">{{ hospitalInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="医院代码">{{ hospitalInfo.code }}</el-descriptions-item>
        <el-descriptions-item label="医院等级">{{ hospitalInfo.level }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="hospitalInfo.status === 'online' ? 'success' : 'danger'">
            {{ hospitalInfo.status === 'online' ? '在线' : '离线' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系人">{{ hospitalInfo.contact }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ hospitalInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ hospitalInfo.address }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ hospitalInfo.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 设备信息 -->
    <el-card class="detail-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>设备信息</span>
          <div class="header-actions">
            <el-button type="success" @click="handleRefreshDevices">
              <el-icon><Refresh /></el-icon>
              刷新状态
            </el-button>
            <el-button type="primary" @click="handleAddDevice">
              <el-icon><Plus /></el-icon>
              添加设备
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="deviceList" style="width: 100%" border>
        <el-table-column prop="deviceNo" label="设备编号" width="150" />
        <el-table-column prop="model" label="设备型号" width="150" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'online' ? 'success' : 'danger'">
              {{ row.status === 'online' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastActiveTime" label="最后活跃时间" width="180" />
        <el-table-column prop="todayExams" label="今日检查" width="100" align="center" />
        <el-table-column prop="totalExams" label="累计检查" width="100" align="center" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleTestConnection(row)">
              测试连接
            </el-button>
            <el-button link type="primary" @click="handleViewDevice(row)">
              查看
            </el-button>
            <el-button link type="primary" @click="handleEditDevice(row)">
              编辑
            </el-button>
            <el-button 
              link 
              type="danger" 
              @click="handleDeleteDevice(row)"
              :disabled="row.status === 'online'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 统计信息 -->
    <el-card class="detail-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>统计信息</span>
          <el-radio-group v-model="timeRange" size="small">
            <el-radio-button label="week">本周</el-radio-button>
            <el-radio-button label="month">本月</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-title">检查总量</div>
            <div class="stat-value">{{ stats.totalExams }}</div>
            <div class="stat-chart" ref="examChart"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-title">设备在线率</div>
            <div class="stat-value">{{ stats.onlineRate }}%</div>
            <div class="stat-chart" ref="onlineChart"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-title">告警数量</div>
            <div class="stat-value">{{ stats.alertCount }}</div>
            <div class="stat-chart" ref="alertChart"></div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 设备编辑对话框 -->
    <el-dialog
      v-model="deviceDialogVisible"
      :title="deviceDialogType === 'add' ? '添加设备' : '编辑设备'"
      width="600px"
    >
      <el-form
        ref="deviceFormRef"
        :model="deviceForm"
        :rules="deviceRules"
        label-width="100px"
      >
        <el-form-item label="设备编号" prop="deviceNo">
          <el-input v-model="deviceForm.deviceNo" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="设备型号" prop="model">
          <el-input v-model="deviceForm.model" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="deviceForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deviceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDeviceSubmit">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()

// 医院基本信息
const hospitalInfo = reactive({
  id: route.params.id,
  name: '第一人民医院',
  code: 'H001',
  level: '三级甲等',
  status: 'online',
  contact: '张三',
  phone: '13800138000',
  address: '北京市朝阳区',
  remark: '这是一家三甲医院'
})

// 设备列表
const deviceList = ref([
  {
    id: 1,
    deviceNo: 'ECG001',
    model: 'ECG-1200G',
    status: 'online',
    lastActiveTime: '2024-01-20 10:30:00',
    todayExams: 25,
    totalExams: 1560
  },
  {
    id: 2,
    deviceNo: 'ECG002',
    model: 'ECG-1200G',
    status: 'online',
    lastActiveTime: '2024-01-20 10:25:00',
    todayExams: 18,
    totalExams: 1280
  },
  {
    id: 3,
    deviceNo: 'ECG003',
    model: 'ECG-1000E',
    status: 'offline',
    lastActiveTime: '2024-01-19 15:30:00',
    todayExams: 12,
    totalExams: 960
  }
])

// 统计信息
const timeRange = ref('week')
const stats = reactive({
  totalExams: 3800,
  onlineRate: 85,
  alertCount: 5
})

// 设备对话框
const deviceDialogVisible = ref(false)
const deviceDialogType = ref('add')
const deviceFormRef = ref(null)
const deviceForm = reactive({
  deviceNo: '',
  model: '',
  remark: ''
})

// 设备表单校验规则
const deviceRules = {
  deviceNo: [
    { required: true, message: '请输入设备编号', trigger: 'blur' },
    { pattern: /^[A-Z0-9]{3,10}$/, message: '3-10位大写字母或数字', trigger: 'blur' }
  ],
  model: [
    { required: true, message: '请输入设备型号', trigger: 'blur' }
  ]
}

// 编辑医院信息
const handleEdit = () => {
  router.push(`/hospitals/${hospitalInfo.id}/edit`)
}

// 刷新设备状态
const handleRefreshDevices = () => {
  ElMessage.success('设备状态已更新')
}

// 添加设备
const handleAddDevice = () => {
  deviceDialogType.value = 'add'
  deviceDialogVisible.value = true
  // 重置表单
  Object.keys(deviceForm).forEach(key => deviceForm[key] = '')
}

// 编辑设备
const handleEditDevice = (row) => {
  deviceDialogType.value = 'edit'
  deviceDialogVisible.value = true
  // 填充表单
  Object.assign(deviceForm, row)
}

// 查看设备详情
const handleViewDevice = (row) => {
  router.push(`/devices/ecg/${row.deviceNo}`)
}

// 删除设备
const handleDeleteDevice = (row) => {
  ElMessageBox.confirm(
    '确定要删除该设备吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除逻辑
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 测试设备连接
const handleTestConnection = (row) => {
  ElMessage.success(`正在测试设备 ${row.deviceNo} 的连接`)
}

// 提交设备表单
const handleDeviceSubmit = async () => {
  if (!deviceFormRef.value) return
  
  try {
    await deviceFormRef.value.validate()
    // TODO: 实现提交逻辑
    ElMessage.success(deviceDialogType.value === 'add' ? '添加成功' : '更新成功')
    deviceDialogVisible.value = false
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

// 初始化图表
const initCharts = () => {
  // 检查量趋势图
  const examChart = echarts.init(document.querySelector('.stat-chart'))
  examChart.setOption({
    grid: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 30
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed' }
      }
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.3)' },
          { offset: 1, color: 'rgba(64,158,255,0.1)' }
        ])
      },
      lineStyle: {
        color: '#409EFF'
      }
    }]
  })

  // 在线率趋势图
  const onlineChart = echarts.init(document.querySelectorAll('.stat-chart')[1])
  onlineChart.setOption({
    grid: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 30
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed' }
      }
    },
    series: [{
      data: [95, 93, 98, 90, 92, 95, 89],
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(103,194,58,0.3)' },
          { offset: 1, color: 'rgba(103,194,58,0.1)' }
        ])
      },
      lineStyle: {
        color: '#67C23A'
      }
    }]
  })

  // 告警趋势图
  const alertChart = echarts.init(document.querySelectorAll('.stat-chart')[2])
  alertChart.setOption({
    grid: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 30
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed' }
      }
    },
    series: [{
      data: [2, 5, 3, 1, 4, 2, 3],
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(245,108,108,0.3)' },
          { offset: 1, color: 'rgba(245,108,108,0.1)' }
        ])
      },
      lineStyle: {
        color: '#F56C6C'
      }
    }]
  })

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    examChart.resize()
    onlineChart.resize()
    alertChart.resize()
  })
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.hospital-detail {
  padding: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.stat-card {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  height: 300px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.stat-title {
  font-size: 16px;
  color: #606266;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.stat-chart {
  height: 200px;
}

:deep(.el-descriptions__cell) {
  padding: 12px 20px;
}
</style> 