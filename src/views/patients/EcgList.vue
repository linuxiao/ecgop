<template>
  <div class="ecg-list-page">
    <base-list-page
      ref="listPage"
      :search-form="searchForm"
      :selection="true"
      @search="handleSearch"
      @reset="handleReset"
      @selection-change="handleSelectionChange"
    >
      <!-- 工具栏 -->
      <template #toolbar>
        <el-button-group v-if="selectedRows.length > 0">
          <el-button type="primary" @click="handleBatchAnalyze">
            <el-icon><VideoPlay /></el-icon>批量分析
          </el-button>
          <el-button type="success" @click="handleBatchUpload">
            <el-icon><Upload /></el-icon>批量上传
          </el-button>
          <el-button type="warning" @click="handleBatchDownload">
            <el-icon><Download /></el-icon>批量下载
          </el-button>
        </el-button-group>
      </template>

      <!-- 查询表单 -->
      <template #search-items>
        <el-form-item label="患者姓名">
          <el-input v-model="searchForm.patientName" placeholder="请输入患者姓名" clearable />
        </el-form-item>
        <el-form-item label="检查时间">
          <el-date-picker
            v-model="searchForm.examTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待分析" value="pending" />
            <el-option label="分析中" value="analyzing" />
            <el-option label="已完成" value="completed" />
            <el-option label="异常" value="error" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 表格列 -->
      <el-table-column prop="ecgId" label="心电图ID" width="150">
        <template #default="{ row }">
          <el-link type="primary" @click="handleViewDetail(row)">{{ row.ecgId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="examTime" label="检查时间" width="160" sortable />
      <el-table-column prop="patientName" label="患者姓名" width="120">
        <template #default="{ row }">
          <el-link type="primary" @click="handleViewPatient(row)">{{ row.patientName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="patientNo" label="患者编号" width="120" />
      <el-table-column prop="deviceNo" label="设备编号" width="120" />
      <el-table-column prop="examDoctor" label="检查医生" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <el-button-group>
            <el-button size="small" type="primary" @click="handleViewDetail(row)">
              <el-icon><View /></el-icon>查看
            </el-button>
            <el-button size="small" type="success" @click="handleAnalyze(row)" :disabled="row.status === 'analyzing'">
              <el-icon><VideoPlay /></el-icon>分析
            </el-button>
            <el-button size="small" type="warning" @click="handleUpload(row)" :disabled="row.status !== 'completed'">
              <el-icon><Upload /></el-icon>上传
            </el-button>
            <el-button size="small" @click="handleDownload(row)">
              <el-icon><Download /></el-icon>下载
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="分析结果" min-width="200" show-overflow-tooltip />
    </base-list-page>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { VideoPlay, Upload, Download, View, ArrowDown } from '@element-plus/icons-vue'
import BaseListPage from '@/components/BaseListPage.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const listPage = ref(null)
const selectedRows = ref([])

// 搜索表单
const searchForm = reactive({
  patientName: '',
  examTime: [],
  status: ''
})

// 获取状态类型
const getStatusType = (status) => {
  const map = {
    'pending': 'info',
    'analyzing': 'warning',
    'completed': 'success',
    'error': 'danger'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const map = {
    'pending': '待分析',
    'analyzing': '分析中',
    'completed': '已完成',
    'error': '异常'
  }
  return map[status] || status
}

// 处理搜索
const handleSearch = (form) => {
  if (!listPage.value) return
  
  listPage.value.loading = true
  setTimeout(() => {
    // 模拟API调用
    listPage.value.tableData = [
      {
        ecgId: 'ECG202403140001',
        examTime: '2024-03-14 15:30:00',
        patientName: '张三',
        patientId: 'P001',
        patientNo: 'P001',
        deviceNo: 'ECG001',
        examDoctor: '李医生',
        status: 'completed',
        result: '窦性心律,心率75次/分钟'
      },
      {
        ecgId: 'ECG202403140002',
        examTime: '2024-03-14 14:20:00',
        patientName: '李四',
        patientId: 'P002',
        patientNo: 'P002',
        deviceNo: 'ECG002',
        examDoctor: '王医生',
        status: 'analyzing',
        result: '分析中...'
      }
    ].filter(item => {
      const matchName = !form.patientName || item.patientName.includes(form.patientName)
      const matchStatus = !form.status || item.status === form.status
      return matchName && matchStatus
    })
    listPage.value.total = listPage.value.tableData.length
    listPage.value.loading = false
  }, 500)
}

// 处理重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = key === 'examTime' ? [] : ''
  })
  handleSearch(searchForm)
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 处理查看详情
const handleViewDetail = (row) => {
  router.push(`/ecg/${row.ecgId}`)
}

// 单个操作处理函数
const handleAnalyze = (row) => {
  ElMessage.success(`开始分析: ${row.ecgId}`)
}

const handleUpload = (row) => {
  ElMessage.success(`开始上传: ${row.ecgId}`)
}

const handleDownload = (row) => {
  ElMessage.success(`开始下载: ${row.ecgId}`)
}

// 批量操作处理函数
const handleBatchAnalyze = () => {
  ElMessage.success(`批量分析 ${selectedRows.value.length} 条记录`)
}

const handleBatchUpload = () => {
  ElMessage.success(`批量上传 ${selectedRows.value.length} 条记录`)
}

const handleBatchDownload = () => {
  ElMessage.success(`批量下载 ${selectedRows.value.length} 条记录`)
}

// 处理查看患者详情
const handleViewPatient = (row) => {
  router.push({
    name: 'PatientDetail',
    params: { id: row.patientId }
  })
}

// 在组件挂载时加载数据
onMounted(() => {
  handleSearch(searchForm)
})
</script>

<style scoped>
.ecg-list-page {
  height: 100%;
  padding: 8px;
  background-color: #f0f2f5;
}

:deep(.el-select) {
  width: 180px;
}

:deep(.el-date-editor.el-input__wrapper) {
  width: 360px;
}

:deep(.el-button-group .el-button--small) {
  padding: 5px 8px;
}

:deep(.el-table .cell) {
  white-space: nowrap;
}
</style> 