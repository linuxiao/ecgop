<template>
  <div class="base-list-page">
    <div class="header-content">
      <!-- 左侧操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>新建
        </el-button>
        <el-dropdown 
          split-button 
          type="primary" 
          :disabled="!selection.length"
          @command="handleBatchCommand"
          class="batch-dropdown"
        >
          批量操作
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="delete">批量删除</el-dropdown-item>
              <el-dropdown-item command="export">批量导出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 右侧搜索表单 -->
      <el-form :inline="true" :model="searchForm">
        <div class="search-form-content">
          <!-- 搜索表单项插槽 -->
          <slot name="search-items"></slot>
          <!-- 搜索按钮 -->
          <el-button type="primary" @click="$emit('search', searchForm)">查询</el-button>
          <el-button @click="$emit('reset')">重置</el-button>
        </div>
      </el-form>
    </div>

    <!-- 表格区 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" align="center" />
        <slot></slot>
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="scope">
            <el-dropdown split-button type="primary" size="small" @command="(command) => handleCommand(command, scope.row)">
              编辑
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                  <slot name="dropdown-items" :row="scope.row"></slot>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'

defineProps({
  searchForm: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['search', 'reset', 'create', 'edit', 'delete', 'batch-command'])

// 表格数据
const loading = ref(false)
const tableData = ref([])
const selection = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 处理表格选择
const handleSelectionChange = (val) => {
  selection.value = val
}

// 处理分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  emit('search')
}

// 处理当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  emit('search')
}

// 处理创建
const handleCreate = () => {
  emit('create')
}

// 处理操作命令
const handleCommand = (command, row) => {
  switch (command) {
    case 'edit':
      emit('edit', row)
      break
    case 'delete':
      emit('delete', row)
      break
  }
}

// 处理批量操作
const handleBatchCommand = (command) => {
  emit('batch-command', { command, selection: selection.value })
}

// 暴露给父组件的属性和方法
defineExpose({
  loading,
  tableData,
  total,
  currentPage,
  pageSize
})
</script>

<style scoped>
.base-list-page {
  height: 100%;
  background-color: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;

  gap: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.search-form-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.table-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:deep(.el-table) {
  flex: 1;
  height: 100%;
}

:deep(.el-table th) {
  text-align: center;
}

:deep(.el-table td) {
  text-align: center;
}

:deep(.el-table .cell) {
  padding: 0 8px;
  white-space: nowrap;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  flex-shrink: 0;
}

:deep(.el-form-item) {
  margin-bottom: 8px;
  margin-right: 8px;
  flex-shrink: 0;
}

:deep(.el-form-item:last-child) {
  margin-right: 0;
}

:deep(.el-form) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 16px;
  flex: 1;
  justify-content: flex-end;
}

:deep(.el-button) {
  margin-left: 8px;
  flex-shrink: 0;
}

/* 批量操作下拉按钮样式 */
.batch-dropdown {
  width: 130px;
}

/* 操作列下拉按钮样式 */
:deep(.el-dropdown--small) {
  width: 85px;
}

/* 确保表单项不会换行 */
:deep(.el-form-item__content) {
  flex-shrink: 0;
  white-space: nowrap;
}
</style> 