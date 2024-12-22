<template>
  <div class="his-logs-page">
    <base-list-page
      ref="listPage"
      :search-form="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    >
      <!-- 查询表单 -->
      <template #search-items>
        <el-form-item label="接口名称">
          <el-input v-model="searchForm.interfaceName" placeholder="请输入接口名称" clearable />
        </el-form-item>
        <el-form-item label="状态" class="status-item">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="成功" value="成功" />
            <el-option label="失败" value="失败" />
          </el-select>
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
      <el-table-column prop="interfaceName" label="接口名称" />
      <el-table-column prop="requestTime" label="请求时间" />
      <el-table-column prop="responseTime" label="响应时间" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '成功' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="errorMsg" label="错误信息" show-overflow-tooltip />
      <el-table-column prop="requestData" label="请求数据" show-overflow-tooltip />
      <el-table-column prop="responseData" label="响应数据" show-overflow-tooltip />

      <!-- 额外的下拉操作 -->
      <template #dropdown-items="{ row }">
        <el-dropdown-item command="viewDetail">查看详情</el-dropdown-item>
      </template>
    </base-list-page>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="日志详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="接口名称">{{ currentLog.interfaceName }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentLog.status === '成功' ? 'success' : 'danger'">
            {{ currentLog.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="请求时间">{{ currentLog.requestTime }}</el-descriptions-item>
        <el-descriptions-item label="响应时间">{{ currentLog.responseTime }}</el-descriptions-item>
        <el-descriptions-item label="错误信息" :span="2">{{ currentLog.errorMsg || '-' }}</el-descriptions-item>
        <el-descriptions-item label="请求数据" :span="2">
          <pre>{{ formatJson(currentLog.requestData) }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="响应数据" :span="2">
          <pre>{{ formatJson(currentLog.responseData) }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BaseListPage from '../../components/BaseListPage.vue'
import { hisLogList } from '@/data/mockData'

const listPage = ref(null)
const detailVisible = ref(false)
const currentLog = ref({})

// 搜索表单
const searchForm = reactive({
  interfaceName: '',
  status: '',
  timeRange: []
})

// 处理搜索
const handleSearch = (form) => {
  if (!listPage.value) return
  
  listPage.value.loading = true
  setTimeout(() => {
    listPage.value.tableData = hisLogList.filter(item => {
      const matchInterfaceName = !form.interfaceName || item.interfaceName.includes(form.interfaceName)
      const matchStatus = !form.status || item.status === form.status
      return matchInterfaceName && matchStatus
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

// 格式化 JSON 字符串
const formatJson = (str) => {
  if (!str) return '-'
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch (e) {
    return str
  }
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
.his-logs-page {
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

pre {
  margin: 0;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style> 