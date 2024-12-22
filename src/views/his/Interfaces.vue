<template>
  <div class="his-interfaces-page">
    <!-- 左侧接口列表 -->
    <div class="interface-list card-container">
      <div class="list-header">
        <h3>接口列表</h3>
        <el-button type="primary" size="small" @click="handleAddInterface">
          <el-icon><Plus /></el-icon>新增接口
        </el-button>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="currentInterface"
          class="interface-menu"
          @select="handleSelectInterface"
        >
          <el-menu-item 
            v-for="item in interfaces" 
            :key="item.id" 
            :index="item.id"
          >
            <template #title>
              <span class="interface-item">
                <el-tag size="small" :type="item.method === 'GET' ? 'success' : 'warning'">
                  {{ item.method }}
                </el-tag>
                <span class="interface-name">{{ item.name }}</span>
              </span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 右侧接口详情 -->
    <div class="interface-detail card-container" v-if="currentDetail">
      <div class="detail-header">
        <div class="header-content">
          <span class="interface-title">{{ currentDetail.name }}</span>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本信息" name="basic" />
            <el-tab-pane label="请求参数" name="request" />
            <el-tab-pane label="返回参数" name="response" />
            <el-tab-pane label="调试" name="debug" />
          </el-tabs>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="handleSave">
            <el-icon><Check /></el-icon>保存
          </el-button>
        </div>
      </div>

      <div class="detail-content">
        <!-- 基本信息 -->
        <el-form 
          v-if="activeTab === 'basic'" 
          :model="currentDetail" 
          label-width="100px"
        >
          <el-form-item label="接口名称">
            <el-input v-model="currentDetail.name" />
          </el-form-item>
          <el-form-item label="请求方法">
            <el-select v-model="currentDetail.method">
              <el-option label="GET" value="GET" />
              <el-option label="POST" value="POST" />
            </el-select>
          </el-form-item>
          <el-form-item label="接口地址">
            <el-input v-model="currentDetail.url" />
          </el-form-item>
          <el-form-item label="接口描述">
            <el-input v-model="currentDetail.description" type="textarea" rows="3" />
          </el-form-item>
        </el-form>

        <!-- 请求参数 -->
        <div v-if="activeTab === 'request'">
          <div class="param-header">
            <h4>请求头</h4>
            <el-button type="primary" link @click="handleAddHeader">
              <el-icon><Plus /></el-icon>添加
            </el-button>
          </div>
          <el-table :data="currentDetail.headers" border>
            <el-table-column label="参数名" prop="name" />
            <el-table-column label="参数值" prop="value" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ $index }">
                <el-button type="danger" link @click="handleDeleteHeader($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="param-header">
            <h4>请求参数</h4>
            <el-button type="primary" link @click="handleAddParam">
              <el-icon><Plus /></el-icon>添加
            </el-button>
          </div>
          <el-table :data="currentDetail.params" border>
            <el-table-column label="参数名" prop="name" />
            <el-table-column label="类型" prop="type" />
            <el-table-column label="是否必填" prop="required" width="100">
              <template #default="{ row }">
                <el-tag :type="row.required ? 'danger' : 'info'" size="small">
                  {{ row.required ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ $index }">
                <el-button type="danger" link @click="handleDeleteParam($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 返回参数 -->
        <div v-if="activeTab === 'response'">
          <div class="param-header">
            <h4>返回参数</h4>
            <el-button type="primary" link @click="handleAddResponse">
              <el-icon><Plus /></el-icon>添加
            </el-button>
          </div>
          <el-table :data="currentDetail.responses" border>
            <el-table-column label="参数名" prop="name" />
            <el-table-column label="类型" prop="type" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ $index }">
                <el-button type="danger" link @click="handleDeleteResponse($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 调试 -->
        <el-form 
          v-if="activeTab === 'debug'" 
          :model="debugForm" 
          label-width="100px"
        >
          <el-form-item label="请求参数">
            <el-input
              v-model="debugForm.params"
              type="textarea"
              rows="10"
              placeholder="请输入JSON格式的请求参数"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleTest">发送请求</el-button>
            <el-button @click="handleClear">清空</el-button>
          </el-form-item>
          <el-form-item label="返回结果">
            <el-input
              v-model="debugForm.response"
              type="textarea"
              rows="10"
              readonly
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Check } from '@element-plus/icons-vue'

