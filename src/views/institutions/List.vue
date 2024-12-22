<template>
  <div class="institutions-page">
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
        <el-form-item label="机构编号">
          <el-input v-model="searchForm.institutionNo" placeholder="请输入机构编号" clearable />
        </el-form-item>
        <el-form-item label="机构名称">
          <el-input v-model="searchForm.institutionName" placeholder="请输入机构名称" clearable />
        </el-form-item>
        <el-form-item label="状态" class="status-item">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 表格列 -->
      <el-table-column prop="institutionNo" label="机构编号" />
      <el-table-column prop="institutionName" label="机构名称" />
      <el-table-column prop="level" label="机构等级" />
      <el-table-column prop="address" label="地址" show-overflow-tooltip />
      <el-table-column prop="contact" label="联系人" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 额外的下拉操作 -->
      <template #dropdown-items="{ row }">
        <el-dropdown-item :command="row.status === '1' ? 'disable' : 'enable'">
          {{ row.status === '1' ? '禁用' : '启用' }}
        </el-dropdown-item>
        <el-dropdown-item command="viewDetail">查看详情</el-dropdown-item>
      </template>
    </base-list-page>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新建机构' : '编辑机构'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="机构编号" prop="institutionNo">
          <el-input v-model="form.institutionNo" placeholder="请输入机构编号" />
        </el-form-item>
        <el-form-item label="机构名称" prop="institutionName">
          <el-input v-model="form.institutionName" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择机构等级">
            <el-option label="三级甲等" value="三级甲等" />
            <el-option label="三级乙等" value="三级乙等" />
            <el-option label="二级甲等" value="二级甲等" />
            <el-option label="二级乙等" value="二级乙等" />
            <el-option label="一级" value="一级" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
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
import { institutionList } from '@/data/mockData'

// 列表页面引用
const listPage = ref(null)

// 搜索表单
const searchForm = reactive({
  institutionNo: '',
  institutionName: '',
  status: ''
})

// 弹窗表单
const dialogVisible = ref(false)
const dialogType = ref('create')
const formRef = ref(null)
const form = reactive({
  institutionNo: '',
  institutionName: '',
  level: '',
  address: '',
  contact: '',
  phone: ''
})

// 表单验证规则
const rules = {
  institutionNo: [
    { required: true, message: '请输入机构编号', trigger: 'blur' }
  ],
  institutionName: [
    { required: true, message: '请输入机构名称', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请选择机构等级', trigger: 'change' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^(\d{3,4}-?)?\d{7,8}$/, message: '请输入正确的电话号码', trigger: 'blur' }
  ]
}

// 处理搜索
const handleSearch = (form) => {
  if (!listPage.value) return
  
  listPage.value.loading = true
  setTimeout(() => {
    listPage.value.tableData = institutionList.filter(item => {
      const matchInstitutionNo = !form.institutionNo || item.institutionNo.includes(form.institutionNo)
      const matchInstitutionName = !form.institutionName || item.institutionName.includes(form.institutionName)
      const matchStatus = !form.status || item.status === form.status
      return matchInstitutionNo && matchInstitutionName && matchStatus
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
.institutions-page {
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