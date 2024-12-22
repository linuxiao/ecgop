<template>
  <div class="patient-detail">
    <div class="detail-layout">
      <!-- 左侧：基本信息和运维信息 -->
      <div class="detail-left">
        <!-- 基本信息卡片 -->
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span class="section-title">基本信息</span>
              <el-button type="primary" link @click="handleEdit">编辑</el-button>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="患者编号">{{ patient.patientNo }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ patient.name }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ patient.gender }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ patient.age }}岁</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ patient.phone }}</el-descriptions-item>
            <el-descriptions-item label="身份证号">{{ patient.idCard }}</el-descriptions-item>
            <el-descriptions-item label="所属医院">{{ patient.hospital }}</el-descriptions-item>
            <el-descriptions-item label="地址" :span="2">{{ patient.address }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 运维信息区域 -->
        <div class="operation-section">
          <!-- 配置信息卡片 -->
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <span class="section-title">配置信息</span>
                <el-button type="primary" link @click="handleEditConfig">编辑配置</el-button>
              </div>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="心电图机URL" :span="2">{{ config.ecgUrl }}</el-descriptions-item>
              <el-descriptions-item label="账号">{{ config.ecgUsername }}</el-descriptions-item>
              <el-descriptions-item label="密码">******</el-descriptions-item>
              <el-descriptions-item label="医共体API" :span="2">{{ config.unionApi }}</el-descriptions-item>
              <el-descriptions-item label="API密钥">{{ config.apiKey }}</el-descriptions-item>
              <el-descriptions-item label="密钥版本">v{{ config.apiVersion }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 运行状态卡片 -->
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <span class="section-title">运行状态</span>
                <el-button type="primary" link @click="handleRefreshStatus">
                  <el-icon><Refresh /></el-icon>刷新
                </el-button>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="status-item">
                  <div class="status-label">心电图机连接</div>
                  <el-tag :type="status.ecgConnected ? 'success' : 'danger'">
                    {{ status.ecgConnected ? '已连接' : '未连接' }}
                  </el-tag>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="status-item">
                  <div class="status-label">医共体连接</div>
                  <el-tag :type="status.unionConnected ? 'success' : 'danger'">
                    {{ status.unionConnected ? '已连接' : '未连接' }}
                  </el-tag>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="status-item">
                  <div class="status-label">HIS连接</div>
                  <el-tag :type="status.hisConnected ? 'success' : 'danger'">
                    {{ status.hisConnected ? '已连接' : '未连接' }}
                  </el-tag>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>

      <!-- 右侧：设备和记录信息 -->
      <div class="detail-right">
        <!-- 主要内容区域 -->
        <div class="content-main">
          <!-- 快捷工具卡片 -->
          <el-card class="info-card tools-card">
            <template #header>
              <div class="card-header">
                <span class="section-title">快捷工具</span>
              </div>
            </template>
            <div class="tools-grid">
              <el-button type="success" @click="handleTestUpload">
                <el-icon><Upload /></el-icon>
                <span>医共体上传测试</span>
              </el-button>
              <el-button type="warning" @click="handleTestHis">
                <el-icon><Connection /></el-icon>
                <span>HIS拉取测试</span>
              </el-button>
              <el-button type="info" @click="handleTestDiagnosis">
                <el-icon><Document /></el-icon>
                <span>判读测试</span>
              </el-button>
            </div>
          </el-card>

          <!-- 记录信息标签页 -->
          <div class="records-section">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="就诊记录" name="visits">
                <el-table :data="visitRecords" border style="width: 100%">
                  <el-table-column prop="visitTime" label="就诊时间" width="180" />
                  <el-table-column prop="department" label="就诊科室" width="120" />
                  <el-table-column prop="doctor" label="主治医生" width="120" />
                  <el-table-column prop="diagnosis" label="诊断结果" show-overflow-tooltip />
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                      <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                      <el-button link type="primary" @click="handleViewVisit(row)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <el-tab-pane label="心电图记录" name="ecg">
                <el-table :data="ecgRecords" border style="width: 100%">
                  <el-table-column prop="ecgId" label="心电图ID" width="120">
                    <template #default="{ row }">
                      <el-link type="primary" @click="handleViewEcg(row)">{{ row.ecgId }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="recordTime" label="记录时间" width="180" />
                  <el-table-column prop="deviceNo" label="设备编号" width="120" />
                  <el-table-column prop="deviceName" label="设备名称" width="150" />
                  <el-table-column prop="doctor" label="检查医生" width="120" />
                  <el-table-column prop="result" label="分析结果" show-overflow-tooltip />
                  <el-table-column prop="diagnosis" label="医生诊断" show-overflow-tooltip>
                    <template #default="{ row }">
                      <span v-if="row.diagnosis">{{ row.diagnosis }}</span>
                      <el-button 
                        v-else-if="row.status === '待判读'"
                        link 
                        type="primary" 
                        @click="handleDiagnosis(row)"
                      >
                        去判读
                      </el-button>
                      <span v-else>-</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                      <el-tag :type="getEcgStatusType(row.status)">{{ row.status }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="shared" label="共享状态" width="100">
                    <template #default="{ row }">
                      <el-tag :type="row.shared ? 'success' : 'info'">
                        {{ row.shared ? '已共享' : '未共享' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                      <el-button-group>
                        <el-button link type="primary" @click="handleViewReport(row)">查看报告</el-button>
                        <el-button 
                          v-if="!row.shared" 
                          link 
                          type="primary" 
                          @click="handleShare(row)"
                        >
                          上传共享
                        </el-button>
                      </el-button-group>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <el-tab-pane label="可用设备" name="devices">
                <div class="devices-section">
                  <div class="devices-header">
                    <el-button type="primary" size="small" @click="handleRefreshDevices">
                      <el-icon><Refresh /></el-icon>刷新
                    </el-button>
                  </div>
                  <el-table :data="deviceList" border style="width: 100%">
                    <el-table-column prop="deviceNo" label="设备编号" width="120" />
                    <el-table-column prop="deviceName" label="设备名称" width="150" />
                    <el-table-column prop="hospital" label="所属医院" width="150" />
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
                            @click="handleTestEcg(row)"
                          >
                            测试连接
                          </el-button>
                        </el-button-group>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>

              <el-tab-pane label="运行日志" name="logs">
                <div class="log-section">
                  <div class="log-header">
                    <div class="header-actions">
                      <el-select v-model="logType" placeholder="日志类型" size="small" style="width: 120px">
                        <el-option label="全部" value="" />
                        <el-option label="就诊记录" value="visit" />
                        <el-option label="心电图" value="ecg" />
                        <el-option label="判读" value="diagnosis" />
                        <el-option label="医共体" value="union" />
                      </el-select>
                      <el-button type="primary" link @click="handleRefreshLogs">
                        <el-icon><Refresh /></el-icon>刷新
                      </el-button>
                    </div>
                  </div>
                  <div class="log-list">
                    <div class="timeline">
                      <div v-for="log in filteredLogs" :key="log.id" class="log-item">
                        <div class="timeline-line"></div>
                        <div class="timeline-dot" :class="log.status === 'success' ? 'success' : 'error'"></div>
                        <div class="log-time">{{ log.time }}</div>
                        <div class="log-content">
                          <el-tag 
                            size="small" 
                            :type="getLogTypeTag(log.type)"
                            class="log-type"
                          >
                            {{ getLogTypeLabel(log.type) }}
                          </el-tag>
                          <span class="log-message">{{ log.message }}</span>
                        </div>
                        <div class="log-status">
                          <el-tag 
                            size="small" 
                            :type="log.status === 'success' ? 'success' : 'danger'"
                          >
                            {{ log.status === 'success' ? '成功' : '失败' }}
                          </el-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用判读组件 -->
    <EcgDiagnosis ref="diagnosisRef" @submit="handleSubmitDiagnosis" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Monitor, Upload, Connection, Document, Refresh } from '@element-plus/icons-vue'
import EcgDiagnosis from '@/components/EcgDiagnosis.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref('visits')

// 患者基本信息
const patient = ref({
  patientNo: 'P202401001',
  name: '张三',
  gender: '男',
  age: 35,
  phone: '13800138000',
  idCard: '310101198801011234',
  hospital: '第一人民医院',
  address: '上海市XX区XX路XX号'
})

// 配置信息
const config = ref({
  ecgUrl: 'http://192.168.1.100:8080',
  ecgUsername: 'admin',
  ecgPassword: '******',
  unionApi: 'https://api.medical-union.com',
  apiKey: 'sk-123456789',
  apiVersion: '1.0'
})

// 运行状态
const status = ref({
  ecgConnected: true,
  unionConnected: true,
  hisConnected: false
})

// 设备列表
const deviceList = ref([
  {
    id: 1,
    deviceNo: 'ECG001',
    deviceName: '心电图机1号',
    hospital: '第一人民医院',
    ip: '192.168.1.100',
    lastLoginTime: '2024-03-14 10:00:00',
    status: '1'
  },
  {
    id: 2,
    deviceNo: 'ECG002',
    deviceName: '心电图机2号',
    hospital: '第二人民医院',
    ip: '192.168.1.101',
    lastLoginTime: '2024-03-14 09:30:00',
    status: '0'
  }
])

// 就诊记录
const visitRecords = ref([
  {
    visitTime: '2024-03-10',
    department: '心内科',
    doctor: '李医生',
    diagnosis: '冠心病，需要进一步检查',
    status: '已完成'
  }
])

// 心电图记录
const ecgRecords = ref([
  {
    ecgId: 'ECG20240310001',
    recordTime: '2024-03-10 09:30:00',
    deviceNo: 'ECG-001',
    deviceName: '心电图机1号',
    doctor: '张医生',
    result: '窦性心律不齐',
    diagnosis: '窦性心律不齐，建议进一步检查',
    status: '已审核',
    shared: true,
    reportType: 'pdf',
    reportUrl: '/path/to/report.pdf'
  },
  {
    ecgId: 'ECG20240314001',
    recordTime: '2024-03-14 10:30:00',
    deviceNo: 'ECG-002',
    deviceName: '心电图机2号',
    doctor: '李医生',
    result: '疑似心肌缺血',
    diagnosis: '',
    status: '待判读',
    shared: false
  }
])

// 状态标签类型
const getStatusType = (status) => {
  const map = {
    '已完成': 'success',
    '进行中': 'warning',
    '已取消': 'danger'
  }
  return map[status] || 'info'
}

const getEcgStatusType = (status) => {
  const map = {
    '已审核': 'success',
    '待判读': 'warning',
    '待检查': 'info'
  }
  return map[status] || 'info'
}

// 处理编辑基本信息
const handleEdit = () => {
  ElMessage.info('编辑功能开发中')
}

// 处理测试功能
const handleTestEcg = (device) => {
  ElMessage.success(`${device.deviceName}连接测试正常`)
}

const handleTestUpload = () => {
  ElMessage.success('医共体上传测试成功')
}

const handleTestHis = () => {
  ElMessage.warning('HIS连接超时')
}

const handleTestDiagnosis = () => {
  ElMessage.success('判读功能测试正常')
}

// 处理配置编辑
const handleEditConfig = () => {
  ElMessage.info('编辑配置功能开发中')
}

// 处理状态刷新
const handleRefreshStatus = () => {
  ElMessage.success('状态已更新')
}

// 处理设备刷新
const handleRefreshDevices = () => {
  ElMessage.success('设备列表已更新')
}

// 处理开始检查
const handleStartRecord = (device) => {
  ElMessage.success(`开始使用${device.deviceName}进行检查`)
}

// 处理查看就诊记录
const handleViewVisit = (row) => {
  ElMessage.info('查看就诊记录详情')
}

// 处理心电图相关操作
const handleViewEcg = (row) => {
  router.push(`/ecg/${row.ecgId}`)
}

const handleViewReport = (row) => {
  if (!row.reportUrl) {
    ElMessage.warning('报告生成中，请稍后查看')
    return
  }
  window.open(row.reportUrl)
}

const handleShare = (row) => {
  ElMessage.success('上传成功')
  row.shared = true
}

// 判读组件引用
const diagnosisRef = ref(null)

// 处理判读
const handleDiagnosis = (row) => {
  diagnosisRef.value?.open({
    result: row.result,
    diagnosis: row.diagnosis,
    suggestion: row.suggestion
  })
}

// 处理提交判读
const handleSubmitDiagnosis = (data) => {
  // TODO: 提交判读结果到后端
  ElMessage.success('判读结果已提交')
}

// 日志类型
const logType = ref('')

// 运行日志数据
const logs = ref([
  {
    id: 1,
    time: '2024-03-14 10:00:00',
    type: 'visit',
    message: '拉取就诊记录',
    status: 'success'
  },
  {
    id: 2,
    time: '2024-03-14 10:05:00',
    type: 'ecg',
    message: '上传心电图数据',
    status: 'success'
  },
  {
    id: 3,
    time: '2024-03-14 10:10:00',
    type: 'diagnosis',
    message: '心电图判读完成',
    status: 'success'
  },
  {
    id: 4,
    time: '2024-03-14 10:15:00',
    type: 'union',
    message: '上传医共体平台',
    status: 'failed'
  }
])

// 过滤日志
const filteredLogs = computed(() => {
  if (!logType.value) return logs.value
  return logs.value.filter(log => log.type === logType.value)
})

// 获取日志类型标签样式
const getLogTypeTag = (type) => {
  const map = {
    'visit': 'info',
    'ecg': 'success',
    'diagnosis': 'warning',
    'union': 'primary'
  }
  return map[type] || 'info'
}

// 获取日志类型标签文本
const getLogTypeLabel = (type) => {
  const map = {
    'visit': '就诊记录',
    'ecg': '心电图',
    'diagnosis': '判读',
    'union': '医共体'
  }
  return map[type] || type
}

// 刷新日志
const handleRefreshLogs = () => {
  ElMessage.success('日志已更新')
}

onMounted(() => {
  // 根据路由参数加载患者数据
  const patientId = route.params.id
  // TODO: 加载患者数据
})
</script>

<style scoped>
/* 整体布局 */
.patient-detail {
  height: 100vh;
  padding: 12px;
  background-color: #f0f2f5;
  overflow: hidden;
}

.detail-layout {
  display: flex;
  overflow-y: auto;
  gap: 12px;
  height: calc(100vh - 24px);
}

/* 左侧布局 */
.detail-left {
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.operation-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
}

/* 右侧布局 */
.detail-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 卡片样式统一 */
.info-card {
  background-color: #fff;
  border-radius: 4px;
  height: auto;
  margin-bottom: 0;
}

.info-card :deep(.el-card__header) {
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
}

.info-card :deep(.el-card__body) {
  /* padding: 12px;
  height: auto;
  min-height: 100px; */
}

/* 标题样式 */
.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

/* 表格样式优化 */
:deep(.el-table) {
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table th) {
  font-weight: 500;
  color: #606266;
}

/* 标签页样式 */
:deep(.el-tabs__header) {
  margin: 0;
  padding: 8px 12px 0;
}

:deep(.el-tabs__content) {
  padding: 12px;
  flex: 1;
  overflow: hidden;
}

/* 工具按钮��式 */
.tools-grid {
  /* display: grid; */
  /* grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 8px 0; */
}

.tools-grid .el-button {
  /* height: 40px; */
  /* font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 8px; */
}

.tools-grid .el-button > span {
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  gap: 2px;
}

.tools-grid .el-icon {
  font-size: 18px;
  margin-bottom: 2px;
}

/* 滚动条美化 */
.operation-section::-webkit-scrollbar {
  width: 6px;
}

.operation-section::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.operation-section::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 状态项样式 */
.status-item {
  text-align: center;
  padding: 12px;
}

.status-label {
  margin-bottom: 8px;
  color: #606266;
  font-size: 13px;
}

/* 表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

/* 调整工具卡片样式 */
.tools-card {
  margin-bottom: 4px;
}

.tools-card :deep(.el-card__header) {
  padding: 8px 12px;
}

.tools-card :deep(.el-card__body) {
  padding: 8px 12px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 0;
}

.tools-grid .el-button {
  height: 32px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 6px 12px;
}

.tools-grid .el-icon {
  font-size: 16px;
  margin: 0;
}

/* 调整右侧布局 */
.detail-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 主要内容区域 */
.content-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 日志区域样式 */
.log-section {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.log-header {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;  /* 将操作按钮靠右对齐 */
}

.log-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e4e7ed;
}

.log-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  position: relative;
  border-bottom: 1px solid #ebeef5;
}

.timeline-dot {
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid #fff;
  z-index: 1;
}

.timeline-dot.success {
  background-color: var(--el-color-success);
}

.timeline-dot.error {
  background-color: var(--el-color-danger);
}

.log-time {
  width: 150px;
  color: #909399;
  font-size: 13px;
  font-weight: 500;
}

.log-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.log-type {
  font-weight: normal;
  border-radius: 2px;
}

.log-message {
  color: #606266;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.log-status {
  width: 60px;
  text-align: right;
}

/* 美化滚动条 */
.log-list::-webkit-scrollbar {
  width: 4px;
}

.log-list::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 2px;
}

.log-list::-webkit-scrollbar-track {
  background-color: transparent;
}

.devices-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.devices-header {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
}
.records-section{
  background-color: #fff;
  min-height: calc(100vh - 80px);
}
</style> 