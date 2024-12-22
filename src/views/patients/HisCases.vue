<template>
  <div class="his-cases-page">
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
        <el-form-item label="开单时间">
          <el-date-picker
            v-model="searchForm.orderTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待检查" value="pending" />
            <el-option label="已检查" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 表格列 -->
      <el-table-column prop="orderTime" label="开单时间" width="160" />
      <el-table-column prop="patientName" label="患者姓名" width="120" />
      <el-table-column prop="patientNo" label="患者编号" width="120" />
      <el-table-column prop="orderNo" label="开单号" width="120">
        <template #default="{ row }">
          <el-link type="primary" @click="handleViewDetail(row)">{{ row.orderNo }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="orderDoctor" label="开单医生" width="120" />
      <el-table-column prop="department" label="科室" width="120" />
      <el-table-column prop="examItem" label="检查项目" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />

      <!-- 额外的下拉操作 -->
      <template #dropdown-items="{ row }">
        <el-dropdown-item command="view">查看详情</el-dropdown-item>
        <el-dropdown-item command="print">打印单据</el-dropdown-item>
      </template>
    </base-list-page>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BaseListPage from '@/components/BaseListPage.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const listPage = ref(null)

// 搜索表单
const searchForm = reactive({
  patientName: '',
  orderTime: [],
  status: ''
})

// 获取状态类型
const getStatusType = (status) => {
  const map = {
    'pending': 'warning',
    'completed': 'success',
    'cancelled': 'info'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const map = {
    'pending': '待检查',
    'completed': '已检查',
    'cancelled': '已取消'
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
        orderTime: '2024-03-14 15:30:00',
        patientName: '张三',
        patientNo: 'P001',
        orderNo: 'O001',
        orderDoctor: '李医生',
        department: '心内科',
        examItem: '十二导联心电图',
        status: 'pending',
        remark: '常规检查'
      },
      {
        orderTime: '2024-03-14 14:20:00',
        patientName: '李四',
        patientNo: 'P002',
        orderNo: 'O002',
        orderDoctor: '王医生',
        department: '急诊科',
        examItem: '十二导联心电图',
        status: 'completed',
        remark: '急诊检查'
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
    searchForm[key] = key === 'orderTime' ? [] : ''
  })
  handleSearch(searchForm)
}

// 在组件挂载时加载数据
onMounted(() => {
  handleSearch(searchForm)
})

// 处理操作命令
const handleCommand = ({ command, row }) => {
  switch (command) {
    case 'view':
      router.push(`/his-cases/${row.orderNo}`)
      break
    case 'print':
      ElMessage.success('打印单据')
      break
  }
}

// 查看详情
const handleViewDetail = (row) => {
  router.push(`/his-cases/${row.orderNo}`)
}
</script>

<style scoped>
.his-cases-page {
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
</style> 