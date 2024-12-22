<template>
  <div class="roles-page">
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
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="状态" class="status-item">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 表格列 -->
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 额外的下拉操作 -->
      <template #dropdown-items="{ row }">
        <el-dropdown-item command="permission">权限设置</el-dropdown-item>
        <el-dropdown-item :command="row.status === '1' ? 'disable' : 'enable'">
          {{ row.status === '1' ? '禁用' : '启用' }}
        </el-dropdown-item>
      </template>
    </base-list-page>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新建角色' : '编辑角色'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限设置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限设置"
      width="600px"
    >
      <el-tree
        ref="permissionTree"
        :data="permissionData"
        :props="{ label: 'name' }"
        show-checkbox
        node-key="id"
      />
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BaseListPage from '../../components/BaseListPage.vue'

const listPage = ref(null)
const permissionTree = ref(null)

// 搜索表单
const searchForm = reactive({
  roleName: '',
  status: ''
})

// 弹窗表单
const dialogVisible = ref(false)
const dialogType = ref('create')
const formRef = ref(null)
const form = reactive({
  roleName: '',
  roleCode: '',
  description: ''
})

// 权限设置弹窗
const permissionDialogVisible = ref(false)
const permissionData = [
  {
    id: 1,
    name: '系统管理',
    children: [
      { id: 11, name: '用户管理' },
      { id: 12, name: '角色管理' },
      { id: 13, name: '权限管理' }
    ]
  },
  {
    id: 2,
    name: '设备管理',
    children: [
      { id: 21, name: '设备列表' },
      { id: 22, name: '设备维护' }
    ]
  },
  {
    id: 3,
    name: '患者管理',
    children: [
      { id: 31, name: '患者列表' },
      { id: 32, name: '病例管理' }
    ]
  }
]

// 表单验证规则
const rules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  roleCode: [
    { required: true, message: '请输入角色编码', trigger: 'blur' }
  ]
}

// 模拟角色数据
const roleList = [
  {
    id: 1,
    roleName: '超级管理员',
    roleCode: 'SUPER_ADMIN',
    description: '系统超级管理员',
    createTime: '2024-03-14 12:00:00',
    status: '1'
  },
  {
    id: 2,
    roleName: '医生',
    roleCode: 'DOCTOR',
    description: '医生角色',
    createTime: '2024-03-14 13:00:00',
    status: '1'
  },
  {
    id: 3,
    roleName: '护士',
    roleCode: 'NURSE',
    description: '护士角色',
    createTime: '2024-03-14 14:00:00',
    status: '1'
  }
]

// 处理搜索
const handleSearch = (form) => {
  if (!listPage.value) return
  
  listPage.value.loading = true
  setTimeout(() => {
    listPage.value.tableData = roleList.filter(item => {
      const matchRoleName = !form.roleName || item.roleName.includes(form.roleName)
      const matchStatus = !form.status || item.status === form.status
      return matchRoleName && matchStatus
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

// 处理权限设置
const handlePermissionSubmit = () => {
  const checkedKeys = permissionTree.value.getCheckedKeys()
  const halfCheckedKeys = permissionTree.value.getHalfCheckedKeys()
  ElMessage.success('权限设置成功')
  permissionDialogVisible.value = false
}

onMounted(() => {
  handleSearch(searchForm)
})
</script>

<style scoped>
.roles-page {
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