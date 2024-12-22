<template>
  <div class="ecg-device-detail">
    <!-- 设备详情卡片 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span class="title">设备详情</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备编号">{{ device.deviceNo }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ device.deviceName }}</el-descriptions-item>
        <el-descriptions-item label="设备型号">{{ device.model }}</el-descriptions-item>
        <el-descriptions-item label="厂商">{{ device.manufacturer }}</el-descriptions-item>
        <el-descriptions-item label="使用科室">{{ device.department }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="device.status === '1' ? 'success' : 'danger'">
            {{ device.status === '1' ? '在线' : '离线' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最后登录时间">{{ device.lastLoginTime }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ device.ip }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 登录配置卡片 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span class="title">登录配置</span>
          <el-button type="primary" link @click="handleEditConfig">编辑配置</el-button>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备URL">{{ config.deviceUrl }}</el-descriptions-item>
        <el-descriptions-item label="登录账号">{{ config.username }}</el-descriptions-item>
        <el-descriptions-item label="登录密码">******</el-descriptions-item>
        <el-descriptions-item label="FTP地址">{{ config.ftpUrl }}</el-descriptions-item>
        <el-descriptions-item label="FTP账号">{{ config.ftpUsername }}</el-descriptions-item>
        <el-descriptions-item label="FTP密码">******</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 接口测试卡片 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span class="title">接口测试</span>
        </div>
      </template>
      <div class="test-grid">
        <el-button type="primary" :loading="testing.login" @click="handleTestLogin">
          <el-icon><Key /></el-icon>登录测试
        </el-button>
        <el-button type="success" :loading="testing.ecg" @click="handleTestEcg">
          <el-icon><Upload /></el-icon>心电图传输
        </el-button>
        <el-button type="warning" :loading="testing.diagnosis" @click="handleTestDiagnosis">
          <el-icon><Document /></el-icon>判读测试
        </el-button>
        <el-button type="info" :loading="testing.ftp" @click="handleTestFtp">
          <el-icon><Upload /></el-icon>FTP上传
        </el-button>
        <el-button :loading="testing.patient" @click="handleTestPatient">
          <el-icon><Search /></el-icon>患者查询
        </el-button>
      </div>

      <!-- 测试日志 -->
      <div class="test-logs">
        <div class="log-header">
          <span class="title">测试日志</span>
          <el-button type="primary" link @click="handleClearLogs">
            清空日志
          </el-button>
        </div>
        <div class="log-content">
          <div v-for="(log, index) in testLogs" :key="index" class="log-item">
            <el-tag 
              size="small" 
              :type="log.status === 'success' ? 'success' : 'danger'"
              class="log-status"
            >
              {{ log.status === 'success' ? '成功' : '失败' }}
            </el-tag>
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 配置编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑配置"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="设备URL" prop="deviceUrl">
          <el-input v-model="form.deviceUrl" placeholder="请输入设备URL" />
        </el-form-item>
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入登录密码" show-password />
        </el-form-item>
        <el-form-item label="FTP地址" prop="ftpUrl">
          <el-input v-model="form.ftpUrl" placeholder="请输入FTP地址" />
        </el-form-item>
        <el-form-item label="FTP账号" prop="ftpUsername">
          <el-input v-model="form.ftpUsername" placeholder="请输入FTP账号" />
        </el-form-item>
        <el-form-item label="FTP密码" prop="ftpPassword">
          <el-input v-model="form.ftpPassword" type="password" placeholder="请输入FTP密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitConfig">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Key, Upload, Document, Search } from '@element-plus/icons-vue'

const route = useRoute()
const deviceNo = route.params.deviceNo

// 设备信息
const device = ref({
  deviceNo: 'ECG001',
  deviceName: '心电图机1号',
  model: 'ECG-1200G',
  manufacturer: '科强',
  department: '心内科',
  status: '1',
  lastLoginTime: '2024-03-14 10:00:00',
  ip: '192.168.1.100'
})

// 配置信息
const config = ref({
  deviceUrl: 'http://192.168.1.100:8080',
  username: 'admin',
  password: '******',
  ftpUrl: 'ftp://192.168.1.100',
  ftpUsername: 'ecg',
  ftpPassword: '******'
})

// 测试状态
const testing = reactive({
  login: false,
  ecg: false,
  diagnosis: false,
  ftp: false,
  patient: false
})

// 测试日志
const testLogs = ref([])

// 对话框状态
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({
  deviceUrl: '',
  username: '',
  password: '',
  ftpUrl: '',
  ftpUsername: '',
  ftpPassword: ''
})

// 表单验证规则
const rules = {
  deviceUrl: [
    { required: true, message: '请输入设备URL', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入登录账号', trigger: 'blur' }
  ],
  ftpUrl: [
    { required: true, message: '请输入FTP地址', trigger: 'blur' }
  ],
  ftpUsername: [
    { required: true, message: '请输入FTP账号', trigger: 'blur' }
  ]
}

// 添加测试日志
const addTestLog = (status, message) => {
  const now = new Date()
  const time = now.toLocaleTimeString()
  testLogs.value.unshift({
    time,
    status,
    message
  })
}

// 处理编辑配置
const handleEditConfig = () => {
  Object.assign(form, {
    deviceUrl: config.value.deviceUrl,
    username: config.value.username,
    ftpUrl: config.value.ftpUrl,
    ftpUsername: config.value.ftpUsername
  })
  dialogVisible.value = true
}

// 处理提交配置
const handleSubmitConfig = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      Object.assign(config.value, {
        deviceUrl: form.deviceUrl,
        username: form.username,
        ftpUrl: form.ftpUrl,
        ftpUsername: form.ftpUsername
      })
      if (form.password) config.value.password = form.password
      if (form.ftpPassword) config.value.ftpPassword = form.ftpPassword
      
      ElMessage.success('配置已更新')
      dialogVisible.value = false
    }
  })
}

