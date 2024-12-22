<template>
  <div class="ecg-diagnosis">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>返回
      </el-button>
      <div class="action-buttons">
        <el-button type="primary" @click="handleSave">
          <el-icon><Check /></el-icon>保存
        </el-button>
      </div>
    </div>

    <div class="content-container">
      <!-- 顶部信息区域 - 左右布局 -->
      <div class="info-section">
        <!-- 左侧患者信息 -->
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>患者信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="患者姓名">{{ patientInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ patientInfo.gender }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ patientInfo.age }}岁</el-descriptions-item>
            <el-descriptions-item label="病历号">{{ patientInfo.patientNo }}</el-descriptions-item>
            <el-descriptions-item label="身份证号">{{ patientInfo.idCard }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ patientInfo.phone }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 右侧判读结果 -->
        <el-card class="diagnosis-card">
          <template #header>
            <div class="card-header">
              <span>判读结果</span>
            </div>
          </template>
          <el-form :model="diagnosisForm" label-width="100px">
            <el-form-item label="分析结果">
              <el-input
                v-model="diagnosisForm.analysis"
                type="textarea"
                :rows="3"
                placeholder="请输入分析结果"
              />
            </el-form-item>
            <el-form-item label="医生诊断">
              <el-input
                v-model="diagnosisForm.diagnosis"
                type="textarea"
                :rows="3"
                placeholder="请输入医生诊断"
              />
            </el-form-item>
            <el-form-item label="建议">
              <el-input
                v-model="diagnosisForm.suggestion"
                type="textarea"
                :rows="3"
                placeholder="请输入建议"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <!-- 心电图区域 -->
      <el-card class="ecg-viewer-card">
        <template #header>
          <div class="card-header">
            <span>心电图</span>
          </div>
        </template>
        <div class="viewer-container">
          <EcgViewer :data="ecgData" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import EcgViewer from '@/components/EcgViewer.vue'
import { normalEcgData } from '@/data/normalEcgData'
import {
  ArrowLeft,
  Check
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 患者信息
const patientInfo = ref({
  name: '张三',
  gender: '男',
  age: 45,
  patientNo: 'P202401001',
  idCard: '310101197901011234',
  phone: '13800138000'
})

// 心电图数据（从路由参数获取）
const ecgData = ref(null)

// 判读表单
const diagnosisForm = ref({
  analysis: '',    // 分析结果
  diagnosis: '',   // 医生诊断
  suggestion: ''   // 建议
})

// 处理返回
const handleBack = () => {
  router.back()
}

// 处理保存
const handleSave = async () => {
  try {
    // TODO: 保存判读结果到后端
    ElMessage.success('保存成功')
    router.back()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

onMounted(async () => {
  // 从路由参数获取心电图ID
  const ecgId = route.params.id
  console.log('ECG ID:', ecgId)  // Log the ECG ID
  
  // 使用正常心电图测试数据
  await nextTick()
  ecgData.value = normalEcgData
  
  console.log('Loaded ECG Data:', ecgData.value)  // Log the loaded ECG data
})
</script>

<style scoped>
.ecg-diagnosis {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}

.action-bar {
  padding: 16px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.content-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.info-card,
.diagnosis-card {
  flex: 1;
  min-width: 400px;
}

.ecg-viewer-card {
  height: auto;
  width: 100%;
  margin-bottom: 16px;
}

.viewer-container {
  height: auto;
  width: 100%;
  overflow: visible;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card__body) {
  height: auto;
  padding: 10px;
  overflow: visible;
}

:deep(.el-descriptions) {
  padding: 8px 0;
}

:deep(.el-descriptions__label) {
  width: 100px;
  justify-content: flex-end;
}

:deep(.el-form) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__content) {
  height: auto;
}

:deep(.el-textarea) {
  height: auto;
}

:deep(.el-textarea__inner) {
  height: 150px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  resize: none;
}
</style> 