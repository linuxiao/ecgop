<template>
  <div class="inspection-page">
    <!-- 左侧巡检项目 -->
    <div class="inspection-items card-container">
      <div class="items-header">
        <div class="header-title">
          <el-icon><List /></el-icon>
          <h3>巡检项目</h3>
        </div>
        <div class="header-actions">
          <el-tooltip content="定时巡检" placement="top">
            <el-button link @click="handleSchedule">
              <el-icon><Timer /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="开始系统巡检" placement="top">
            <el-button 
              type="primary" 
              @click="handleStartInspection"
              :loading="isInspecting"
              :disabled="isInspecting"
            >
              <el-icon><VideoPlay /></el-icon>
              {{ isInspecting ? '巡检中' : '开始巡检' }}
            </el-button>
          </el-tooltip>
        </div>
      </div>
      
      <el-scrollbar>
        <div class="inspection-filter">
          <div class="filter-content">
            <div class="filter-wrapper">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索巡检项"
                clearable
                :prefix-icon="Search"
                class="search-input"
              />
              <el-button type="primary" class="search-button">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
            </div>
            <div class="status-filter">
              <el-select 
                v-model="filterStatus" 
                placeholder="选择状态"
                class="status-select"
              >
                <el-option label="全部状态" value="">
                  <span class="select-label">全部状态</span>
                </el-option>
                <el-option label="正常" value="success">
                  <div class="select-option">
                    <el-icon class="status-icon success"><CircleCheck /></el-icon>
                    <span class="select-label">正常</span>
                  </div>
                </el-option>
                <el-option label="警告" value="warning">
                  <div class="select-option">
                    <el-icon class="status-icon warning"><Warning /></el-icon>
                    <span class="select-label">警告</span>
                  </div>
                </el-option>
                <el-option label="异常" value="error">
                  <div class="select-option">
                    <el-icon class="status-icon error"><CircleClose /></el-icon>
                    <span class="select-label">异常</span>
                  </div>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <el-collapse v-model="activeCategories">
          <el-collapse-item
            v-for="category in filteredItems"
            :key="category.id"
            :title="category.name"
            :name="category.id"
          >
            <template #title>
              <div class="category-title">
                <el-icon><Folder /></el-icon>
                <span>{{ category.name }}</span>
                <el-tag 
                  size="small" 
                  :type="getCategoryStatus(category)"
                  class="category-status"
                >
                  {{ getCategoryStatusText(category) }}
                </el-tag>
              </div>
            </template>
            <div class="item-list">
              <div
                v-for="item in category.items"
                :key="item.id"
                class="inspection-item"
                :class="{ 'is-checking': item.checking, 'is-done': item.done }"
              >
                <div class="item-info">
                  <el-icon class="item-icon">
                    <component :is="getItemIcon(item)" />
                  </el-icon>
                  <span class="item-name">{{ item.name }}</span>
                </div>
                <span class="item-status">
                  <template v-if="item.done">
                    <span class="status-value" :class="item.status">
                      {{ getStatusValue(item) }}
                    </span>
                    <el-icon v-if="item.checking" class="is-loading"><Loading /></el-icon>
                    <el-icon v-else-if="item.done" :class="item.status">
                      <component :is="getStatusIcon(item.status)" />
                    </el-icon>
                  </template>
                  <span v-else class="unchecked">未检查</span>
                </span>
              </div>
              <div v-if="category.id === '1'" class="chart-container">
                <div class="chart-item">
                  <el-progress
                    type="dashboard"
                    :width="80"
                    :percentage="cpuUsage"
                    :color="getDashboardColor(cpuUsage)"
                  >
                    <template #default="{ percentage }">
                      <span class="progress-label">CPU</span>
                      <span class="progress-value">{{ percentage }}%</span>
                    </template>
                  </el-progress>
                </div>
                <div class="chart-item">
                  <el-progress
                    type="dashboard"
                    :width="80"
                    :percentage="memoryUsage"
                    :color="getDashboardColor(memoryUsage)"
                  >
                    <template #default="{ percentage }">
                      <span class="progress-label">内存</span>
                      <span class="progress-value">{{ percentage }}%</span>
                    </template>
                  </el-progress>
                </div>
                <div class="chart-item">
                  <el-progress
                    type="dashboard"
                    :width="80"
                    :percentage="diskUsage"
                    :color="getDashboardColor(diskUsage)"
                  >
                    <template #default="{ percentage }">
                      <span class="progress-label">磁盘</span>
                      <span class="progress-value">{{ percentage }}%</span>
                    </template>
                  </el-progress>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>

        <!-- 巡检进度条 -->
        <div v-if="isInspecting" class="inspection-progress">
          <div class="progress-wrapper">
            <el-progress 
              :percentage="inspectionProgress" 
              :status="inspectionProgress === 100 ? 'success' : ''"
              :stroke-width="8"
            />
            <div class="progress-info">
              <p class="progress-text">
                <el-icon v-if="inspectionProgress < 100" class="is-loading"><Loading /></el-icon>
                <span>正在检查: {{ currentInspectingItem?.name || '准备开始' }}</span>
                <span class="progress-percentage">{{ inspectionProgress }}%</span>
              </p>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 右侧巡检记录 -->
    <div class="inspection-records card-container">
      <div class="records-header">
        <div class="header-title">
          <el-icon><Document /></el-icon>
          <h3>巡检记录</h3>
          <el-tag size="small" type="info">
            共 {{ total }} 条记录
          </el-tag>
        </div>
        <div class="header-actions">
          <el-tooltip content="导出Excel" placement="top">
            <el-button link @click="handleExportExcel">
              <el-icon><Document /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="导出PDF" placement="top">
            <el-button link @click="handleExportPdf">
              <el-icon><Printer /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="导出Word" placement="top">
            <el-button @click="handleExport">
              <el-icon><Download /></el-icon>导出报表
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <div class="records-content" v-loading="tableLoading">
        <div class="records-filter">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 360px"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select 
                v-model="searchForm.status" 
                placeholder="请选择状态"
                style="width: 120px"
              >
                <el-option label="全部" value="" />
                <el-option label="正常" value="normal" />
                <el-option label="警告" value="warning" />
                <el-option label="异常" value="error" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="form-buttons">
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <div class="records-table-container">
          <el-table 
            :data="records" 
            border 
            style="width: 100%"
            class="records-table"
          >
            <el-table-column type="expand">
              <template #default="{ row }">
                <div class="record-detail">
                  <div v-for="(result, index) in row.results" :key="index" class="detail-item">
                    <span class="item-category">{{ result.category }}：</span>
                    <div class="item-results">
                      <p v-for="(item, idx) in result.items" :key="idx" :class="item.status">
                        {{ item.name }}: {{ item.message }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="180" />
            <el-table-column prop="endTime" label="结束时间" width="180" />
            <el-table-column prop="duration" label="耗时" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag 
                  :type="getTagType(row.status)"
                  :effect="row.status === '正常' ? 'plain' : 'dark'"
                >
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="operator" label="操作人" width="120" />
            <el-table-column label="操作" width="120" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleViewReport(row)">
                  查看报表
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="table-footer">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 报表预览对话框 -->
    <el-dialog
      v-model="reportVisible"
      title="巡检报表"
      width="1000px"
      :destroy-on-close="true"
      class="report-dialog"
    >
      <div class="report-preview">
        <div class="report-header">
          <div class="report-title">
            <el-icon><DataAnalysis /></el-icon>
            <h2>系统巡检报告</h2>
          </div>
          <div class="report-info">
            <div class="info-item">
              <span class="info-label">巡检时间：</span>
              <span class="info-value">{{ currentReport?.startTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">操作人员：</span>
              <span class="info-value">{{ currentReport?.operator }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">耗时：</span>
              <span class="info-value">{{ currentReport?.duration }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">状态：</span>
              <el-tag 
                :type="getTagType(currentReport?.status)"
                :effect="currentReport?.status === '正常' ? 'plain' : 'dark'"
              >
                {{ currentReport?.status }}
              </el-tag>
            </div>
          </div>

          <div class="report-content" v-if="currentReport">
            <div class="report-overview">
              <div class="overview-item" :class="getOverviewClass(currentReport)">
                <div class="overview-icon">
                  <el-icon><component :is="getOverviewIcon(currentReport)" /></el-icon>
                </div>
                <div class="overview-info">
                  <div class="overview-title">检查项总数</div>
                  <div class="overview-value">{{ getTotalItems(currentReport) }}</div>
                </div>
              </div>
              <div class="overview-item success">
                <div class="overview-icon">
                  <el-icon><CircleCheck /></el-icon>
                </div>
                <div class="overview-info">
                  <div class="overview-title">正常项</div>
                  <div class="overview-value">{{ getSuccessItems(currentReport) }}</div>
                </div>
              </div>
              <div class="overview-item warning">
                <div class="overview-icon">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="overview-info">
                  <div class="overview-title">警告项</div>
                  <div class="overview-value">{{ getWarningItems(currentReport) }}</div>
                </div>
              </div>
              <div class="overview-item error">
                <div class="overview-icon">
                  <el-icon><CircleClose /></el-icon>
                </div>
                <div class="overview-info">
                  <div class="overview-title">异常项</div>
                  <div class="overview-value">{{ getErrorItems(currentReport) }}</div>
                </div>
              </div>
            </div>

            <!-- 系统状态 -->
            <div class="report-section">
              <h4>系统状态</h4>
              <el-descriptions :column="3" border>
                <el-descriptions-item label="CPU使用率">
                  <div class="status-item">
                    <span>32%</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="内存使用率">
                  <div class="status-item">
                    <span>45%</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="磁盘空间">
                  <div class="status-item">
                    <span>85%</span>
                    <el-tag size="small" type="warning">警告</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="系统负载">
                  <div class="status-item">
                    <span>0.75</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="网络状态">
                  <div class="status-item">
                    <span>正常</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- HIS集成状态 -->
            <div class="report-section">
              <h4>HIS集成状态</h4>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="服务器连通性">
                  <div class="status-item">
                    <span>延迟: 20ms</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="API接口">
                  <div class="status-item">
                    <span>全部可用</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="患者信息同步">
                  <div class="status-item">
                    <span>实时同步正常</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="报告推送">
                  <div class="status-item">
                    <span>正常</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 心电图系统状态 -->
            <div class="report-section">
              <h4>心电图系统状态</h4>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="心电图服务">
                  <div class="status-item">
                    <span>运行正常</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="数据上传">
                  <div class="status-item">
                    <span>连接超时</span>
                    <el-tag size="small" type="error">异常</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="FTP服务">
                  <div class="status-item">
                    <span>响应缓</span>
                    <el-tag size="small" type="warning">警告</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="判读引擎">
                  <div class="status-item">
                    <span>运行正常</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 医共体系统状态 -->
            <div class="report-section">
              <h4>医共体系统状态</h4>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="远程服务器">
                  <div class="status-item">
                    <span>连接正常</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="数据同步">
                  <div class="status-item">
                    <span>同步正常</span>
                    <el-tag size="small" type="success">正常</el-tag>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <div class="report-section conclusion-section">
              <h4>
                <el-icon><Document /></el-icon>
                巡检结论与建议
              </h4>
              
              <div class="conclusion-content">
                <!-- 异常项 -->
                <div class="conclusion-block error" v-if="getErrorItems(currentReport) > 0">
                  <div class="block-header">
                    <el-icon><CircleClose /></el-icon>
                    <span>发现 {{ getErrorItems(currentReport) }} 项异常</span>
                  </div>
                  <ul class="error-list">
                    <li v-for="(item, index) in getErrorList(currentReport)" :key="index">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                
                <!-- 警告项 -->
                <div class="conclusion-block warning" v-if="getWarningItems(currentReport) > 0">
                  <div class="block-header">
                    <el-icon><Warning /></el-icon>
                    <span>发现 {{ getWarningItems(currentReport) }} 项警告</span>
                  </div>
                  <ul class="warning-list">
                    <li v-for="(item, index) in getWarningList(currentReport)" :key="index">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                
                <!-- 建议 -->
                <div class="conclusion-block suggestion">
                  <div class="block-header">
                    <el-icon><Operation /></el-icon>
                    <span>优化建议</span>
                  </div>
                  <ul class="suggestion-list">
                    <li v-for="(item, index) in getSuggestions(currentReport)" :key="index">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="reportVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleExportWord">
          导出Word
        </el-button>
      </template>
    </el-dialog>

    <!-- 定时巡检对话框 -->
    <el-dialog
      v-model="scheduleVisible"
      title="定时巡检设置"
      width="500px"
    >
      <el-form :model="scheduleForm" label-width="100px">
        <el-form-item label="巡检周期">
          <el-select v-model="scheduleForm.type">
            <el-option label="每天" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="执行时间" v-if="scheduleForm.type === 'daily'">
          <el-time-picker v-model="scheduleForm.time" format="HH:mm" />
        </el-form-item>
        
        <el-form-item label="执行时间" v-if="scheduleForm.type === 'weekly'">
          <el-select v-model="scheduleForm.weekday" style="width: 100px">
            <el-option label="周一" value="1" />
            <el-option label="周二" value="2" />
            <el-option label="周三" value="3" />
            <el-option label="周四" value="4" />
            <el-option label="周五" value="5" />
            <el-option label="周六" value="6" />
            <el-option label="周日" value="7" />
          </el-select>
          <el-time-picker v-model="scheduleForm.time" format="HH:mm" />
        </el-form-item>
        
        <el-form-item label="执行时间" v-if="scheduleForm.type === 'monthly'">
          <el-input-number v-model="scheduleForm.day" :min="1" :max="31" />
          <span class="ml-2">日</span>
          <el-time-picker v-model="scheduleForm.time" format="HH:mm" />
        </el-form-item>
        
        <el-form-item label="通知方式">
          <el-checkbox-group v-model="scheduleForm.notifications">
            <el-checkbox label="email">邮件通知</el-checkbox>
            <el-checkbox label="sms">短信通知</el-checkbox>
            <el-checkbox label="weixin">微信通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="通知人员">
          <el-select
            v-model="scheduleForm.notifyUsers"
            multiple
            filterable
            placeholder="请选择通知人员"
          >
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scheduleVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveSchedule">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  VideoPlay, 
  Download, 
  Loading,
  CircleCheck,
  CircleClose,
  Warning,
  List,
  Folder,
  Document,
  Timer,
  Printer,
  Search,
  Monitor,
  Connection,
  DataLine,
  Cpu,
  Link,
  Operation,
  DataAnalysis
} from '@element-plus/icons-vue'

// 响应式变量
const activeCategories = ref(['1', '2', '3', '4', '5']) // 默认展开所有分类
const searchKeyword = ref('')
const filterStatus = ref('')
const isInspecting = ref(false)
const inspectionProgress = ref(0)
const currentInspectingItem = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const tableLoading = ref(false)
const reportVisible = ref(false)
const currentReport = ref(null)
const searchForm = reactive({
  dateRange: [],
  status: ''
})

// 巡检项目数据
const inspectionItems = ref([
  {
    id: '1',
    name: '系统状态',
    items: [
      { id: '1-1', name: 'CPU使用率', checking: false, done: false },
      { id: '1-2', name: '内存使用率', checking: false, done: false },
      { id: '1-3', name: '磁盘空间', checking: false, done: false },
      { id: '1-4', name: '系统负载', checking: false, done: false },
      { id: '1-5', name: '网络状态', checking: false, done: false }
    ]
  },
  {
    id: '2',
    name: 'HIS集成检查',
    items: [
      { id: '2-1', name: 'HIS服务器连通性', checking: false, done: false },
      { id: '2-2', name: 'API接口可用性', checking: false, done: false },
      { id: '2-3', name: '患者信息拉取测试', checking: false, done: false },
      { id: '2-4', name: '医嘱信息同步测试', checking: false, done: false },
      { id: '2-5', name: '报告推送接口测试', checking: false, done: false }
    ]
  },
  {
    id: '3',
    name: '心电图系统检查',
    items: [
      { id: '3-1', name: '心电图服务状态', checking: false, done: false },
      { id: '3-2', name: '心电图登录认证', checking: false, done: false },
      { id: '3-3', name: '心电图数据上传', checking: false, done: false },
      { id: '3-4', name: 'FTP服务连通性', checking: false, done: false },
      { id: '3-5', name: 'FTP上传测试', checking: false, done: false },
      { id: '3-6', name: '心电图解析服务', checking: false, done: false },
      { id: '3-7', name: '心电图判读引擎', checking: false, done: false },
      { id: '3-8', name: '报告生成服务', checking: false, done: false }
    ]
  },
  {
    id: '4',
    name: '医共体系统检查',
    items: [
      { id: '4-1', name: '医共体服务状态', checking: false, done: false },
      { id: '4-2', name: '远程服务器连通性', checking: false, done: false },
      { id: '4-3', name: '数据同步服务', checking: false, done: false },
      { id: '4-4', name: '远程会诊服务', checking: false, done: false },
      { id: '4-5', name: '数据提交测试', checking: false, done: false },
      { id: '4-6', name: '远程协作功能', checking: false, done: false }
    ]
  },
  {
    id: '5',
    name: '数据安全检查',
    items: [
      { id: '5-1', name: '数据库备份状态', checking: false, done: false },
      { id: '5-2', name: '数据一致性检查', checking: false, done: false },
      { id: '5-3', name: '数据加密传输', checking: false, done: false },
      { id: '5-4', name: '访问权限检查', checking: false, done: false },
      { id: '5-5', name: '安全日志审核', checking: false, done: false }
    ]
  }
])

// 过滤后的巡检项
const filteredItems = computed(() => {
  return inspectionItems.value.map(category => ({
    ...category,
    items: category.items.filter(item => {
      const matchKeyword = !searchKeyword.value || 
        item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      const matchStatus = !filterStatus.value || 
        (item.done && item.status === filterStatus.value)
      return matchKeyword && matchStatus
    })
  })).filter(category => category.items.length > 0)
})

// 开始巡检
const handleStartInspection = async () => {
  if (isInspecting.value) return
  
  const confirmed = await ElMessageBox.confirm(
    '确定要开始系统巡检吗？巡检过程可能需要几分钟时间。',
    '开始巡检',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).catch(() => false)
  
  if (!confirmed) return
  
  isInspecting.value = true
  inspectionProgress.value = 0
  activeCategories.value = []
  
  // 模拟巡检过程
  const totalItems = inspectionItems.value.reduce((sum, category) => 
    sum + category.items.length, 0)
  let checkedItems = 0
  
  for (const category of inspectionItems.value) {
    activeCategories.value = [category.id]
    
    for (const item of category.items) {
      currentInspectingItem.value = item
      item.checking = true
      
      // 模拟检查过程
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      item.checking = false
      item.done = true
      item.status = ['success', 'warning', 'error'][Math.floor(Math.random() * 3)]
      
      checkedItems++
      inspectionProgress.value = Math.floor((checkedItems / totalItems) * 100)
    }
  }
  
  isInspecting.value = false
  ElMessage.success('巡检完成')
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}

// 处理搜索和重置
const handleSearch = () => {
  tableLoading.value = true
  // 模拟搜索延迟
  setTimeout(() => {
    tableLoading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.dateRange = []
  searchForm.status = ''
  handleSearch()
}

// 处理报表查看
const handleViewReport = (row) => {
  currentReport.value = row
  reportVisible.value = true
}

// 处理导出
const handleExport = () => {
  ElMessage.success('导出Word成功')
}

const handleExportExcel = () => {
  ElMessage.success('导出Excel成功')
}

const handleExportPdf = () => {
  ElMessage.success('导出PDF成功')
}

// 获取状态图标
const getStatusIcon = (status) => {
  const icons = {
    success: CircleCheck,
    warning: Warning,
    error: CircleClose
  }
  return icons[status]
}

// 获取标签类型
const getTagType = (status) => {
  const types = {
    '正常': 'success',
    '警告': 'warning',
    '异常': 'danger'
  }
  return types[status] || 'info'
}

// 获取分类状态
const getCategoryStatus = (category) => {
  const doneItems = category.items.filter(item => item.done)
  if (doneItems.length === 0) return ''
  
  const hasError = doneItems.some(item => item.status === 'error')
  const hasWarning = doneItems.some(item => item.status === 'warning')
  
  if (hasError) return 'danger'
  if (hasWarning) return 'warning'
  return 'success'
}

// 获取分类状态文本
const getCategoryStatusText = (category) => {
  const doneItems = category.items.filter(item => item.done)
  if (doneItems.length === 0) return '未检查'
  if (doneItems.length < category.items.length) return '检查中'
  
  const status = getCategoryStatus(category)
  const texts = {
    danger: '异常',
    warning: '警告',
    success: '正常'
  }
  return texts[status] || '未知'
}

// 修改报表预览的内容
const getOverviewClass = (report) => {
  if (getErrorItems(report) > 0) return 'error'
  if (getWarningItems(report) > 0) return 'warning'
  return 'success'
}

const getOverviewIcon = (report) => {
  if (getErrorItems(report) > 0) return CircleClose
  if (getWarningItems(report) > 0) return Warning
  return CircleCheck
}

// 模拟用户数据
const users = ref([
  { id: 1, name: '管理员' },
  { id: 2, name: '运维人员1' },
  { id: 3, name: '运维人员2' }
])

// 定时巡检相关
const scheduleVisible = ref(false)
const scheduleForm = reactive({
  type: 'daily',
  time: null,
  weekday: '1',
  day: 1,
  notifications: [],
  notifyUsers: []
})

const handleSaveSchedule = () => {
  // 这里添加保存定时任务的逻辑
  ElMessage.success('定时巡检设置成功')
  scheduleVisible.value = false
}

// 处理定时巡检
const handleSchedule = () => {
  scheduleVisible.value = true
}

// 模拟系统使用数据
const cpuUsage = ref(32)
const memoryUsage = ref(45)
const diskUsage = ref(85)

// 获取项目图标
const getItemIcon = (item) => {
  const icons = {
    '1-1': Cpu,
    '1-2': Monitor,
    '1-3': DataLine,
    '2-1': Connection,
    '2-2': Link,
    '2-3': Operation
  }
  return icons[item.id] || Monitor
}

// 获取状态值
const getStatusValue = (item) => {
  const values = {
    '1-1': '32%',
    '1-2': '45%',
    '1-3': '85%',
    '2-1': '20ms',
    '2-2': '正常',
    '2-3': '同步中'
  }
  return values[item.id] || ''
}

// 获取仪表盘颜色
const getDashboardColor = (percentage) => {
  if (percentage < 60) return '#67C23A'
  if (percentage < 80) return '#E6A23C'
  return '#F56C6C'
}

// 巡检记录示例数据
const records = ref([
  {
    id: '1',
    startTime: '2024-01-20 10:00:00',
    endTime: '2024-01-20 10:05:23',
    duration: '5分23秒',
    status: '正常',
    operator: '管理员',
    results: [
      {
        category: '系统状态',
        items: [
          { name: 'CPU使用率', status: 'success', message: '32%, 正常范围内' },
          { name: '内存使用率', status: 'success', message: '45%, 正常范围内' },
          { name: '磁盘空间', status: 'warning', message: '85%, 建议及清理' },
          { name: '系统负载', status: 'success', message: '0.75, 运行正常' },
          { name: '网络状态', status: 'success', message: '延迟5ms, 正常' }
        ]
      },
      {
        category: 'HIS集成检查',
        items: [
          { name: 'HIS服务器连通性', status: 'success', message: '响应时间20ms, 连接正常' },
          { name: 'API接口可用性', status: 'success', message: '全部接口响应正常' },
          { name: '患者信息拉取', status: 'success', message: '数据同步正常' },
          { name: '医嘱信息同步', status: 'success', message: '实时同步中' }
        ]
      }
    ]
  },
  {
    id: '2',
    startTime: '2024-01-19 15:30:00',
    endTime: '2024-01-19 15:36:45',
    duration: '6分45秒',
    status: '异常',
    operator: '运维人员',
    results: [
      {
        category: '心电图系统检查',
        items: [
          { name: '心电图服务状态', status: 'error', message: '服务无响应，需要重启服务' },
          { name: 'FTP服务连通性', status: 'warning', message: '响应迟超过200ms' },
          { name: '数据上传测试', status: 'error', message: '上传失败，请检查网络配置' },
          { name: '心电图解析服务', status: 'success', message: '解析服务运行正常' }
        ]
      }
    ]
  },
  {
    id: '3',
    startTime: '2024-01-18 09:15:00',
    endTime: '2024-01-18 09:22:33',
    duration: '7分33秒',
    status: '警告',
    operator: '系统管理员',
    results: [
      {
        category: '系统状态',
        items: [
          { name: 'CPU使用率', status: 'warning', message: '76%, 负载较高' },
          { name: '内存使用率', status: 'warning', message: '82%, 接近警戒值' },
          { name: '系统负载', status: 'warning', message: '1.85, 建议优化' }
        ]
      }
    ]
  },
  {
    id: '4',
    startTime: '2024-01-17 14:00:00',
    endTime: '2024-01-17 14:08:12',
    duration: '8分12秒',
    status: '正常',
    operator: '运维人员',
    results: [
      {
        category: '医共体系统检查',
        items: [
          { name: '远程服务器连通性', status: 'warning', message: '部分节点响应缓慢' },
          { name: '数据同步服务', status: 'warning', message: '同步延迟超过10分钟' },
          { name: '远程会诊服务', status: 'success', message: '服务正常' }
        ]
      }
    ]
  },
  {
    id: '5',
    startTime: '2024-01-16 11:30:00',
    endTime: '2024-01-16 11:38:44',
    duration: '8分44秒',
    status: '异常',
    operator: '运维人员1',
    results: [
      {
        category: '数据安全检查',
        items: [
          { name: '数据库备份', status: 'error', message: '备份失败，磁盘空间不足' },
          { name: '数据一致性', status: 'error', message: '发现数据不一致，需要修复' },
          { name: '安全日志', status: 'warning', message: '发现异常登录尝试' }
        ]
      }
    ]
  }
])

// 计算总记录数
const total = computed(() => records.value.length)

// 获取报告统计数据
const getTotalItems = (report) => {
  return report?.results.reduce((sum, category) => 
    sum + category.items.length, 0) || 0
}

const getSuccessItems = (report) => {
  return report?.results.reduce((sum, category) => 
    sum + category.items.filter(item => item.status === 'success').length, 0) || 0
}

const getWarningItems = (report) => {
  return report?.results.reduce((sum, category) => 
    sum + category.items.filter(item => item.status === 'warning').length, 0) || 0
}

const getErrorItems = (report) => {
  return report?.results.reduce((sum, category) => 
    sum + category.items.filter(item => item.status === 'error').length, 0) || 0
}

// 获取错误列表
const getErrorList = (report) => {
  const errorList = []
  report.results.forEach(result => {
    result.items.forEach(item => {
      if (item.status === 'error') {
        errorList.push(`${result.category} - ${item.name}：${item.message}`)
      }
    })
  })
  return errorList
}

// 获取警告列表
const getWarningList = (report) => {
  const warningList = []
  report.results.forEach(result => {
    result.items.forEach(item => {
      if (item.status === 'warning') {
        warningList.push(`${result.category} - ${item.name}：${item.message}`)
      }
    })
  })
  return warningList
}

// 获取建议列表
const getSuggestions = (report) => {
  const suggestions = []
  report.results.forEach(result => {
    result.items.forEach(item => {
      if (item.status === 'warning' || item.status === 'error') {
        suggestions.push(generateSuggestion(item, result.category))
      }
    })
  })
  return suggestions
}

// 生成建议
const generateSuggestion = (item, category) => {
  switch (item.status) {
    case 'error':
      return `建议立即处理${category}中的${item.name}问题，${item.message}`
    case 'warning':
      return `建议关注${category}中的${item.name}，${item.message}`
    default:
      return ''
  }
}
</script>

<style scoped>
.inspection-page {
  padding: 20px;
  background-color: #f0f2f5;
  display: flex;
  gap: 20px;
  height: 100%;
}

.card-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.inspection-items {
  width: 380px;
}

.inspection-records {
  flex: 1;
  min-width: 0;
}

.records-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.records-table-container {
  flex: 1;
  overflow: auto;
}

.record-detail {
  padding: 24px;
  background-color: #fafafa;
  max-height: 400px;
  overflow: auto;
}

.items-header,
.records-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.inspection-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: transparent;
  margin-bottom: 1px;
  transition: all 0.3s;
  position: relative;
}

.inspection-item:hover {
  background-color: #f0f7ff;
}

.inspection-item.is-checking {
  background-color: #ecf5ff;
  position: relative;
}

.inspection-item.is-checking::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background-color: #409EFF;
  border-radius: 3px;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-icon {
  font-size: 18px;
  color: #606266;
  background-color: #f0f2f5;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.3s;
}

.inspection-item:hover .item-icon {
  color: #409EFF;
  background-color: #ecf5ff;
}

.item-name {
  flex: 1;
  margin-right: 16px;
  color: #303133;
  font-size: 14px;
}

.item-status {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: flex-end;
}

.status-value {
  font-size: 13px;
  padding: 2px 10px;
  border-radius: 2px;
  background-color: #f0f2f5;
  font-weight: 500;
}

.status-value.success {
  color: #67C23A;
  background-color: #f0f9eb;
}

.status-value.warning {
  color: #E6A23C;
  background-color: #fdf6ec;
}

.status-value.error {
  color: #F56C6C;
  background-color: #fef0f0;
}

.unchecked {
  color: #606266;
  font-size: 13px;
  background-color: #f4f4f5;
  padding: 2px 10px;
  border-radius: 2px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.category-title .el-icon {
  font-size: 18px;
  color: #409EFF;
}

.category-status {
  margin-left: auto;
  min-width: 48px;
  text-align: center;
}

.record-detail {
  padding: 20px;
}

.detail-item {
  margin-bottom: 24px;
}

.item-category {
  font-weight: bold;
  color: #606266;
}

.item-results {
  padding-left: 32px;
}

.item-results p {
  padding: 12px 16px;
  background-color: #f5f7fa;
  line-height: 1.5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.item-results p:last-child {
  margin-bottom: 0;
}

.report-preview {
  padding: 32px;
  background-color: #f5f7fa;
}

.report-header {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.report-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f2f5;
}

.report-title h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.report-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding: 0 16px;
}

.info-item {
  display: flex;
  align-items: center;
  min-width: 200px;
  flex: 1;
}

.info-label {
  font-size: 14px;
  color: #909399;
  min-width: 80px;
}

.info-value {
  color: #303133;
  font-weight: 500;
}

/* 报表内容区域 */
.report-content {
  margin-top: 24px;
}

/* 概览部分样式优化 */
.report-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.overview-item {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.overview-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overview-icon .el-icon {
  font-size: 24px;
  color: #fff;
}

.overview-info {
  flex: 1;
  padding: 0 4px;
}

.overview-title {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.overview-item.success .overview-icon {
  background-color: #67C23A;
}

.overview-item.warning .overview-icon {
  background-color: #E6A23C;
}

.overview-item.error .overview-icon {
  background-color: #F56C6C;
  border-top: 1px solid #dcdfe6;
}

.report-section {
  margin-bottom: 24px;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 21, 41, 0.08);
}

.report-section h4 {
  margin: 0 0 20px;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.summary-content {
  color: #606266;
}

.summary-section {
  margin-bottom: 20px;
}

.summary-section h5 {
  margin: 0 0 12px;
  color: #303133;
  font-size: 14px;
}

.error-list li {
  color: #f56c6c;
}

.warning-list li {
  color: #e6a23c;
}

.suggestion-list {
  padding-left: 28px;
  line-height: 1.8;
}

.suggestion-list li {
  color: #409EFF;
}

/* 定时巡检表单样式 */
.ml-2 {
  margin-left: 8px;
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-checkbox-group) {
  display: flex;
  gap: 16px;
}

/* 标题标签样式 */
.header-title .el-tag {
  margin-left: 12px;
}

/* 图表容器样式 */
.chart-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 4px;
  margin: 12px;
}

.chart-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.progress-label {
  display: block;
  font-size: 12px;
  color: #909399;
  line-height: 1;
}

.progress-value {
  display: block;
  font-size: 16px;
  color: #303133;
  font-weight: bold;
}

:deep(.el-collapse-item) {
  margin-bottom: 8px;
  border: none;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-collapse-item__header) {
  font-weight: 500;
  padding: 0 16px;
  height: 48px;
  line-height: 48px;
  background-color: #f5f7fa;
  border-bottom: none;
  position: relative;
}

:deep(.el-collapse-item__header)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background-color: #409EFF;
  border-radius: 3px;
}

:deep(.el-collapse-item__content) {
  padding: 0;
  background-color: #fff;
}

:deep(.el-scrollbar__bar.is-horizontal) {
  display: none;
}

:deep(.el-scrollbar__thumb) {
  background-color: rgba(144, 147, 153, 0.3);
}

:deep(.el-descriptions) {
  --el-descriptions-border-color: #f0f2f5;
  --el-descriptions-cell-padding: 16px;
}

:deep(.el-table) {
  --el-table-border-color: transparent;
  --el-table-border: none;
  --el-table-cell-border-color: #f0f2f5;
}

:deep(.el-table--border) {
  border: none;
}

:deep(.el-table th.el-table__cell) {
  background-color: #f8fafc;
  border-bottom: 1px solid #ebeef5;
}

.inspection-progress {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0, 21, 41, 0.08);
  animation: slideUp 0.3s ease-out;
}

.progress-wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
}

.progress-info {
  margin-top: 16px;
  text-align: center;
}

.progress-text {
  margin: 8px 0 0;
  text-align: center;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.progress-percentage {
  font-size: 14px;
  font-weight: bold;
  color: #409EFF;
  margin-left: auto;
}

.progress-text .el-icon {
  font-size: 16px;
  color: #409EFF;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.inspection-filter {
  padding: 16px 20px;
  border-bottom: 1px solid #dcdfe6;
  background: linear-gradient(to bottom, #fff, #fafafa);
}

.filter-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  background-color: #fff;
  box-shadow: 0 0 0 1px #dcdfe6;
  border-radius: 4px;
  padding: 1px;
  transition: all 0.3s;
}

.search-input {
  flex: 1;
}

.search-button {
  margin: -1px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.status-filter {
  min-width: 140px;
}

.status-filter :deep(.el-select) {
  width: 100%;
}

.status-filter :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 !important;
}

.status-filter :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc !important;
}

.status-filter :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409EFF !important;
}

.select-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.status-icon {
  font-size: 16px;
}

.status-icon.success {
  color: #67C23A;
}

.status-icon.warning {
  color: #E6A23C;
}

.status-icon.error {
  color: #F56C6C;
}

.select-label {
  color: #606266;
}

.records-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  min-height: 0;
  overflow: auto;
}

.records-filter {
  padding: 20px 0;
  background-color: #fff;
  border-bottom: 1px solid #f0f2f5;
}

.records-filter :deep(.el-form) {
  display: flex;
  align-items: center;
  gap: 16px;
}

.records-filter :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.records-filter :deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
  padding-right: 12px;
}

.form-buttons {
  display: flex;
  gap: 8px;
}

.records-table {
  margin-top: 20px;
}

/* 优化表格样式 */
:deep(.el-table) {
  --el-table-border-color: transparent;
  --el-table-border: none;
  --el-table-cell-border-color: #f0f2f5;
  --el-table-header-bg-color: #fafafa;
  --el-table-row-hover-bg-color: #f5f7fa;
}

:deep(.el-table--border) {
  border: none;
}

:deep(.el-table th.el-table__cell) {
  font-weight: 500;
  color: #606266;
  padding: 12px 0;
}

:deep(.el-table td.el-table__cell) {
  padding: 16px 0;
}

:deep(.el-table__expand-column .el-table__cell) {
  padding: 0;
}

.table-footer {
  padding: 20px 0;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f2f5;
  background-color: #fff;
  position: sticky;
  bottom: 0;
  z-index: 1;
}

.record-detail {
  padding: 24px;
  background-color: #fafafa;
  max-height: 400px;
  overflow: auto;
  position: relative;
}

.detail-item {
  margin-bottom: 24px;
  padding: 0 16px;
}

.item-category {
  font-weight: bold;
  color: #606266;
  margin-bottom: 12px;
  display: block;
}

.item-results {
  padding-left: 32px;
}

.item-results p {
  padding: 12px 16px;
  background-color: #f5f7fa;
  line-height: 1.5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.item-results p:last-child {
  margin-bottom: 0;
}

/* 结论与建议样式 */
.conclusion-section {
  margin-top: 24px;
}

.conclusion-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.conclusion-block {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 16px 20px;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 15px;
}

.conclusion-block.error {
  background-color: #fef0f0;
}

.conclusion-block.error .block-header {
  color: #f56c6c;
}

.conclusion-block.warning {
  background-color: #fdf6ec;
}

.conclusion-block.warning .block-header {
  color: #e6a23c;
}

.conclusion-block.suggestion {
  background-color: #ecf5ff;
}

.conclusion-block.suggestion .block-header {
  color: #409eff;
}

.error-list,
.warning-list,
.suggestion-list {
  margin: 0;
  padding-left: 24px;
  line-height: 1.8;
}

.error-list li {
  color: #f56c6c;
}

.warning-list li {
  color: #e6a23c;
}

.suggestion-list li {
  color: #409eff;
}

/* 优化图标样式 */
.block-header .el-icon {
  font-size: 18px;
}
</style> 