<template>
  <div class="ecg-viewer">
    <div class="viewer-toolbar">
      <div class="tool-group">
        <el-button-group>
          <el-tooltip content="放大" placement="top">
            <el-button :icon="ZoomIn" @click="handleZoomIn" />
          </el-tooltip>
          <el-tooltip content="缩小" placement="top">
            <el-button :icon="ZoomOut" @click="handleZoomOut" />
          </el-tooltip>
          <el-tooltip content="重置" placement="top">
            <el-button :icon="RefreshRight" @click="handleReset" />
          </el-tooltip>
        </el-button-group>
      </div>

      <div class="tool-group">
        <el-tooltip content="测量工具" placement="top">
          <el-button :icon="Ruler" @click="toggleMeasureTool" />
        </el-tooltip>
        <el-tooltip content="标记" placement="top">
          <el-button :icon="EditPen" @click="toggleMarkTool" />
        </el-tooltip>
      </div>

      <div class="tool-group">
        <el-tooltip content="增大增益" placement="top">
          <el-button :icon="TopRight" @click="handleGainIncrease" />
        </el-tooltip>
        <el-tooltip content="减小增益" placement="top">
          <el-button :icon="BottomRight" @click="handleGainDecrease" />
        </el-tooltip>
        <el-tooltip content="增大速度" placement="top">
          <el-button :icon="Right" @click="handleSpeedIncrease" />
        </el-tooltip>
        <el-tooltip content="减小速度" placement="top">
          <el-button :icon="Left" @click="handleSpeedDecrease" />
        </el-tooltip>
      </div>
    </div>

    <div class="viewer-scroll-container">
      <div class="viewer-container" ref="containerRef">
        <canvas ref="canvasRef" class="ecg-canvas"></canvas>
        
        <!-- 测量工具层 -->
        <div v-show="showMeasureTool" class="measure-layer">
          <div class="measure-line" :style="measureLineStyle"></div>
          <div class="measure-info">{{ measureInfo }}</div>
        </div>

        <!-- 标记工具层 -->
        <div v-show="showMarkTool" class="mark-layer"></div>
      </div>
    </div>

    <div class="viewer-footer">
      <div class="scale-info">
        <span>增益: {{ gain }}mm/mV</span>
        <span>速度: {{ speed }}mm/s</span>
        <span>缩放: {{ zoom }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch, nextTick } from 'vue'
import {
  ZoomIn,
  ZoomOut,
  RefreshRight,
  ScaleToOriginal as Ruler,
  EditPen,
  CaretTop as TopRight,
  CaretBottom as BottomRight,
  CaretRight as Right,
  CaretLeft as Left
} from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      I: [], II: [], III: [],
      aVR: [], aVL: [], aVF: [],
      V1: [], V2: [], V3: [],
      V4: [], V5: [], V6: []
    })
  }
})

const emit = defineEmits(['measure', 'mark'])

// 引用
const containerRef = ref(null)
const canvasRef = ref(null)

// 状态
const zoom = ref(100)
const gain = ref(5)  // 5mm/mV
const speed = ref(25) // 25mm/s
const showMeasureTool = ref(false)
const showMarkTool = ref(false)
const measureLineStyle = ref({})
const measureInfo = ref('')

// 导联配置
const LEADS = [
  { label: 'I', value: 'I' },
  { label: 'II', value: 'II' },
  { label: 'III', value: 'III' },
  { label: 'aVR', value: 'aVR' },
  { label: 'aVL', value: 'aVL' },
  { label: 'aVF', value: 'aVF' },
  { label: 'V1', value: 'V1' },
  { label: 'V2', value: 'V2' },
  { label: 'V3', value: 'V3' },
  { label: 'V4', value: 'V4' },
  { label: 'V5', value: 'V5' },
  { label: 'V6', value: 'V6' }
]

// 图例配置
const LEGEND = {
  gain: '5mm/mV',
  speed: '25mm/s',
  grid: {
    small: '1mm',
    large: '5mm'
  }
}

// 缩放控制
const handleZoomIn = () => {
  zoom.value = Math.min(zoom.value + 10, 200)
  // 重新计算画布宽度
  const canvas = canvasRef.value
  const pixelsPerMm = 8 * (zoom.value / 100)
  const timeWidth = 20 * speed.value * pixelsPerMm  // 20秒的宽度
  const leftMargin = 80
  canvas.width = timeWidth + leftMargin
  redrawAll()
}

const handleZoomOut = () => {
  zoom.value = Math.max(zoom.value - 10, 50)
  // 重新计算画布宽度
  const canvas = canvasRef.value
  const pixelsPerMm = 8 * (zoom.value / 100)
  const timeWidth = 20 * speed.value * pixelsPerMm  // 20秒的宽度
  const leftMargin = 80
  canvas.width = timeWidth + leftMargin
  redrawAll()
}

