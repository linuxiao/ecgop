<template>
  <div class="ecg-records-page">
    <base-list-page
      ref="listPage"
      :search-form="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    >
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
      <el-table-column prop="examTime" label="检查时间" width="160" />
      <el-table-column prop="patientName" label="患者姓名" width="120" />
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
      <el-table-column prop="result" label="分析结果" min-width="200" show-overflow-tooltip />

      <!-- 额外的下拉操作 -->
      <template #dropdown-items="{ row }">
        <el-dropdown-item command="view">查看心电图</el-dropdown-item>
        <el-dropdown-item command="analyze">分析报告</el-dropdown-item>
        <el-dropdown-item command="download">下载数据</el-dropdown-item>
      </template>
    </base-list-page>

    <!-- 心电图查看对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="心电图查看"
      width="80%"
      :destroy-on-close="true"
    >
      <div class="ecg-viewer">
        <div class="ecg-placeholder">
          心电图查看器
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import BaseListPage from '@/components/BaseListPage.vue'

const listPage = ref(null)
const viewDialogVisible = ref(false)

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
        examTime: '2024-03-14 15:30:00',
        patientName: '张三',
        patientNo: 'P001',
        deviceNo: 'ECG001',
        examDoctor: '李医生',
        status: 'completed',
        result: '窦性心律,心率75次/分钟'
      },
      {
        examTime: '2024-03-14 14:20:00',
        patientName: '李四',
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

// 处理操作命令
const handleCommand = ({ command, row }) => {
  switch (command) {
    case 'view':
      viewDialogVisible.value = true
      break
    case 'analyze':
      ElMessage.success('查看分析报告')
      break
    case 'download':
      ElMessage.success('下载数据')
      break
  }
}

// 在组件挂载时加载数据
onMounted(() => {
  handleSearch(searchForm)
})

defineComponent({
  name: 'EcgRecords'
})
</script>

<style scoped>
.ecg-records-page {
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

.ecg-viewer {
  height: 600px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ecg-placeholder {
  font-size: 24px;
  color: #909399;
}
</style> 