// 接口列表数据
const interfaces = ref([
  {
    id: '1',
    name: '获取患者信息',
    method: 'GET',
    url: '/api/his/patient',
    description: '获取HIS系统中的患者基本信息',
    headers: [
      { name: 'Authorization', value: 'Bearer token', description: '认证token' }
    ],
    params: [
      { name: 'patientId', type: 'string', required: true, description: '患者ID' }
    ],
    responses: [
      { name: 'code', type: 'number', description: '返回码' },
      { name: 'data', type: 'object', description: '患者信息' }
    ]
  },
  {
    id: '2',
    name: '上传检查结果',
    method: 'POST',
    url: '/api/his/report',
    description: '向HIS系统上传心电图检查结果',
    headers: [
      { name: 'Authorization', value: 'Bearer token', description: '认证token' }
    ],
    params: [
      { name: 'patientId', type: 'string', required: true, description: '患者ID' },
      { name: 'reportData', type: 'object', required: true, description: '报告数据' }
    ],
    responses: [
      { name: 'code', type: 'number', description: '返回码' },
      { name: 'message', type: 'string', description: '返回信息' }
    ]
  }
])

// 当前选中的接口
const currentInterface = ref('1')
const currentDetail = ref(null)
const activeTab = ref('basic')

// 调试表单
const debugForm = reactive({
  params: '',
  response: ''
})

// 选择接口
const handleSelectInterface = (id) => {
  currentInterface.value = id
  currentDetail.value = interfaces.value.find(item => item.id === id)
}

// 新增接口
const handleAddInterface = () => {
  const newId = String(interfaces.value.length + 1)
  interfaces.value.push({
    id: newId,
    name: '新接口',
    method: 'GET',
    url: '',
    description: '',
    headers: [],
    params: [],
    responses: []
  })
  handleSelectInterface(newId)
}

// 添加请求头
const handleAddHeader = () => {
  currentDetail.value.headers.push({
    name: '',
    value: '',
    description: ''
  })
}

// 删除请求头
const handleDeleteHeader = (index) => {
  currentDetail.value.headers.splice(index, 1)
}

// 添加请求参数
const handleAddParam = () => {
  currentDetail.value.params.push({
    name: '',
    type: 'string',
    required: false,
    description: ''
  })
}

// 删除请求参数
const handleDeleteParam = (index) => {
  currentDetail.value.params.splice(index, 1)
}

// 添加返回参数
const handleAddResponse = () => {
  currentDetail.value.responses.push({
    name: '',
    type: 'string',
    description: ''
  })
}

// 删除返回参数
const handleDeleteResponse = (index) => {
  currentDetail.value.responses.splice(index, 1)
}

// 保存接口
const handleSave = () => {
  const index = interfaces.value.findIndex(item => item.id === currentDetail.value.id)
  interfaces.value[index] = { ...currentDetail.value }
  ElMessage.success('保存成功')
}

// 发送测试请求
const handleTest = () => {
  debugForm.response = '请求发送中...'
  setTimeout(() => {
    debugForm.response = JSON.stringify({
      code: 0,
      message: 'success',
      data: {
        id: '123',
        name: '测试患者'
      }
    }, null, 2)
  }, 1000)
}

// 清空调试表单
const handleClear = () => {
  debugForm.params = ''
  debugForm.response = ''
}

// 初始化选中第一个接口
handleSelectInterface('1')
</script>

<style scoped>
.his-interfaces-page {
  height: 100%;
  padding: 16px;
  background-color: #f0f2f5;
  display: flex;
  gap: 16px;
}

.card-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.interface-list {
  width: 280px;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}

.list-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.interface-menu {
  border-right: none;
}

.interface-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.interface-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.interface-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-header {
  padding: 0 16px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  flex: 1;
  min-width: 0;
}

.interface-title {
  display: inline-block;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin: 16px 24px 16px 0;
}

.header-actions {
  padding: 16px 0 16px 16px;
  border-left: 1px solid #dcdfe6;
}

:deep(.el-tabs__header) {
  display: inline-block;
  margin: 0;
  vertical-align: middle;
}

.detail-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background-color: #fafafa;
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 8px;
}

.param-header h4 {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

:deep(.el-table) {
  margin-bottom: 16px;
}

/* 表单样式优化 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input), :deep(.el-select) {
  width: 100%;
}

/* 参数表格样式优化 */
:deep(.el-table) {
  border-radius: 4px;
  margin-top: 8px;
}

/* 按钮间距 */
:deep(.el-button + .el-button) {
  margin-left: 12px;
}

/* 标签页样式优化 */
:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

/* 表单容器样式 */
:deep(.el-form) {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

/* 表格容器样式 */
.param-table-container {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

/* 按钮图标样式 */
:deep(.el-button .el-icon) {
  margin-right: 4px;
}

/* 保存按钮样式优化 */
:deep(.header-actions .el-button) {
  padding: 8px 16px;
  font-weight: 500;
}
</style> 