const handleReset = () => {
  zoom.value = 100
  // 重新计算画布宽度
  const canvas = canvasRef.value
  const pixelsPerMm = 8 * (zoom.value / 100)
  const timeWidth = 20 * speed.value * pixelsPerMm  // 20秒的宽度
  const leftMargin = 80
  canvas.width = timeWidth + leftMargin
  redrawAll()
}

// 增益控制
const handleGainIncrease = () => {
  // 增益标准档位：5, 10, 20, 40 mm/mV
  const gains = [5, 10, 20, 40]
  const currentIndex = gains.indexOf(gain.value)
  if (currentIndex < gains.length - 1) {
    gain.value = gains[currentIndex + 1]
    redrawAll()
  }
}

const handleGainDecrease = () => {
  // 增益标准档位：5, 10, 20, 40 mm/mV
  const gains = [5, 10, 20, 40]
  const currentIndex = gains.indexOf(gain.value)
  if (currentIndex > 0) {
    gain.value = gains[currentIndex - 1]
    redrawAll()
  }
}

// 速度控制
const handleSpeedIncrease = () => {
  // 走纸速度标准档位：12.5, 25, 50 mm/s
  const speeds = [12.5, 25, 50]
  const currentIndex = speeds.indexOf(speed.value)
  if (currentIndex < speeds.length - 1) {
    speed.value = speeds[currentIndex + 1]
    // 重新计算画布宽度
    const canvas = canvasRef.value
    const pixelsPerMm = 8 * (zoom.value / 100)
    const timeWidth = 20 * speed.value * pixelsPerMm  // 20秒的宽度
    const leftMargin = 80
    canvas.width = timeWidth + leftMargin
    redrawAll()
  }
}

const handleSpeedDecrease = () => {
  // 走纸速度标准档位：12.5, 25, 50 mm/s
  const speeds = [12.5, 25, 50]
  const currentIndex = speeds.indexOf(speed.value)
  if (currentIndex > 0) {
    speed.value = speeds[currentIndex - 1]
    // 重新计算画布宽度
    const canvas = canvasRef.value
    const pixelsPerMm = 8 * (zoom.value / 100)
    const timeWidth = 20 * speed.value * pixelsPerMm  // 20秒的宽度
    const leftMargin = 80
    canvas.width = timeWidth + leftMargin
    redrawAll()
  }
}

// 工具控制
const toggleMeasureTool = () => {
  showMeasureTool.value = !showMeasureTool.value
  if (showMeasureTool.value) {
    showMarkTool.value = false
  }
}

const toggleMarkTool = () => {
  showMarkTool.value = !showMarkTool.value
  if (showMarkTool.value) {
    showMeasureTool.value = false
  }
}

// 重绘所有导联
const redrawAll = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 绘制网格
  drawGrid(ctx)
  
  // 绘制图例
  drawLegend(ctx)
  
  // 计算每个导联的高度和间距
  const pixelsPerMm = 8 * (zoom.value / 100)
  const leadHeight = 15 * pixelsPerMm  // 15mm（3个大格子）
  const leadSpacing = 2.5 * pixelsPerMm  // 2.5mm（0.5个大格子）的间距
  
  // 绘制每个导联
  LEADS.forEach((lead, index) => {
    const y = index * (leadHeight + leadSpacing)
    drawLead(ctx, lead, props.data[lead.value] || [], y, leadHeight)
  })
}

// 绘制单个导联
const drawLead = (ctx, lead, data, y, height) => {
  const { width } = ctx.canvas
  const centerY = y + height / 2
  
  // 绘制导联标签
  ctx.save()
  ctx.font = 'bold 16px Arial'
  ctx.fillStyle = '#333'
  ctx.textBaseline = 'middle'
  ctx.fillText(lead.label, 20, centerY)
  ctx.restore()
  
  // 绘制心电图波形
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1.5
  
  // 计算比例（1mV = 10mm，1秒 = 25mm）
  const pixelsPerMm = 8 * (zoom.value / 100)  // 1mm = 8px 基准
  const mVToPixel = gain.value * pixelsPerMm  // 每毫伏对应的像素数
  const msToPixel = (speed.value / 1000) * pixelsPerMm  // 每毫秒对应的像素数
  
  // 绘制波形
  const startX = 80
  const samplingInterval = 2
  
  data.forEach((point, index) => {
    const x = startX + (index * samplingInterval * msToPixel)
    if (x > width) return
    
    const pointY = centerY - (point * mVToPixel)
    
    if (index === 0) {
      ctx.moveTo(x, pointY)
    } else {
      ctx.lineTo(x, pointY)
    }
  })
  
  ctx.stroke()
  ctx.restore()
  
  // 绘制校准信号（1mV = 10mm）
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1.5
  
  const calibX = 60
  const calibHeight = gain.value * pixelsPerMm
  
  ctx.moveTo(calibX, centerY - calibHeight)
  ctx.lineTo(calibX, centerY + calibHeight)
  
  ctx.stroke()
  ctx.restore()
}

