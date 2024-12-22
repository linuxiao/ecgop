<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
          <div class="header-actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </template>
      <div class="card-content">
        <slot></slot>
      </div>
    </el-card>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.page-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.card-content {
  min-height: 300px;
  padding: 0 12px 12px;
}
</style> 