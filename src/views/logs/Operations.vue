<template>
  <div class="operations-page">
    <base-list-page
      ref="listPage"
      :search-form="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    >
      <!-- 查询表单 -->
      <template #search-items>
        <el-form-item label="操作类型">
          <el-select v-model="searchForm.operationType" placeholder="请选择操作类型" clearable>
            <el-option label="设备维护" value="设备维护" />
            <el-option label="故障维修" value="故障维修" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="searchForm.operator" placeholder="请输入操作人" clearable />
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="searchForm.deviceNo" placeholder="请输入设备编号" clearable />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </template>

      <!-- 表格列 -->
      <el-table-column prop="operationType" label="操作类型" />
      <el-table-column prop="operator" label="操作人" />
      <el-table-column prop="operationTime" label="操作时间" />
      <el-table-column prop="deviceNo" label="设备编号" />
      <el-table-column prop="content" label="操作内容" show-overflow-tooltip />
      <el-table-column prop="result" label="操作结果">
        <template #default="{ row }">
          <el-tag :type="row.result === '正常' || row.result === '已修复' ? 'success' : 'warning'">
            {{ row.result }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 额外的下拉操作 -->
      <template #dropdown-items="{ row }">
        <el-dropdown-item command="viewDetail">查看详情</el-dropdown-item>
      </template>
    </base-list-page>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="日志详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="操作类型">{{ currentLog.operationType }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ currentLog.operator }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ currentLog.operationTime }}</el-descriptions-item>
        <el-descriptions-item label="设备编号">{{ currentLog.deviceNo }}</el-descriptions-item>
        <el-descriptions-item label="操作内容" :span="2">{{ currentLog.content }}</el-descriptions-item>
        <el-descriptions-item label="操作结果">
          <el-tag :type="currentLog.result === '正常' || currentLog.result === '已修复' ? 'success' : 'warning'">
            {{ currentLog.result }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseListPage from '../../components/BaseListPage.vue'
import { operationLogList } from '@/data/mockData'

const listPage = ref(null)
const detailVisible = ref(false)
const currentLog = ref({})

// 搜索表单
const searchForm = reactive({
  operationType: '',
  operator: '',
  deviceNo: '',
  timeRange: []
})

// 处理搜索
const handleSearch = (form) => {
  if (!listPage.value) return
  
  listPage.value.loading = true
  setTimeout(() => {
    listPage.value.tableData = operationLogList.filter(item => {
      const matchOperationType = !form.operationType || item.operationType === form.operationType
      const matchOperator = !form.operator || item.operator.includes(form.operator)
      const matchDeviceNo = !form.deviceNo || item.deviceNo.includes(form.deviceNo)
      return matchOperationType && matchOperator && matchDeviceNo
    })
    listPage.value.total = listPage.value.tableData.length
    listPage.value.loading = false
  }, 500)
}

// 处理重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = key === 'timeRange' ? [] : ''
  })
  handleSearch(searchForm)
}

// 处理查看详情
const handleCommand = ({ command, row }) => {
  if (command === 'viewDetail') {
    currentLog.value = row
    detailVisible.value = true
  }
}

onMounted(() => {
  handleSearch(searchForm)
})
</script>

<style scoped>
.operations-page {
  height: 100%;
  padding: 8px;
  background-color: #f0f2f5;
}

:deep(.status-item) {
  min-width: 120px;
}

:deep(.status-item .el-select) {
  width: 100%;
}
</style> 