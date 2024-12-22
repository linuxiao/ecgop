<template>
  <div class="records-page">
    <base-list-page
      ref="listPage"
      :search-form="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    >
      <!-- 查询表单 -->
      <template #search-items>
        <el-form-item label="患者编号">
          <el-input v-model="searchForm.patientNo" placeholder="请输入患者编号" clearable />
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input v-model="searchForm.patientName" placeholder="请输入患者姓名" clearable />
        </el-form-item>
        <el-form-item label="就诊时间">
          <el-date-picker
            v-model="searchForm.visitTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </template>

      <!-- 表格列 -->
      <el-table-column prop="visitNo" label="就诊编号" width="120">
        <template #default="{ row }">
          <el-link type="primary" @click="handleVisitDetail(row)">{{ row.visitNo }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="patientNo" label="患者编号" width="120" />
      <el-table-column prop="patientName" label="患者姓名" width="100">
        <template #default="{ row }">
          <el-link type="primary" @click="handlePatientDetail(row)">{{ row.patientName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="visitTime" label="就诊时间" width="120" />
      <el-table-column prop="department" label="就诊科室" width="120" />
      <el-table-column prop="doctor" label="主治医生" width="100" />
      <el-table-column prop="diagnosis" label="诊断结果" min-width="200" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 额外的下拉操作 -->
      <template #dropdown-items="{ row }">
        <el-dropdown-item command="viewDetail">查看详情</el-dropdown-item>
        <el-dropdown-item command="viewEcg">心电图记录</el-dropdown-item>
      </template>
    </base-list-page>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="就诊详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="就诊编号">{{ currentRecord.visitNo }}</el-descriptions-item>
        <el-descriptions-item label="就诊时间">{{ currentRecord.visitTime }}</el-descriptions-item>
        <el-descriptions-item label="患者编号">{{ currentRecord.patientNo }}</el-descriptions-item>
        <el-descriptions-item label="患者姓名">{{ currentRecord.patientName }}</el-descriptions-item>
        <el-descriptions-item label="就诊科室">{{ currentRecord.department }}</el-descriptions-item>
        <el-descriptions-item label="主治医生">{{ currentRecord.doctor }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRecord.status)">
            {{ currentRecord.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="挂号费用">{{ currentRecord.fee }}元</el-descriptions-item>
        <el-descriptions-item label="主诉" :span="2">{{ currentRecord.complaint }}</el-descriptions-item>
        <el-descriptions-item label="诊断结果" :span="2">{{ currentRecord.diagnosis }}</el-descriptions-item>
        <el-descriptions-item label="处理意见" :span="2">{{ currentRecord.treatment }}</el-descriptions-item>
        <el-descriptions-item label="医嘱" :span="2">{{ currentRecord.advice }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseListPage from '../../components/BaseListPage.vue'
import { useRouter } from 'vue-router'

const listPage = ref(null)
const detailVisible = ref(false)
const currentRecord = ref({})
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  patientNo: '',
  patientName: '',
  visitTime: []
})

// 模拟就诊记录数据
const visitRecords = [
  {
    id: 1,
    visitNo: 'V202401001',
    patientNo: 'P202401001',
    patientName: '张三',
    visitTime: '2024-03-10',
    department: '心内科',
    doctor: '李医生',
    diagnosis: '冠心病，需要进一步检查',
    status: '已完成',
    fee: 50,
    complaint: '胸闷、气短，持续一周',
    treatment: '建议进行心电图检查和血常规检查',
    advice: '注意休息，避免剧烈运动'
  },
  {
    id: 2,
    visitNo: 'V202401002',
    patientNo: 'P202401002',
    patientName: '李四',
    visitTime: '2024-03-12',
    department: '心内科',
    doctor: '王医生',
    diagnosis: '心律不齐，需要定期监测',
    status: '随访中',
    fee: 50,
    complaint: '心慌、心跳不规则',
    treatment: '进行24小时动态心电图监测',
    advice: '按时服药，定期复查'
  }
]

// 处理搜索
const handleSearch = (form) => {
  if (!listPage.value) return
  
  listPage.value.loading = true
  setTimeout(() => {
    listPage.value.tableData = visitRecords.filter(item => {
      const matchPatientNo = !form.patientNo || item.patientNo.includes(form.patientNo)
      const matchPatientName = !form.patientName || item.patientName.includes(form.patientName)
      return matchPatientNo && matchPatientName
    })
    listPage.value.total = listPage.value.tableData.length
    listPage.value.loading = false
  }, 500)
}

// 处理重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = key === 'visitTime' ? [] : ''
  })
  handleSearch(searchForm)
}

// 处理查看详情
const handleCommand = ({ command, row }) => {
  if (command === 'viewDetail') {
    currentRecord.value = row
    detailVisible.value = true
  }
}

// 获取状态对应的标签类型
const getStatusType = (status) => {
  const map = {
    '已完成': 'success',
    '随访中': 'warning',
    '待就诊': 'info',
    '已取消': 'danger'
  }
  return map[status] || 'info'
}

// 处理就诊详情点击
const handleVisitDetail = (row) => {
  router.push(`/visits/${row.visitNo}`)
}

// 处理患者详情点击
const handlePatientDetail = (row) => {
  router.push(`/patients/${row.patientNo}`)
}

onMounted(() => {
  handleSearch(searchForm)
})
</script>

<style scoped>
.records-page {
  height: 100%;
  padding: 8px;
  background-color: #f0f2f5;
}

/* 调整表单项的间距和宽度 */
:deep(.el-form-item) {
  margin-bottom: 8px;
  margin-right: 16px;
}

:deep(.el-form-item:last-child) {
  margin-right: 0;
}

:deep(.el-select) {
  width: 180px;
}

:deep(.el-input) {
  width: 180px;
}

/* 表格容器样式 */
:deep(.el-table) {
  width: 100%;
  height: calc(100% - 80px);
}

/* 确保表格内容不会被截断 */
:deep(.el-table__body-wrapper) {
  overflow-x: auto;
}

/* 调整标签的样式，防止换行 */
:deep(.el-tag) {
  white-space: nowrap;
}

:deep(.el-descriptions__cell) {
  padding: 12px !important;
}

/* 调整日期选择器的宽度 */
:deep(.el-date-editor.el-input__wrapper) {
  width: 260px;
}
</style> 