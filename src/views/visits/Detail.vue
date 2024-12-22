<template>
  <div class="visit-detail">
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span class="title">就诊详情</span>
          <div class="actions">
            <el-button type="primary" @click="handleStartEcg" :disabled="!canStartEcg">
              开始心电检查
            </el-button>
            <el-button @click="$router.back()">返回</el-button>
          </div>
        </div>
      </template>

      <!-- 基本信息 -->
      <el-descriptions title="基本信息" :column="3" border>
        <el-descriptions-item label="就诊编号">{{ visitDetail.visitNo }}</el-descriptions-item>
        <el-descriptions-item label="就诊时间">{{ visitDetail.visitTime }}</el-descriptions-item>
        <el-descriptions-item label="就诊状态">
          <el-tag :type="getStatusType(visitDetail.status)">
            {{ visitDetail.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="患者编号">
          <el-link type="primary" @click="handleViewPatient">{{ visitDetail.patientNo }}</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="患者姓名">{{ visitDetail.patientName }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ visitDetail.gender }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ visitDetail.age }}岁</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ visitDetail.phone }}</el-descriptions-item>
        <el-descriptions-item label="医保类型">{{ visitDetail.insuranceType }}</el-descriptions-item>
      </el-descriptions>

      <!-- 就诊信息 -->
      <el-descriptions title="就诊信息" :column="2" border class="mt-16">
        <el-descriptions-item label="就诊科室">{{ visitDetail.department }}</el-descriptions-item>
        <el-descriptions-item label="主治医生">{{ visitDetail.doctor }}</el-descriptions-item>
        <el-descriptions-item label="主诉" :span="2">{{ visitDetail.complaint }}</el-descriptions-item>
        <el-descriptions-item label="现病史" :span="2">{{ visitDetail.presentIllness }}</el-descriptions-item>
        <el-descriptions-item label="既往史" :span="2">{{ visitDetail.pastHistory }}</el-descriptions-item>
        <el-descriptions-item label="诊断结果" :span="2">{{ visitDetail.diagnosis }}</el-descriptions-item>
        <el-descriptions-item label="处理意见" :span="2">{{ visitDetail.treatment }}</el-descriptions-item>
        <el-descriptions-item label="���嘱" :span="2">{{ visitDetail.advice }}</el-descriptions-item>
      </el-descriptions>

      <!-- 检查记录 -->
      <div class="section mt-16">
        <div class="section-header">
          <h3>检查记录</h3>
        </div>
        <el-table :data="examRecords" border style="width: 100%">
          <el-table-column prop="examNo" label="检查编号" width="120">
            <template #default="{ row }">
              <el-link type="primary" @click="handleViewExam(row)">{{ row.examNo }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="examType" label="检查类型" width="120" />
          <el-table-column prop="examTime" label="检查时间" width="160" />
          <el-table-column prop="device" label="检查设备" width="120" />
          <el-table-column prop="doctor" label="检查医生" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getExamStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="result" label="检查结果" min-width="200" show-overflow-tooltip />
        </el-table>
      </div>

      <!-- 处方信�� -->
      <div class="section mt-16">
        <div class="section-header">
          <h3>处方信息</h3>
        </div>
        <el-table :data="prescriptions" border style="width: 100%">
          <el-table-column prop="prescriptionNo" label="处方编号" width="120" />
          <el-table-column prop="medicineType" label="药品类型" width="100" />
          <el-table-column prop="medicineName" label="药品名称" min-width="200" />
          <el-table-column prop="specification" label="规格" width="120" />
          <el-table-column prop="dosage" label="用量" width="100" />
          <el-table-column prop="frequency" label="频次" width="100" />
          <el-table-column prop="duration" label="疗程" width="100" />
          <el-table-column prop="notes" label="备注" min-width="150" show-overflow-tooltip />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const visitNo = route.params.visitNo

// 就诊详情数据
const visitDetail = ref({
  visitNo: 'V202401001',
  visitTime: '2024-03-14 09:30:00',
  status: '已完成',
  patientNo: 'P202401001',
  patientName: '张三',
  gender: '男',
  age: 45,
  phone: '13800138000',
  insuranceType: '城镇职工医保',
  department: '心内科',
  doctor: '李医生',
  complaint: '胸闷、气短，持续一周',
  presentIllness: '患者一周前无明显诱因出现胸闷、气短，活动后加重，休息后可缓解，伴有心慌、出汗等症状',
  pastHistory: '高血压病史5年，长期服用降压药物',
  diagnosis: '1. 冠心病 2. 高血压 3级 极高危',
  treatment: '建议进行心电图检查和血常规检查，必要时进行冠脉造影',
  advice: '1. 注意休息，避免剧烈运动\n2. 规律服药\n3. 定期复查'
})

// 检查记录数据
const examRecords = ref([
  {
    examNo: 'E202401001',
    examType: '心电图',
    examTime: '2024-03-14 10:00:00',
    device: 'ECG001',
    doctor: '王医生',
    status: '已完成',
    result: '窦性心律，心电轴正常，ST-T改变'
  }
])

// 处方信息数据
const prescriptions = ref([
  {
    prescriptionNo: 'P202401001',
    medicineType: '西药',
    medicineName: '硝酸甘油片',
    specification: '0.5mg*50片/盒',
    dosage: '0.5mg',
    frequency: '每日3次',
    duration: '2周',
    notes: '餐前服用'
  }
])

// 是否可以开始心电检查
const canStartEcg = computed(() => {
  return visitDetail.value.status === '进行中'
})

// 获取状态对应的标签类型
const getStatusType = (status) => {
  const map = {
    '已完成': 'success',
    '进行中': 'warning',
    '待就诊': 'info',
    '已取消': 'danger'
  }
  return map[status] || 'info'
}

// 获取检查状态对应的标签类型
const getExamStatusType = (status) => {
  const map = {
    '已完成': 'success',
    '进行中': 'warning',
    '待检查': 'info',
    '已取消': 'danger'
  }
  return map[status] || 'info'
}

// 查看患者详情
const handleViewPatient = () => {
  router.push(`/patients/${visitDetail.value.patientNo}`)
}

// 查看检查详情
const handleViewExam = (exam) => {
  if (exam.examType === '心电图') {
    router.push(`/ecg/${exam.examNo}`)
  } else {
    ElMessage.info('暂不支持查看该类型检查详情')
  }
}

// 开始心电检查
const handleStartEcg = () => {
  ElMessage.success('开始心电检查')
  // TODO: 跳转到心电检查页面或打开心电检查对话框
}

// 加载就诊详情数据
const loadVisitDetail = async () => {
  // TODO: 从后端加载就诊详情数据
  console.log('Loading visit detail for:', visitNo)
}

// 页面加载时获取数据
loadVisitDetail()
</script>

<style scoped>
.visit-detail {
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

:deep(.el-table .cell) {
  white-space: nowrap;
}
</style> 