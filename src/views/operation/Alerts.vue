<template>
  <div class="alerts">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">告警管理</span>
          <div class="actions">
            <el-button type="primary" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :model="searchForm" inline>
        <el-form-item label="告警编号">
          <el-input v-model="searchForm.alertNo" placeholder="请输入告警编号" clearable />
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="searchForm.deviceNo" placeholder="请输入设备编号" clearable />
        </el-form-item>
        <el-form-item label="告警类型">
          <el-select v-model="searchForm.alertType" placeholder="请选择告警类型" clearable>
            <el-option label="设备离线" value="offline" />
            <el-option label="设备故障" value="fault" />
            <el-option label="数据异常" value="data" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 告警列表 -->
      <el-table
        :data="alertList"
        style="width: 100%"
        @row-click="handleRowClick"
      >
        <el-table-column prop="alertNo" label="告警编号" min-width="120">
          <template #default="{ row }">
            <el-link type="primary" @click.stop="handleViewDetail(row)">
              {{ row.alertNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="alertTime" label="告警时间" min-width="160" />
        <el-table-column prop="alertType" label="告警类型" min-width="120" />
        <el-table-column prop="level" label="告警级别" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deviceNo" label="设备编号" min-width="120">
          <template #default="{ row }">
            <el-link type="primary" @click.stop="handleViewDevice(row)">
              {{ row.deviceNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="告警内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              type="primary"
              link
              @click.stop="handleProcess(row)"
            >
              处理
            </el-button>
            <el-button
              type="primary"
              link
              @click.stop="handleViewDetail(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const router = useRouter()

// 搜索表单
const searchForm = ref({
  alertNo: '',
  deviceNo: '',
  alertType: '',
  status: ''
})

// 告警列表数据
const alertList = ref([
  {
    alertNo: 'A202401001',
    alertTime: '2024-03-14 09:30:00',
    alertType: '设备离线',
    level: '严重',
    deviceNo: 'ECG001',
    content: '设备已离线超过30分钟，请检查网络连接状态',
    status: 'pending'
  },
  {
    alertNo: 'A202401002',
    alertTime: '2024-03-14 10:15:00',
    alertType: '数据异常',
    level: '警告',
    deviceNo: 'ECG002',
    content: '心电数据采集异常，请检查设备状态',
    status: 'processing'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 获取告警级别对应的标签类型
const getLevelType = (level) => {
  const map = {
    '严重': 'danger',
    '警告': 'warning',
    '提示': 'info'
  }
  return map[level] || 'info'
}

// 获取状态对应的标签类型
const getStatusType = (status) => {
  const map = {
    'pending': 'danger',
    'processing': 'warning',
    'resolved': 'success',
    'closed': 'info'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const map = {
    'pending': '待处理',
    'processing': '处理中',
    'resolved': '已解决',
    'closed': '已关闭'
  }
  return map[status] || status
}

// 查询
const handleSearch = () => {
  // TODO: 实现查询逻辑
  console.log('Search form:', searchForm.value)
}

// 重置
const handleReset = () => {
  searchForm.value = {
    alertNo: '',
    deviceNo: '',
    alertType: '',
    status: ''
  }
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  // TODO: 实现刷新逻辑
  ElMessage.success('刷新成功')
}

// 处理告警
const handleProcess = (row) => {
  router.push(`/alerts/${row.alertNo}`)
}

// 查看详情
const handleViewDetail = (row) => {
  router.push(`/alerts/${row.alertNo}`)
}

// 查看设备
const handleViewDevice = (row) => {
  router.push(`/devices/ecg/${row.deviceNo}`)
}

// 点击行
const handleRowClick = (row) => {
  handleViewDetail(row)
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}
</script>

<style scoped>
.alerts {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100vh;
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

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style> 