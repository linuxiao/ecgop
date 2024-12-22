# Create new file
<template>
  <div class="hospital-list">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="医院名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入医院名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>医院列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增医院
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column prop="name" label="医院名称" min-width="200">
          <template #default="{ row }">
            <el-link type="primary" @click="handleView(row)">{{ row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="医院代码" width="120" />
        <el-table-column prop="level" label="医院等级" width="120" />
        <el-table-column prop="deviceCount" label="设备数量" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'online' ? 'success' : 'danger'">
              {{ row.status === 'online' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastActiveTime" label="最后活跃时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button 
              link 
              type="danger" 
              @click="handleDelete(row)"
              :disabled="row.status === 'online'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增医院' : '编辑医院'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="医院名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入医院名称" />
        </el-form-item>
        <el-form-item label="医院代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入医院代码" />
        </el-form-item>
        <el-form-item label="医院等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择医院等级">
            <el-option label="三级甲等" value="三级甲等" />
            <el-option label="三级乙等" value="三级乙等" />
            <el-option label="二级甲等" value="二级甲等" />
            <el-option label="二级乙等" value="二级乙等" />
            <el-option label="一级" value="一级" />
            <el-option label="社区医院" value="社区医院" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入医院地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    id: 1,
    name: '第一人民医院',
    code: 'H001',
    level: '三级甲等',
    deviceCount: 5,
    status: 'online',
    lastActiveTime: '2024-01-20 10:30:00',
    contact: '张三',
    phone: '13800138000',
    address: '北京市朝阳区',
    remark: ''
  },
  {
    id: 2,
    name: '第二人民医院',
    code: 'H002',
    level: '三级乙等',
    deviceCount: 3,
    status: 'online',
    lastActiveTime: '2024-01-20 10:25:00',
    contact: '李四',
    phone: '13800138001',
    address: '北京市海淀区',
    remark: ''
  },
  {
    id: 3,
    name: '社区医院',
    code: 'H003',
    level: '社区医院',
    deviceCount: 2,
    status: 'offline',
    lastActiveTime: '2024-01-19 15:30:00',
    contact: '王五',
    phone: '13800138002',
    address: '北京市西城区',
    remark: ''
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const form = reactive({
  name: '',
  code: '',
  level: '',
  contact: '',
  phone: '',
  address: '',
  remark: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入医院名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入医院代码', trigger: 'blur' },
    { pattern: /^[A-Z0-9]{3,10}$/, message: '3-10位大写字母或数字', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请选择医院等级', trigger: 'change' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('Search form:', searchForm)
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = ''
  handleSearch()
}

// 新增医院
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  // 重置表单
  Object.keys(form).forEach(key => form[key] = '')
}

// 编辑医院
const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  // 填充表单
  Object.assign(form, row)
}

// 查看医院详情
const handleView = (row) => {
  router.push(`/hospitals/${row.id}`)
}

// 删除医院
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该医院吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除逻辑
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // TODO: 实现提交逻辑
    ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功')
    dialogVisible.value = false
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // TODO: 重新加载数据
}
</script>

<style scoped>
.hospital-list {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-card__header) {
  padding: 15px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style> 