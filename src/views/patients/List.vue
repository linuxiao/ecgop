<template>
  <div class="patients-page">
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
        <el-form-item label="患者编号">
          <el-input v-model="searchForm.patientNo" placeholder="请输入患者编号" clearable />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="医院">
          <el-select v-model="searchForm.hospital" placeholder="请选择医院" clearable>
            <el-option label="第一人民医院" value="第一人民医院" />
            <el-option label="第二人民医院" value="第二人民医院" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
      </template>

      <!-- 表格列 -->
      <el-table-column prop="patientNo" label="患者编号" width="120" />
      <el-table-column prop="name" label="姓名" width="120">
        <template #default="{ row }">
          <el-link type="primary" @click="handleViewDetail(row)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="hospital" label="医院" width="150" />
      <el-table-column prop="idCard" label="身份证号" />
      <el-table-column prop="address" label="地址" show-overflow-tooltip />
      <el-table-column prop="lastVisit" label="最近就诊" />

      <!-- 额外的下拉操作 -->
      <template #dropdown-items="{ row }">
        <el-dropdown-item command="viewCases">病例记录</el-dropdown-item>
        <el-dropdown-item command="viewEcg">心电图记录</el-dropdown-item>
      </template>
    </base-list-page>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新建患者' : '编辑者'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="0" :max="150" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
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
import { useRouter } from 'vue-router'

const listPage = ref(null)
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  patientNo: '',
  name: '',
  hospital: '',
  phone: ''
})

// 弹窗表单
const dialogVisible = ref(false)
const dialogType = ref('create')
const formRef = ref(null)
const form = reactive({
  name: '',
  gender: '',
  age: '',
  phone: '',
  idCard: '',
  address: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '���输入身份证号', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }
  ]
}

// 模拟患者数据
const patientList = [
  {
    id: 1,
    patientNo: 'P202401001',
    name: '张三',
    gender: '男',
    age: 35,
    phone: '13800138000',
    hospital: '第一人民医院',
    idCard: '310101198801011234',
    address: '上海市XX区XX路XX号',
    lastVisit: '2024-03-10'
  },
  {
    id: 2,
    patientNo: 'P202401002',
    name: '李四',
    gender: '女',
    age: 28,
    phone: '13800138001',
    hospital: '第二人民医院',
    idCard: '310101199001011234',
    address: '上海市XX区XX路XX号',
    lastVisit: '2024-03-12'
  }
]

// 处理查看详情
const handleViewDetail = (row) => {
  router.push({
    name: 'PatientDetail',
    params: { id: row.id }
  })
}

// 处理搜索
const handleSearch = (form) => {
  if (!listPage.value) return
  
  listPage.value.loading = true
  setTimeout(() => {
    listPage.value.tableData = patientList.filter(item => {
      const matchPatientNo = !form.patientNo || item.patientNo.includes(form.patientNo)
      const matchName = !form.name || item.name.includes(form.name)
      const matchHospital = !form.hospital || item.hospital === form.hospital
      const matchPhone = !form.phone || item.phone.includes(form.phone)
      return matchPatientNo && matchName && matchHospital && matchPhone
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

onMounted(() => {
  handleSearch(searchForm)
})
</script>

<style scoped>
.patients-page {
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