<template>
  <div class="operation-logs-page">
    <base-list-page
      ref="listPage"
      :search-form="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    >
      <!-- 查询表单 -->
      <template #search-items>
        <div class="search-form-wrapper">
          <div class="search-row">
            <el-form-item label="操作类型">
              <el-select v-model="searchForm.operationType" placeholder="请选择操作类型" clearable>
                <el-option label="设备维护" value="设备维护" />
                <el-option label="故障维修" value="故障维修" />
                <el-option label="设备检查" value="设备检查" />
                <el-option label="设备配置" value="设备配置" />
              </el-select>
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
          </div>
        </div>
      </template>

      <!-- 表格列 -->
      <el-table-column prop="operationType" label="操作类型" width="120">
        <template #default="{ row }">
          <el-tag
            :type="getOperationTypeTag(row.operationType)"
            effect="plain"
          >
            {{ row.operationType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operationTime" label="操作时间" width="180" />
      <el-table-column prop="deviceNo" label="设备编号" width="120" />
      <el-table-column prop="deviceName" label="设备名称" width="150" />
      <el-table-column prop="content" label="操作内容" min-width="300" show-overflow-tooltip />
      <el-table-column prop="result" label="操作结果" width="100">
        <template #default="{ row }">
          <el-tag :type="getResultTag(row.result)">
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
      title="操作详情"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getOperationTypeTag(currentLog.operationType)" effect="plain">
            {{ currentLog.operationType }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ currentLog.operationTime }}</el-descriptions-item>
        <el-descriptions-item label="设备编号">{{ currentLog.deviceNo }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ currentLog.deviceName }}</el-descriptions-item>
        <el-descriptions-item label="操作结果">
          <el-tag :type="getResultTag(currentLog.result)">
            {{ currentLog.result }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作内容" :span="2">{{ currentLog.content }}</el-descriptions-item>
        <el-descriptions-item label="备注信息" :span="2">{{ currentLog.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item v-if="currentLog.images?.length" label="相关图片" :span="2">
          <el-image
            v-for="(img, index) in currentLog.images"
            :key="index"
            :src="img"
            :preview-src-list="currentLog.images"
            fit="cover"
            class="operation-image"
          />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseListPage from '../../components/BaseListPage.vue'

const listPage = ref(null)
const detailVisible = ref(false)
const currentLog = ref({})

// 搜索表单
const searchForm = reactive({
  operationType: '',
  deviceNo: '',
  timeRange: []
})

// 模拟运维日志数据
const operationLogs = [
  {
    id: 1,
    operationType: '设备维护',
    operator: '张工程师',
    operationTime: '2024-03-14 09:00:00',
    deviceNo: 'ECG001',
    deviceName: '心电图机1号',
    content: '完成常规维护检查，更换传感器',
    result: '正常',
    remark: '建议��个月后进行下次维护',
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ]
  },
  {
    id: 2,
    operationType: '故障维修',
    operator: '李工���师',
    operationTime: '2024-03-14 14:00:00',
    deviceNo: 'ECG002',
    deviceName: '心电图机2号',
    content: '处理设备无法开机问题，更换电源模块',
    result: '已修复',
    remark: '建议关注电源模块使用情况'
  },
  {
    id: 3,
    operationType: '设备检查',
    operator: '王工程师',
    operationTime: '2024-03-14 16:00:00',
    deviceNo: 'ECG003',
    deviceName: '心电图机3号',
    content: '进行设备定期检查',
    result: '异常',
    remark: '发现数据传输异常，需要进一步检查'
  }
]

// 处理搜索
const handleSearch = (form) => {
  if (!listPage.value) return
  
  listPage.value.loading = true
  setTimeout(() => {
    listPage.value.tableData = operationLogs.filter(item => {
      const matchOperationType = !form.operationType || item.operationType === form.operationType
      const matchDeviceNo = !form.deviceNo || item.deviceNo.includes(form.deviceNo)
      return matchOperationType && matchDeviceNo
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

// 获取操作类型对应的标签类型
const getOperationTypeTag = (type) => {
  const map = {
    '设备维护': 'success',
    '故障维修': 'danger',
    '设备检查': 'warning',
    '设备配置': 'info'
  }
  return map[type] || 'info'
}

// 获取操作结果对应的标签类型
const getResultTag = (result) => {
  const map = {
    '正常': 'success',
    '已修复': 'success',
    '异常': 'danger',
    '未修复': 'danger',
    '处理中': 'warning'
  }
  return map[result] || 'info'
}

onMounted(() => {
  handleSearch(searchForm)
})
</script>

<style scoped>
.operation-logs-page {
  height: 100%;
  padding: 8px;
  background-color: #f0f2f5;
}

/* 搜索表单布局 */
.search-form-wrapper {
  display: inline-flex;
  align-items: flex-start;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
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

.operation-image {
  width: 100px;
  height: 100px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
}

:deep(.el-descriptions__cell) {
  padding: 12px !important;
}

/* 调整日期选择器的宽度 */
:deep(.el-date-editor.el-input__wrapper) {
  width: 360px;
}
</style> 