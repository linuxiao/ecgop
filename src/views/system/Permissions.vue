<template>
  <div class="permissions-page">
    <el-card class="tree-card">
      <template #header>
        <div class="card-header">
          <span>权限菜单</span>
          <el-button-group>
            <el-button type="primary" size="small" @click="handleAddMenu">
              新增菜单
            </el-button>
            <el-button type="primary" size="small" @click="handleAddPermission">
              新增权限
            </el-button>
          </el-button-group>
        </div>
      </template>
      <el-tree
        ref="permissionTree"
        :data="permissionData"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        highlight-current
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <span>
              <el-icon v-if="data.type === 'menu'"><Menu /></el-icon>
              <el-icon v-else><Key /></el-icon>
              {{ node.label }}
            </span>
            <span class="actions">
              <el-button link type="primary" size="small" @click.stop="handleEdit(data)">
                编辑
              </el-button>
              <el-button link type="danger" size="small" @click.stop="handleDelete(node, data)">
                删除
              </el-button>
            </span>
          </div>
        </template>
      </el-tree>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'menu' ? (form.id ? '编辑菜单' : '新增菜单') : (form.id ? '编辑权限' : '新增权限')"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级节点">
          <el-tree-select
            v-model="form.parentId"
            :data="permissionData"
            :props="defaultProps"
            check-strictly
            default-expand-all
            placeholder="请选择上级节点"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <template v-if="dialogType === 'menu'">
          <el-form-item label="图标" prop="icon">
            <el-input v-model="form.icon" placeholder="请输入图标" />
          </el-form-item>
          <el-form-item label="路由" prop="path">
            <el-input v-model="form.path" placeholder="请输入路由" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" :min="0" :max="999" />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Menu, Key } from '@element-plus/icons-vue'

const permissionTree = ref(null)
const formRef = ref(null)

// 权限树配置
const defaultProps = {
  children: 'children',
  label: 'name'
}

// 权限数据
const permissionData = ref([
  {
    id: 1,
    name: '系统管理',
    code: 'system',
    type: 'menu',
    icon: 'Setting',
    path: '/system',
    sort: 1,
    children: [
      {
        id: 11,
        name: '用户管理',
        code: 'system:user',
        type: 'menu',
        icon: 'User',
        path: '/system/users',
        sort: 1,
        children: [
          { id: 111, name: '查看用户', code: 'system:user:view', type: 'permission' },
          { id: 112, name: '新增用户', code: 'system:user:add', type: 'permission' },
          { id: 113, name: '编辑用户', code: 'system:user:edit', type: 'permission' },
          { id: 114, name: '删除用户', code: 'system:user:delete', type: 'permission' }
        ]
      },
      {
        id: 12,
        name: '角色管理',
        code: 'system:role',
        type: 'menu',
        icon: 'UserFilled',
        path: '/system/roles',
        sort: 2,
        children: [
          { id: 121, name: '查看角色', code: 'system:role:view', type: 'permission' },
          { id: 122, name: '新增角色', code: 'system:role:add', type: 'permission' },
          { id: 123, name: '编辑角色', code: 'system:role:edit', type: 'permission' },
          { id: 124, name: '删除角色', code: 'system:role:delete', type: 'permission' }
        ]
      }
    ]
  }
])

// 弹窗表单
const dialogVisible = ref(false)
const dialogType = ref('menu')
const form = reactive({
  id: '',
  parentId: null,
  name: '',
  code: '',
  type: '',
  icon: '',
  path: '',
  sort: 0
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入编码', trigger: 'blur' }
  ]
}

// 处理节点点击
const handleNodeClick = (data) => {
  console.log(data)
}

// 处理新增菜单
const handleAddMenu = () => {
  dialogType.value = 'menu'
  dialogVisible.value = true
  Object.keys(form).forEach(key => {
    form[key] = key === 'sort' ? 0 : ''
  })
  form.type = 'menu'
}

// 处理新增权限
const handleAddPermission = () => {
  dialogType.value = 'permission'
  dialogVisible.value = true
  Object.keys(form).forEach(key => {
    form[key] = key === 'sort' ? 0 : ''
  })
  form.type = 'permission'
}

// 处理编辑
const handleEdit = (data) => {
  dialogType.value = data.type
  dialogVisible.value = true
  Object.keys(form).forEach(key => {
    form[key] = data[key]
  })
}

// 处理删除
const handleDelete = (node, data) => {
  ElMessageBox.confirm(
    `确认删除 ${data.name} 吗？${data.children?.length ? '删除后将同时删除子节点' : ''}`,
    '提示',
    {
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
  })
}

// 处理表单提交
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(form.id ? '更新成功' : '创建成功')
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.permissions-page {
  height: 100%;
  padding: 8px;
  background-color: #f0f2f5;
}

.tree-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}

.actions {
  display: none;
}

:deep(.el-tree-node__content:hover) .actions {
  display: inline-block;
}

:deep(.el-tree-node__content) {
  height: 32px;
}
</style> 