// 绘制图例
const drawLegend = (ctx) => {
  ctx.save()
  ctx.font = '12px Arial'
  ctx.fillStyle = '#666'
  
  // 绘制增益和速度信息
  ctx.fillText(`增益: ${gain.value}mm/mV`, 10, 20)
  ctx.fillText(`速度: ${speed.value}mm/s`, 120, 20)
  
  // 绘制网格说明
  ctx.fillText(`小格: 1mm`, 230, 20)
  ctx.fillText(`大格: 5mm`, 340, 20)
  
  ctx.restore()
}

// 绘制网格
const drawGrid = (ctx) => {
  const { width, height } = ctx.canvas
  
  // 网格配置（1mm = 8px 基准）
  const pixelsPerMm = 8 * (zoom.value / 100)
  const smallGrid = pixelsPerMm  // 1mm小格
  const largeGrid = smallGrid * 5   // 5mm大格（1个大格子）
  const boldGrid = largeGrid * 5    // 25mm超大格（5个大格子）
  
  // 绘制小格子（浅粉色）
  ctx.beginPath()
  ctx.strokeStyle = '#ffebee'
  ctx.lineWidth = 0.5
  
  for (let x = 0; x <= width; x += smallGrid) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let y = 0; y <= height; y += smallGrid) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.stroke()
  
  // 绘制大格子（粉色）
  ctx.beginPath()
  ctx.strokeStyle = '#ffcdd2'
  ctx.lineWidth = 0.8
  
  for (let x = 0; x <= width; x += largeGrid) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let y = 0; y <= height; y += largeGrid) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.stroke()
  
  // 绘制超大格子（深粉���）
  ctx.beginPath()
  ctx.strokeStyle = '#ef9a9a'
  ctx.lineWidth = 1
  
  for (let x = 0; x <= width; x += boldGrid) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let y = 0; y <= height; y += boldGrid) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.stroke()
}

// 监听数据变化
watch(() => props.data, (newData) => {
  if (Object.keys(newData).length > 0) {
    nextTick(() => {
      redrawAll()
    })
  }
}, { deep: true, immediate: true })

// 初始化
onMounted(() => {
  const canvas = canvasRef.value
  const container = containerRef.value
  
  // 设置画布大小
  const pixelsPerMm = 8 * (zoom.value / 100)  // 1mm = 8px 基准
  const timeWidth = 20 * speed.value * pixelsPerMm  // 20秒的宽度
  const leftMargin = 80
  canvas.width = timeWidth + leftMargin
  
  // 计算画布高度
  // 每个导联3个大格子（15mm）+ 0.5个大格子间距（2.5mm）
  // 12个导联总共需要：12 * 15mm + 11 * 2.5mm = 207.5mm
  canvas.height = 207.5 * pixelsPerMm  // 207.5mm转换为像素
  
  // 初始绘制
  if (Object.keys(props.data).length > 0) {
    redrawAll()
  }
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    const pixelsPerMm = 8 * (zoom.value / 100)
    const timeWidth = 20 * speed.value * pixelsPerMm  // 20秒的宽度
    canvas.width = timeWidth + leftMargin
    canvas.height = 207.5 * pixelsPerMm
    redrawAll()
  })
})
</script>

<style scoped>
.ecg-viewer {
  display: flex;
  flex-direction: column;
  height: auto;
  background-color: #ffffff;
  overflow: visible;
}

.viewer-toolbar {
  padding: 8px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  gap: 16px;
  flex-shrink: 0;
  background-color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 1;
}

.tool-group {
  display: flex;
  gap: 8px;
}

.viewer-scroll-container {
  flex: none;
  padding: 10px 0;
  overflow-x: auto;
  overflow-y: visible;
  width: 100%;
}

.viewer-container {
  position: relative;
  min-width: 100%;
  padding: 0 16px;
  display: inline-block;
  white-space: nowrap;
  overflow: visible;
}

.ecg-canvas {
  display: block;
  background-color: #ffffff;
}

.measure-layer,
.mark-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.measure-line {
  position: absolute;
  background-color: rgba(64, 158, 255, 0.5);
}

.measure-info {
  position: absolute;
  background-color: rgba(64, 158, 255, 0.9);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.viewer-footer {
  padding: 8px;
  border-top: 1px solid #dcdfe6;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.scale-info {
  display: flex;
  gap: 16px;
  color: #606266;
  font-size: 12px;
}
</style> 