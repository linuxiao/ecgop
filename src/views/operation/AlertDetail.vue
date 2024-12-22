# Create new file
<template>
  <div class="alert-detail">
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span class="title">告警详情</span>
          <div class="actions">
            <el-button type="primary" @click="handleProcess" v-if="alertDetail.status === 'pending'">
              <el-icon><Check /></el-icon>处理告警
            </el-button>
            <el-button @click="$router.back()">返回</el-button>
          </div>
        </div>
      </template>

      <!-- 告警信息 -->
      <el-descriptions title="告警信息" :column="3" border>
        <el-descriptions-item label="告警编号">{{ alertDetail.alertNo }}</el-descriptions-item>
        <el-descriptions-item label="告警时间">{{ alertDetail.alertTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(alertDetail.status)">
            {{ getStatusText(alertDetail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="告警类型">{{ alertDetail.alertType }}</el-descriptions-item>
        <el-descriptions-item label="告警级别">
          <el-tag :type="getLevelType(alertDetail.level)">{{ alertDetail.level }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设备编号">
          <el-link type="primary" @click="handleViewDevice">{{ alertDetail.deviceNo }}</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="告警内容" :span="3">{{ alertDetail.content }}</el-descriptions-item>
      </el-descriptions>

      <!-- 设备信息 -->
      <el-descriptions title="设备信息" :column="3" border class="mt-16">
        <el-descriptions-item label="设备名称">{{ alertDetail.deviceName }}</el-descriptions-item>
        <el-descriptions-item label="设备型号">{{ alertDetail.deviceModel }}</el-descriptions-item>
        <el-descriptions-item label="设备状态">
          <el-tag :type="getDeviceStatusType(alertDetail.deviceStatus)">
            {{ alertDetail.deviceStatus }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所属科室">{{ alertDetail.department }}</el-descriptions-item>
        <el-descriptions-item label="安装位置">{{ alertDetail.location }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ alertDetail.manager }}</el-descriptions-item>
      </el-descriptions>

      <!-- 处理记录 -->
      <div class="section mt-16">
        <div class="section-header">
          <h3>处理记录</h3>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in processRecords"
            :key="index"
            :type="getTimelineItemType(record.type)"
            :timestamp="record.time"
          >
            <h4>{{ record.title }}</h4>
            <p>{{ record.content }}</p>
            <p v-if="record.operator" class="operator">处理人：{{ record.operator }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 处理对话框 -->
      <el-dialog
        v-model="processDialogVisible"
        title="处理告警"
        width="500px"
      >
        <el-form :model="processForm" label-width="80px">
          <el-form-item label="处理方式">
            <el-select v-model="processForm.type" placeholder="请选择处理方式">
              <el-option label="远程处理" value="remote" />
              <el-option label="现场处理" value="onsite" />
              <el-option label="转交处理" value="transfer" />
            </el-select>
          </el-form-item>
          <el-form-item label="处理结果">
            <el-input
              v-model="processForm.result"
              type="textarea"
              rows="4"
              placeholder="请输入处理结果"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="processDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitProcess">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const alertId = route.params.id

// 告警详情数据
const alertDetail = ref({
  alertNo: 'A202401001',
  alertTime: '2024-03-14 09:30:00',
  status: 'pending',
  alertType: '设备离线',
  level: '严重',
  deviceNo: 'ECG001',
  content: '设备已离线超过30分钟，请检查网络连接状态',
  deviceName: '十二导联心电图机',
  deviceModel: 'ECG-1200',
  deviceStatus: '离线',
  department: '心内科',
  location: '心电图室',
  manager: '张工程师'
})

// 处理记录数据
const processRecords = ref([
  {
    time: '2024-03-14 09:30:00',
    type: 'warning',
    title: '系统告警',
    content: '设备已离线超过30分钟'
  },
  {
    time: '2024-03-14 09:35:00',
    type: 'info',
    title: '系统通知',
    content: '已通知相关负责人'
  }
])

// 处理对话框
const processDialogVisible = ref(false)
const processForm = ref({
  type: '',
  result: ''
})

// 获取状态对应的标签类型
const getStatusType = (status) => {
  const map = {
    'pending': 'danger',
    'processing': 'warning',
    'resolved': 'success',
    'closed': 'info'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const map = {
    'pending': '待处理',
    'processing': '处理中',
    'resolved': '已解决',
    'closed': '已关闭'
  }
  return map[status] || status
}

// 获取告警级别对应的标签类型
const getLevelType = (level) => {
  const map = {
    '严重': 'danger',
    '警告': 'warning',
    '提示': 'info'
  }
  return map[level] || 'info'
}

// 获取设备状态对应的标签类型
const getDeviceStatusType = (status) => {
  const map = {
    '在线': 'success',
    '离线': 'danger',
    '故障': 'warning'
  }
  return map[status] || 'info'
}

// 获取时间线项目类型
const getTimelineItemType = (type) => {
  const map = {
    'warning': 'warning',
    'success': 'success',
    'info': 'info'
  }
  return map[type] || 'info'
}

// 查看设备详情
const handleViewDevice = () => {
  router.push(`/devices/ecg/${alertDetail.value.deviceNo}`)
}

// 处理告警
const handleProcess = () => {
  processDialogVisible.value = true
}

// 提交处理结果
const submitProcess = () => {
  if (!processForm.value.type) {
    ElMessage.warning('请选择处理方式')
    return
  }
  if (!processForm.value.result) {
    ElMessage.warning('请输入处理结果')
    return
  }

  // TODO: 提交处理结果到后端
  ElMessage.success('处理成功')
  processDialogVisible.value = false

  // 更新告警状态和处理记录
  alertDetail.value.status = 'resolved'
  processRecords.value.push({
    time: new Date().toLocaleString(),
    type: 'success',
    title: '处理完成',
    content: processForm.value.result,
    operator: '当前用户'
  })

  // 重置表单
  processForm.value = {
    type: '',
    result: ''
  }
}

// 加载告警详情数据
const loadAlertDetail = async () => {
  // TODO: 从后端加载告警详情数据
  console.log('Loading alert detail for:', alertId)
}

// 页面加载时获取数据
onMounted(() => {
  loadAlertDetail()
})
</script>

<style scoped>
.alert-detail {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.detail-card {
  background-color: #fff;
}

.detail-card :deep(.el-card__header) {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.actions {
  display: flex;
  gap: 8px;
}

.mt-16 {
  margin-top: 16px;
}

.section {
  margin-top: 16px;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin: 0;
}

:deep(.el-descriptions__title) {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 16px;
}

:deep(.el-descriptions__cell) {
  padding: 12px !important;
}

.operator {
  margin-top: 8px;
  color: #909399;
  font-size: 13px;
}

:deep(.el-timeline-item__content h4) {
  font-size: 14px;
  margin: 0 0 8px;
}

:deep(.el-timeline-item__content p) {
  color: #606266;
  margin: 0;
  line-height: 1.6;
}
</style> 