<template>
  <div class="his-config-page">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>HIS系统配置</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleTest">
              <el-icon><Connection /></el-icon>测试连接
            </el-button>
            <el-button type="primary" @click="handleEdit">
              <el-icon><Edit /></el-icon>编辑配置
            </el-button>
          </div>
        </div>
      </template>

      <!-- 配置信息展示 -->
      <el-descriptions :column="2" border>
        <el-descriptions-item label="HIS系统名称">
          {{ config.systemName }}
        </el-descriptions-item>
        <el-descriptions-item label="系统版本">
          {{ config.version }}
        </el-descriptions-item>
        <el-descriptions-item label="接口地址">
          {{ config.baseUrl }}
        </el-descriptions-item>
        <el-descriptions-item label="连接状态">
          <el-tag :type="config.status === 'connected' ? 'success' : 'danger'">
            {{ config.status === 'connected' ? '已连接' : '未连接' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="认证方式">
          {{ config.authType }}
        </el-descriptions-item>
        <el-descriptions-item label="账号">
          {{ config.username }}
        </el-descriptions-item>
        <el-descriptions-item label="最后连接时间" :span="2">
          {{ config.lastConnectTime }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ config.remark }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 连接日志 -->
      <div class="log-section">
        <div class="section-header">
          <h3>连接日志</h3>
          <el-button type="primary" link @click="handleClearLog">
            <el-icon><Delete /></el-icon>清空日志
          </el-button>
        </div>
        <el-scrollbar height="200px">
          <div class="log-content">
            <p v-for="(log, index) in logs" :key="index" :class="log.type">
              {{ log.time }} - {{ log.message }}
            </p>
          </div>
        </el-scrollbar>
      </div>
    </el-card>

    <!-- 编辑配置对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑配置"
      width="600px"
      :destroy-on-close="true"
    >
      <el-form
        ref="formRef"
        :model="editForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="系统名称" prop="systemName">
          <el-input v-model="editForm.systemName" />
        </el-form-item>
        <el-form-item label="系统版本" prop="version">
          <el-input v-model="editForm.version" />
        </el-form-item>
        <el-form-item label="接口地址" prop="baseUrl">
          <el-input v-model="editForm.baseUrl" />
        </el-form-item>
        <el-form-item label="认证方式" prop="authType">
          <el-select v-model="editForm.authType" style="width: 100%">
            <el-option label="Basic认证" value="basic" />
            <el-option label="Token认证" value="token" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 测试连接对话框 -->
    <el-dialog
      v-model="testDialogVisible"
      title="测试连接"
      width="500px"
      :destroy-on-close="true"
    >
      <div class="test-dialog">
        <div class="test-steps">
          <p :class="{ active: testStep >= 1 }">1. 验证接口地址...</p>
          <p :class="{ active: testStep >= 2 }">2. 验证认证信息...</p>
          <p :class="{ active: testStep >= 3 }">3. 测试数据交换...</p>
        </div>
        <div class="test-result" v-if="testStep === 4">
          <el-result
            :icon="testSuccess ? 'success' : 'error'"
            :status="testSuccess ? 'success' : 'error'"
            :title="testSuccess ? '连接成功' : '连接失败'"
            :sub-title="testMessage"
          >
            <template #extra>
              <el-button @click="testDialogVisible = false">关闭</el-button>
              <el-button type="primary" @click="handleTest" v-if="!testSuccess">
                重试
              </el-button>
            </template>
          </el-result>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Connection, Edit, Delete } from '@element-plus/icons-vue'

// 配置信息
const config = reactive({
  systemName: 'XX医院HIS系统',
  version: 'v2.0',
  baseUrl: 'http://his.example.com/api',
  status: 'connected',
  authType: 'Basic认证',
  username: 'admin',
  lastConnectTime: '2024-03-14 15:30:00',
  remark: '用于心电图数据对接的HIS系统配置'
})

// 连接日志
const logs = ref([
  {
    time: '2024-03-14 15:30:00',
    type: 'success',
    message: '连接成功'
  },
  {
    time: '2024-03-14 15:29:58',
    type: 'info',
    message: '验证认证信息'
  },
  {
    time: '2024-03-14 15:29:57',
    type: 'info',
    message: '开始连接测试'
  }
])

// 编辑表单
const dialogVisible = ref(false)
const formRef = ref(null)
const editForm = reactive({
  systemName: '',
  version: '',
  baseUrl: '',
  authType: '',
  username: '',
  password: '',
  remark: ''
})

// 表单验证规则
const rules = {
  systemName: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
  baseUrl: [{ required: true, message: '请输入接口地址', trigger: 'blur' }],
  authType: [{ required: true, message: '请选择认证方式', trigger: 'change' }],
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 测试连接相关
const testDialogVisible = ref(false)
const testStep = ref(0)
const testSuccess = ref(false)
const testMessage = ref('')

// 编辑配置
const handleEdit = () => {
  Object.assign(editForm, config)
  dialogVisible.value = true
}

// 保存配置
const handleSave = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      Object.assign(config, editForm)
      dialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

// 测试连接
const handleTest = async () => {
  testDialogVisible.value = true
  testStep.value = 1
  testSuccess.value = false
  testMessage.value = ''

  try {
    // 模拟测试过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    testStep.value = 2
    await new Promise(resolve => setTimeout(resolve, 1000))
    testStep.value = 3
    await new Promise(resolve => setTimeout(resolve, 1000))
    testStep.value = 4
    testSuccess.value = true
    testMessage.value = '所有测试项目通过'

    // 添加日志
    logs.value.unshift({
      time: new Date().toLocaleString(),
      type: 'success',
      message: '连接测试成功'
    })
  } catch (error) {
    testStep.value = 4
    testSuccess.value = false
    testMessage.value = error.message || '连接失败'

    // 添加日志
    logs.value.unshift({
      time: new Date().toLocaleString(),
      type: 'error',
      message: '连接测试失败'
    })
  }
}

// 清空日志
const handleClearLog = () => {
  logs.value = []
  ElMessage.success('日志已清空')
}
</script>

<style scoped>
.his-config-page {
  height: 100%;
  padding: 16px;
  background-color: #f0f2f5;
}

.config-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.log-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
}

.log-content {
  padding: 8px;
  background-color: #1e1e1e;
  border-radius: 4px;
  font-family: monospace;
}

.log-content p {
  margin: 4px 0;
  color: #d4d4d4;
}

.log-content .success {
  color: #67c23a;
}

.log-content .error {
  color: #f56c6c;
}

.log-content .info {
  color: #909399;
}

.test-dialog {
  padding: 16px;
}

.test-steps {
  margin-bottom: 24px;
}

.test-steps p {
  margin: 8px 0;
  color: #909399;
}

.test-steps p.active {
  color: #409eff;
}

:deep(.el-descriptions) {
  margin-bottom: 16px;
}

:deep(.el-descriptions__cell) {
  padding: 16px;
}
</style> 