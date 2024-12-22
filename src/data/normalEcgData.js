// 正常心电图测试数据 - 20秒
// 采样率: 500Hz
// 心率: 75次/分
// 振幅单位: mV

function generateNormalEcgCycle() {
  // 一个完整的PQRST波形周期
  const cycle = []
  
  // P波 (80ms, 0.1-0.2mV)
  for (let i = 0; i < 40; i++) {
    cycle.push(0.15 * Math.sin(Math.PI * i / 40))
  }
  
  // PR段 (50ms)
  for (let i = 0; i < 25; i++) {
    cycle.push(0)
  }
  
  // QRS波群 (80-100ms, Q:-0.1-0.2mV, R:1-2mV, S:-0.2-0.5mV)
  cycle.push(-0.15) // Q波
  for (let i = 0; i < 10; i++) {
    cycle.push(1.5 * Math.pow(Math.sin(Math.PI * i / 10), 2)) // R波
  }
  cycle.push(-0.3) // S波
  
  // ST段 (100ms)
  for (let i = 0; i < 50; i++) {
    cycle.push(0)
  }
  
  // T波 (160ms, 0.2-0.3mV)
  for (let i = 0; i < 80; i++) {
    cycle.push(0.25 * Math.sin(Math.PI * i / 80))
  }
  
  // 等电位线
  for (let i = 0; i < 95; i++) {
    cycle.push(0)
  }
  
  return cycle
}

// 生成20秒的数据
function generate20SecondsData() {
  const baseCycle = generateNormalEcgCycle()
  const cycleLength = baseCycle.length // 一个周期的采样点数
  const totalPoints = 500 * 20 // 20秒 * 500Hz = 10000个采样点
  
  // 为每个导联生成稍有变化的数据
  const leads = {
    I: [],
    II: [],
    III: [],
    aVR: [],
    aVL: [],
    aVF: [],
    V1: [],
    V2: [],
    V3: [],
    V4: [],
    V5: [],
    V6: []
  }
  
  // 生成20秒的数据
  for (let i = 0; i < totalPoints; i++) {
    const cycleIndex = i % cycleLength
    const baseValue = baseCycle[cycleIndex]
    
    // 添加微小的随机变化，模拟实际心电图的细微变化
    const noise = Math.random() * 0.02 - 0.01
    
    // 为每个导联设置不同的振幅和极性
    leads.I.push(baseValue * 1.0 + noise)
    leads.II.push(baseValue * 1.2 + noise)
    leads.III.push(baseValue * 0.8 + noise)
    leads.aVR.push(baseValue * -0.5 + noise)
    leads.aVL.push(baseValue * 0.7 + noise)
    leads.aVF.push(baseValue * 0.9 + noise)
    leads.V1.push(baseValue * 1.1 + noise)
    leads.V2.push(baseValue * 1.8 + noise)
    leads.V3.push(baseValue * 2.0 + noise)
    leads.V4.push(baseValue * 1.7 + noise)
    leads.V5.push(baseValue * 1.2 + noise)
    leads.V6.push(baseValue * 0.9 + noise)
  }
  
  return leads
}

export const normalEcgData = generate20SecondsData() 