// 处理登录测试
const handleTestLogin = async () => {
  testing.login = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    addTestLog('success', '设备登录成功')
    ElMessage.success('登录测试成功')
  } catch (error) {
    addTestLog('error', '设备登录失败：' + error.message)
    ElMessage.error('登录测试失败')
  } finally {
    testing.login = false
  }
}

// 处理心电图传输测试
const handleTestEcg = async () => {
  testing.ecg = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    addTestLog('success', '心电图传输成功')
    ElMessage.success('心电图传输测试成功')
  } catch (error) {
    addTestLog('error', '心电图传输失败：' + error.message)
    ElMessage.error('心电图传输测试失败')
  } finally {
    testing.ecg = false
  }
}

// 处理判读测试
const handleTestDiagnosis = async () => {
  testing.diagnosis = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    addTestLog('success', '判读测试成功')
    ElMessage.success('判读测试成功')
  } catch (error) {
    addTestLog('error', '判读测试失败：' + error.message)
    ElMessage.error('判读测试失败')
  } finally {
    testing.diagnosis = false
  }
}

// 处理FTP上传测试
const handleTestFtp = async () => {
  testing.ftp = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    addTestLog('success', 'FTP上传成功')
    ElMessage.success('FTP上传测试成功')
  } catch (error) {
    addTestLog('error', 'FTP上传失败：' + error.message)
    ElMessage.error('FTP上传测试失败')
  } finally {
    testing.ftp = false
  }
}

// 处理患者查询测试
const handleTestPatient = async () => {
  testing.patient = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    addTestLog('success', '患者查询成功')
    ElMessage.success('患者查询测试成功')
  } catch (error) {
    addTestLog('error', '患者查询失败：' + error.message)
    ElMessage.error('患者查询测试失败')
  } finally {
    testing.patient = false
  }
}

// 清空测试日志
const handleClearLogs = () => {
  testLogs.value = []
  ElMessage.success('日志已��空')
}

// 加载设备数据
const loadDeviceData = async () => {
  // TODO: 从后端加载设备数据
  console.log('Loading device data for:', deviceNo)
}

onMounted(() => {
  loadDeviceData()
})
</script>

<style scoped>
.ecg-device-detail {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.detail-card {
  margin-bottom: 16px;
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
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.test-grid .el-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.test-logs {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.log-header {
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
}

.log-content {
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #ebeef5;
}

.log-item:last-child {
  border-bottom: none;
}

.log-status {
  width: 40px;
  text-align: center;
}

.log-time {
  color: #909399;
  font-size: 13px;
  width: 100px;
}

.log-message {
  flex: 1;
  color: #606266;
}

/* 美化滚动条 */
.log-content::-webkit-scrollbar {
  width: 6px;
}

.log-content::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.log-content::-webkit-scrollbar-track {
  background-color: transparent;
}
</style> 