<template>
  <el-dialog
    v-model="dialogVisible"
    title="心电图判读"
    width="60%"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="分析结果" prop="result">
        <el-input
          v-model="form.result"
          type="textarea"
          :rows="3"
          placeholder="请输入分析结果"
        />
      </el-form-item>
      <el-form-item label="医生诊断" prop="diagnosis">
        <el-input
          v-model="form.diagnosis"
          type="textarea"
          :rows="3"
          placeholder="请输入医生诊断"
        />
      </el-form-item>
      <el-form-item label="建议" prop="suggestion">
        <el-input
          v-model="form.suggestion"
          type="textarea"
          :rows="3"
          placeholder="请输入建议"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['submit', 'cancel'])

const dialogVisible = ref(false)
const formRef = ref(null)
const form = ref({
  result: '',
  diagnosis: '',
  suggestion: ''
})

// 打开对话框
const open = (data = {}) => {
  form.value = {
    result: data.result || '',
    diagnosis: data.diagnosis || '',
    suggestion: data.suggestion || ''
  }
  dialogVisible.value = true
}

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false
  emit('cancel')
}

// 处理提交
const handleSubmit = () => {
  emit('submit', { ...form.value })
  dialogVisible.value = false
}

// 暴露方法给父组件
defineExpose({
  open
})
</script> 