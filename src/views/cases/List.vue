<template>
  <div class="cases-page">
    <base-list-page
      ref="listPage"
      :search-form="searchForm"
      @search="handleSearch"
      @reset="handleReset"
      @create="handleCreate"
      @edit="handleEdit"
      @delete="handleDelete"
      @batch-command="handleBatchCommand"
    >
      <!-- 查询表单 -->
      <template #search-items>
        <el-form-item label="病例编号">
          <el-input v-model="searchForm.caseNo" placeholder="请输入病例编号" clearable />
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input v-model="searchForm.patientName" placeholder="请输入患者姓名" clearable />
        </el-form-item>
        <el-form-item label="状态" class="status-item">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 表格列 -->
      <el-table-column prop="caseNo" label="病例编号" />
      <el-table-column prop="patientName" label="患者姓名" />
      <el-table-column prop="patientNo" label="患者编号" />
      <el-table-column prop="department" label="科室" />
      <el-table-column prop="doctor" label="主治医生" />
      <el-table-column prop="diagnosis" label="诊断结果" show-overflow-tooltip />
      <el-table-column prop="visitDate" label="就诊日期" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 额外的下拉操作 -->
      <template #dropdown-items="{ row }">
        <el-dropdown-item command="viewDetail">查看详情</el-dropdown-item>
        <el-dropdown-item command="print">打印病例</el-dropdown-item>
      </template>
    </base-list-page>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新建病例' : '编辑病例'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="患者编号" prop="patientNo">
          <el-input v-model="form.patientNo" placeholder="请输入患者编号" />
        </el-form-item>
        <el-form-item label="患者姓名" prop="patientName">
          <el-input v-model="form.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="科室" prop="department">
          <el-input v-model="form.department" placeholder="请输入科室" />
        </el-form-item>
        <el-form-item label="主治医生" prop="doctor">
          <el-input v-model="form.doctor" placeholder="请输入主治医生" />
        </el-form-item>
        <el-form-item label="诊断结果" prop="diagnosis">
          <el-input
            v-model="form.diagnosis"
            type="textarea"
            :rows="3"
            placeholder="请输入诊断结果"
          />
        </el-form-item>
        <el-form-item label="就诊日期" prop="visitDate">
          <el-date-picker
            v-model="form.visitDate"
            type="date"
            placeholder="请选择就诊日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BaseListPage from '../../components/BaseListPage.vue'
import { caseList } from '@/data/mockData'

// 列表页面引用
const listPage = ref(null)

// 搜索表单
const searchForm = reactive({
  caseNo: '',
  patientName: '',
  status: ''
})

// 弹窗表单
const dialogVisible = ref(false)
const dialogType = ref('create')
const formRef = ref(null)
const form = reactive({
  patientNo: '',
  patientName: '',
  department: '',
  doctor: '',
  diagnosis: '',
  visitDate: ''
})

// 表单验证规则
const rules = {
  patientNo: [
    { required: true, message: '请输入患者编号', trigger: 'blur' }
  ],
  patientName: [
    { required: true, message: '请输入患者姓名', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请输入科室', trigger: 'blur' }
  ],
  doctor: [
    { required: true, message: '请输入主治医生', trigger: 'blur' }
  ],
  diagnosis: [
    { required: true, message: '请输入诊断结果', trigger: 'blur' }
  ],
  visitDate: [
    { required: true, message: '请选择就诊日期', trigger: 'change' }
  ]
}

// 处理搜索
const handleSearch = (form) => {
  if (!listPage.value) return
  
  listPage.value.loading = true
  setTimeout(() => {
    listPage.value.tableData = caseList.filter(item => {
      const matchCaseNo = !form.caseNo || item.caseNo.includes(form.caseNo)
      const matchPatientName = !form.patientName || item.patientName.includes(form.patientName)
      const matchStatus = !form.status || item.status === form.status
      return matchCaseNo && matchPatientName && matchStatus
    })
    listPage.value.total = listPage.value.tableData.length
    listPage.value.loading = false
  }, 500)
}

// 处理重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  handleSearch(searchForm)
}

// 处理创建
const handleCreate = () => {
  dialogType.value = 'create'
  dialogVisible.value = true
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
}

// 处理删除
const handleDelete = (row) => {
  ElMessage.success('删除成功')
  handleSearch(searchForm)
}

// 处理批量操作
const handleBatchCommand = ({ command, selection }) => {
  switch (command) {
    case 'delete':
      ElMessage.success(`批量删除 ${selection.length} 条记录成功`)
      handleSearch(searchForm)
      break
    case 'export':
      ElMessage.success('导出成功')
      break
  }
}

// 处理表单提交
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(dialogType.value === 'create' ? '创建成功' : '更新成功')
      dialogVisible.value = false
      handleSearch(searchForm)
    }
  })
}

// 在组件挂载时加载示例数据
onMounted(() => {
  handleSearch(searchForm)
})
</script>

<style scoped>
.cases-page {
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