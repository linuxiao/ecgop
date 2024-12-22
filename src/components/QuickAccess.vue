<template>
  <div class="quick-access">
    <el-row :gutter="16">
      <el-col :span="6" v-for="item in quickAccessItems" :key="item.title">
        <el-card shadow="hover" class="quick-card" @click="handleClick(item)">
          <div class="quick-content">
            <el-icon :size="24" :class="item.iconClass">
              <component :is="item.icon" />
            </el-icon>
            <div class="quick-info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { Document, Monitor, Upload, Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const quickAccessItems = [
  {
    title: '开始检查',
    description: '开始新的心电检查',
    icon: Monitor,
    iconClass: 'monitor',
    path: '/patients/records'
  },
  {
    title: '查看记录',
    description: '查看历史检查记录',
    icon: Document,
    iconClass: 'document',
    path: '/ecg/records'
  },
  {
    title: '数据上传',
    description: '上传心电数据',
    icon: Upload,
    iconClass: 'upload',
    path: '/ecg/upload'
  },
  {
    title: '数据查询',
    description: '查询历史数据',
    icon: Search,
    iconClass: 'search',
    path: '/ecg/search'
  }
]

const handleClick = (item) => {
  router.push(item.path)
}
</script>

<style scoped>
.quick-access {
  margin-bottom: 16px;
}

.quick-card {
  cursor: pointer;
  transition: all 0.3s;
}

.quick-card:hover {
  transform: translateY(-2px);
}

.quick-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
}

.quick-info {
  flex: 1;
}

.quick-info h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.quick-info p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.el-icon {
  padding: 12px;
  border-radius: 8px;
  color: #fff;
}

.monitor {
  background-color: #409eff;
}

.document {
  background-color: #67c23a;
}

.upload {
  background-color: #e6a23c;
}

.search {
  background-color: #909399;
}
</style> 