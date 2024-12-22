<template>
  <div class="ecg-detail">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>返回
      </el-button>
      <div class="action-buttons">
        <el-button type="primary" @click="handleDiagnosis">
          <el-icon><Edit /></el-icon>判读
        </el-button>
        <el-button type="success" @click="handleUpload">
          <el-icon><Upload /></el-icon>上传医共体
        </el-button>
        <el-button type="info" @click="handlePrint">
          <el-icon><Printer /></el-icon>打印
        </el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="detail-content">
      <!-- 患者信息卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>患者信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="患者姓名">{{ patientInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ patientInfo.gender }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ patientInfo.age }}岁</el-descriptions-item>
          <el-descriptions-item label="病历号">{{ patientInfo.patientNo }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ patientInfo.idCard }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ patientInfo.phone }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 设备信息卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>设备信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="设备编号">{{ deviceInfo.deviceNo }}</el-descriptions-item>
          <el-descriptions-item label="设备名称">{{ deviceInfo.deviceName }}</el-descriptions-item>
          <el-descriptions-item label="设备型号">{{ deviceInfo.model }}</el-descriptions-item>
          <el-descriptions-item label="检查时间">{{ deviceInfo.checkTime }}</el-descriptions-item>
          <el-descriptions-item label="检查医生">{{ deviceInfo.doctor }}</el-descriptions-item>
          <el-descriptions-item label="科室">{{ deviceInfo.department }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 医共体信息卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>医共体信息</span>
            <el-tag v-if="unionInfo.uploaded" type="success">已上传</el-tag>
            <el-tag v-else type="info">未上传</el-tag>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="上传状态">{{ unionInfo.uploaded ? '已上传' : '未上传' }}</el-descriptions-item>
          <el-descriptions-item label="上传时间">{{ unionInfo.uploadTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="上传人">{{ unionInfo.uploader || '-' }}</el-descriptions-item>
          <el-descriptions-item label="报告ID">{{ unionInfo.reportId || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- HIS检查信息卡片 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>HIS检查信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="检查号">{{ hisInfo.examNo }}</el-descriptions-item>
          <el-descriptions-item label="申请科室">{{ hisInfo.requestDept }}</el-descriptions-item>
          <el-descriptions-item label="申请医生">{{ hisInfo.requestDoctor }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ hisInfo.requestTime }}</el-descriptions-item>
          <el-descriptions-item label="临床诊断" :span="2">{{ hisInfo.diagnosis }}</el-descriptions-item>
          <el-descriptions-item label="检查目的" :span="2">{{ hisInfo.purpose }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 心电图查看器 -->
      <el-card class="info-card ecg-viewer">
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

    <!-- 使用判读组件 -->
    <EcgDiagnosis ref="diagnosisRef" @submit="handleSubmitDiagnosis" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import EcgDiagnosis from '@/components/EcgDiagnosis.vue'
import EcgViewer from '@/components/EcgViewer.vue'
import {
  ArrowLeft,
  Edit,
  Upload,
  Printer
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 判读组件引用
const diagnosisRef = ref(null)

// 患者信息
const patientInfo = ref({
  name: '张三',
  gender: '男',
  age: 45,
  patientNo: 'P202401001',
  idCard: '310101197901011234',
  phone: '13800138000'
})

// 设备信息
const deviceInfo = ref({
  deviceNo: 'ECG001',
  deviceName: '心电图机1号',
  model: 'ECG-1200G',
  checkTime: '2024-03-14 10:30:00',
  doctor: '李医生',
  department: '心内科'
})

// 医共体信息
const unionInfo = ref({
  uploaded: true,
  uploadTime: '2024-03-14 11:00:00',
  uploader: '张医生',
  reportId: 'R202403140001'
})

// HIS检查信息
const hisInfo = ref({
  examNo: 'E202403140001',
  requestDept: '心内科',
  requestDoctor: '王医生',
  requestTime: '2024-03-14 09:00:00',
  diagnosis: '疑似心肌缺血',
  purpose: '常规检查'
})

// 心电图数据（模拟数据）
const generateEcgData = () => {
  // 生成一个完整的PQRST波形周期
  const generatePQRSTCycle = () => {
    const cycle = []
    
    // P波（正弦波形状）
    for (let i = 0; i < 25; i++) {
      cycle.push(0.15 * Math.sin((i / 24) * Math.PI))
    }
    
    // PR段（基线）
    for (let i = 0; i < 10; i++) {
      cycle.push(0)
    }
    
    // QRS波群
    cycle.push(-0.2)  // Q波
    for (let i = 0; i < 5; i++) {  // R波（快速上升）
      cycle.push(1.8 * Math.pow(i/4, 2))
    }
    cycle.push(1.8)   // R波峰值
    for (let i = 4; i >= 0; i--) {  // R波（快速下降）
      cycle.push(1.8 * Math.pow(i/4, 2))
    }
    cycle.push(-0.5)  // S波
    for (let i = 4; i >= 0; i--) {  // S波回升
      cycle.push(-0.5 * Math.pow(i/4, 2))
    }
    
    // ST段（轻微上扬）
    for (let i = 0; i < 15; i++) {
      cycle.push(0.05)
    }
    
    // T波（非对称钟形曲线）
    for (let i = 0; i < 30; i++) {
      const x = i / 29
      cycle.push(0.3 * Math.exp(-Math.pow((x - 0.6) / 0.3, 2)))
    }
    
    // TP段（基线）
    for (let i = 0; i < 15; i++) {
      cycle.push(0)
    }
    
    return cycle
  }

  // 生成10秒的数据（假设心率75次/分，即每秒1.25个周期）
  const cyclesPerSecond = 1.25
  const durationInSeconds = 12
  const totalCycles = Math.ceil(cyclesPerSecond * durationInSeconds)
  
  // 生成基础数据
  const baseData = []
  for (let i = 0; i < totalCycles; i++) {
    baseData.push(...generatePQRSTCycle())
  }

  // 为每个导联生成稍微不同的数据
  const addNoise = (data, amplitude = 0.02) => {
    return data.map(v => v + (Math.random() - 0.5) * amplitude)
  }

  return {
    I: addNoise(baseData.map(v => v * 1.0)),
    II: addNoise(baseData.map(v => v * 1.2)),
    III: addNoise(baseData.map(v => v * 0.8)),
    aVR: addNoise(baseData.map(v => v * -0.5)),
    aVL: addNoise(baseData.map(v => v * 0.7)),
    aVF: addNoise(baseData.map(v => v * 0.9)),
    V1: addNoise(baseData.map(v => v * -1.2)),
    V2: addNoise(baseData.map(v => v * 1.8)),
    V3: addNoise(baseData.map(v => v * 1.5)),
    V4: addNoise(baseData.map(v => v * 1.2)),
    V5: addNoise(baseData.map(v => v * 0.9)),
    V6: addNoise(baseData.map(v => v * 0.7))
  }
}

const ecgData = ref(generateEcgData())

// 处理返回
const handleBack = () => {
  router.back()
}

// 处理判读
const handleDiagnosis = () => {
  router.push(`/ecg/${route.params.id}/diagnosis`)
}

// 处理提交判读
const handleSubmitDiagnosis = (data) => {
  // TODO: 提交判读结果到后端
  ElMessage.success('判读结果已提交')
}

// 处理上传医共体
const handleUpload = () => {
  ElMessage.success('开始上传到医共体')
}

// 处理打印
const handlePrint = () => {
  ElMessage.success('开始打印')
}

onMounted(() => {
  // 根据路由参数加载心电图数据
  const ecgId = route.params.id
  // TODO: 加载心电图数据
})
</script>

<style scoped>
.ecg-detail {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100vh;
  height: 100%;
  overflow-y: auto;
}

.action-bar {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.viewer-controls {
  display: flex;
  gap: 8px;
}

.ecg-viewer {
  flex: 1;
  min-height: 800px;
}

.viewer-container {
  height: 100%;
  min-height: 700px;
}

.ecg-placeholder {
  color: #909399;
  font-size: 14px;
}

:deep(.el-descriptions) {
  padding: 8px 0;
}

:deep(.el-descriptions__label) {
  width: 100px;
  justify-content: flex-end;
}
</style> 