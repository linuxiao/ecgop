<template>
  <div class="users-page">
    <base-list-page
      ref="listPage"
      title="用户管理"
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
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态" class="status-item">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 表格列 -->
      <el-table-column prop="username" label="用��名" />
      <el-table-column prop="realName" label="姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />

      <!-- 额外的下拉操作 -->
      <template #dropdown-items="{ row }">
        <el-dropdown-item :command="row.status === '1' ? 'disable' : 'enable'">
          {{ row.status === '1' ? '禁用' : '启用' }}
        </el-dropdown-item>
        <el-dropdown-item command="resetPwd">重置密码</el-dropdown-item>
      </template>
    </base-list-page>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新建用户' : '编辑用户'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
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
import { userList } from '@/data/mockData'

// 列表页面引用
const listPage = ref(null)

// 搜索表单
const searchForm = reactive({
  username: '',
  phone: '',
  status: ''
})

// 弹窗表单
const dialogVisible = ref(false)
const dialogType = ref('create')
const formRef = ref(null)
const form = reactive({
  username: '',
  realName: '',
  phone: '',
  email: '',
  role: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 处理搜索
const handleSearch = (form) => {
  if (!listPage.value) return
  
  listPage.value.loading = true
  // 模拟API请求
  setTimeout(() => {
    // 这里可以根据搜索条件过滤数据
    listPage.value.tableData = userList.filter(item => {
      const matchUsername = !form.username || item.username.includes(form.username)
      const matchPhone = !form.phone || item.phone.includes(form.phone)
      const matchStatus = !form.status || item.status === form.status
      return matchUsername && matchPhone && matchStatus
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
.users-page {
  height: 100%;
  padding: 8px;
  background-color: #f0f2f5;
}

:deep(.status-item) {
  min-width: 120px; /* 设置最小宽度 */
}

:deep(.status-item .el-select) {
  width: 100%; /* 选择框占满容器宽度 */
}
</style> 