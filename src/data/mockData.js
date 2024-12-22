// 用户管理示例数据
export const userList = [
  {
    id: 1,
    username: 'admin',
    realName: '管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    role: '超级管理员',
    status: '1',
    createTime: '2024-03-14 12:00:00'
  },
  {
    id: 2,
    username: 'doctor1',
    realName: '张医生',
    phone: '13800138001',
    email: 'doctor1@example.com',
    role: '医生',
    status: '1',
    createTime: '2024-03-14 13:00:00'
  },
  {
    id: 3,
    username: 'nurse1',
    realName: '李护士',
    phone: '13800138002',
    email: 'nurse1@example.com',
    role: '护士',
    status: '1',
    createTime: '2024-03-14 14:00:00'
  }
]

// 设备管理示例数据
export const deviceList = [
  {
    id: 1,
    deviceNo: 'ECG-001',
    deviceName: '心电图机',
    model: 'Model-A',
    manufacturer: '飞利浦',
    purchaseDate: '2023-01-01',
    status: '1', // 1: 正常, 0: 故障, 2: 维修中
    department: '心内科',
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-05-15'
  },
  {
    id: 2,
    deviceNo: 'ECG-002',
    deviceName: '心电图机',
    model: 'Model-B',
    manufacturer: 'GE',
    purchaseDate: '2023-03-15',
    status: '1',
    department: '急诊科',
    lastMaintenance: '2024-02-20',
    nextMaintenance: '2024-05-20'
  }
]

// 患者管理示例数据
export const patientList = [
  {
    id: 1,
    patientNo: 'P202401001',
    name: '王患者',
    gender: '男',
    age: 45,
    phone: '13900139000',
    idCard: '310101197901011234',
    address: '上海市浦东新区XX路XX号',
    lastVisit: '2024-03-10',
    status: '在诊'
  },
  {
    id: 2,
    patientNo: 'P202401002',
    name: '张患者',
    gender: '女',
    age: 32,
    phone: '13900139001',
    idCard: '310101199001011234',
    address: '上海市黄浦区XX路XX号',
    lastVisit: '2024-03-12',
    status: '复诊'
  }
]

// 病例管理示例数据
export const caseList = [
  {
    id: 1,
    caseNo: 'C202401001',
    patientName: '王患者',
    patientNo: 'P202401001',
    department: '心内科',
    doctor: '张医生',
    diagnosis: '心律不齐',
    visitDate: '2024-03-10',
    status: '已完成'
  },
  {
    id: 2,
    caseNo: 'C202401002',
    patientName: '张患者',
    patientNo: 'P202401002',
    department: '心内科',
    doctor: '张医生',
    diagnosis: '心绞痛',
    visitDate: '2024-03-12',
    status: '进行中'
  }
]

// 心电图记录示例数据
export const ecgList = [
  {
    id: 1,
    recordNo: 'ECG202401001',
    patientName: '王患者',
    patientNo: 'P202401001',
    deviceNo: 'ECG-001',
    recordTime: '2024-03-10 09:30:00',
    doctor: '张医生',
    result: '异常',
    status: '已审核'
  },
  {
    id: 2,
    recordNo: 'ECG202401002',
    patientName: '张患者',
    patientNo: 'P202401002',
    deviceNo: 'ECG-002',
    recordTime: '2024-03-12 10:30:00',
    doctor: '张医生',
    result: '正常',
    status: '待审核'
  }
]

// 医共体机构示例数据
export const institutionList = [
  {
    id: 1,
    institutionNo: 'H001',
    institutionName: '第一人民医院',
    level: '三级甲等',
    address: '上海市XX区XX路XX号',
    contact: '张院长',
    phone: '021-12345678',
    status: '1'
  },
  {
    id: 2,
    institutionNo: 'H002',
    institutionName: '社区卫生服务中心',
    level: '一级',
    address: '上海市XX区XX路XX号',
    contact: '李主任',
    phone: '021-12345679',
    status: '1'
  }
]

// HIS接口日志示例数据
export const hisLogList = [
  {
    id: 1,
    interfaceName: '患者信息同步',
    requestTime: '2024-03-14 10:00:00',
    responseTime: '2024-03-14 10:00:01',
    status: '成功',
    errorMsg: null,
    requestData: '{"patientNo":"P202401001"}',
    responseData: '{"code":200,"message":"success"}'
  },
  {
    id: 2,
    interfaceName: '病例信息同步',
    requestTime: '2024-03-14 10:01:00',
    responseTime: '2024-03-14 10:01:01',
    status: '失败',
    errorMsg: '连接超时',
    requestData: '{"caseNo":"C202401001"}',
    responseData: null
  }
]

// 运维日志示例数据
export const operationLogList = [
  {
    id: 1,
    operationType: '设备维护',
    operator: '张工程师',
    operationTime: '2024-03-14 09:00:00',
    deviceNo: 'ECG-001',
    content: '完成常规维护检查',
    result: '正常'
  },
  {
    id: 2,
    operationType: '故障维修',
    operator: '李工程师',
    operationTime: '2024-03-14 14:00:00',
    deviceNo: 'ECG-002',
    content: '更换传感器',
    result: '已修复'
  }
]

// 权限菜单树
export const menuTree = [
  {
    id: 1,
    name: '系统管理',
    code: 'system',
    type: 'menu',
    icon: 'Setting',
    path: '/system',
    sort: 1,
    children: [
      {
        id: 11,
        name: '用户管理',
        code: 'system:user',
        type: 'menu',
        icon: 'User',
        path: '/system/users',
        sort: 1,
        children: [
          { id: 111, name: '查看用户', code: 'system:user:view', type: 'permission' },
          { id: 112, name: '新增用户', code: 'system:user:add', type: 'permission' },
          { id: 113, name: '编辑用户', code: 'system:user:edit', type: 'permission' },
          { id: 114, name: '删除用户', code: 'system:user:delete', type: 'permission' }
        ]
      },
      {
        id: 12,
        name: '角色管理',
        code: 'system:role',
        type: 'menu',
        icon: 'UserFilled',
        path: '/system/roles',
        sort: 2,
        children: [
          { id: 121, name: '查看角色', code: 'system:role:view', type: 'permission' },
          { id: 122, name: '新增角色', code: 'system:role:add', type: 'permission' },
          { id: 123, name: '编辑角色', code: 'system:role:edit', type: 'permission' },
          { id: 124, name: '删除角色', code: 'system:role:delete', type: 'permission' }
        ]
      },
      {
        id: 13,
        name: '权限管理',
        code: 'system:permission',
        type: 'menu',
        icon: 'Key',
        path: '/system/permissions',
        sort: 3,
        children: [
          { id: 131, name: '查看权限', code: 'system:permission:view', type: 'permission' },
          { id: 132, name: '新增权限', code: 'system:permission:add', type: 'permission' },
          { id: 133, name: '编辑权限', code: 'system:permission:edit', type: 'permission' },
          { id: 134, name: '删除权限', code: 'system:permission:delete', type: 'permission' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '设备管理',
    code: 'device',
    type: 'menu',
    icon: 'Monitor',
    path: '/devices',
    sort: 2,
    children: [
      {
        id: 21,
        name: '设备列表',
        code: 'device:list',
        type: 'menu',
        icon: 'List',
        path: '/devices/list',
        sort: 1,
        children: [
          { id: 211, name: '查看设备', code: 'device:list:view', type: 'permission' },
          { id: 212, name: '新增设备', code: 'device:list:add', type: 'permission' },
          { id: 213, name: '编辑设备', code: 'device:list:edit', type: 'permission' },
          { id: 214, name: '删除设备', code: 'device:list:delete', type: 'permission' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '患者管理',
    code: 'patient',
    type: 'menu',
    icon: 'User',
    path: '/patients',
    sort: 3,
    children: [
      {
        id: 31,
        name: '患者列表',
        code: 'patient:list',
        type: 'menu',
        icon: 'List',
        path: '/patients/list',
        sort: 1,
        children: [
          { id: 311, name: '查看患者', code: 'patient:list:view', type: 'permission' },
          { id: 312, name: '新增患者', code: 'patient:list:add', type: 'permission' },
          { id: 313, name: '编辑患者', code: 'patient:list:edit', type: 'permission' },
          { id: 314, name: '删除患者', code: 'patient:list:delete', type: 'permission' }
        ]
      },
      {
        id: 32,
        name: '病例管理',
        code: 'patient:case',
        type: 'menu',
        icon: 'Document',
        path: '/patients/cases',
        sort: 2,
        children: [
          { id: 321, name: '查看病例', code: 'patient:case:view', type: 'permission' },
          { id: 322, name: '新增病例', code: 'patient:case:add', type: 'permission' },
          { id: 323, name: '编辑病例', code: 'patient:case:edit', type: 'permission' },
          { id: 324, name: '删除病例', code: 'patient:case:delete', type: 'permission' }
        ]
      }
    ]
  },
  {
    id: 4,
    name: '心电图记录',
    code: 'ecg',
    type: 'menu',
    icon: 'TrendCharts',
    path: '/ecg',
    sort: 4,
    children: [
      {
        id: 41,
        name: '记录列表',
        code: 'ecg:list',
        type: 'menu',
        icon: 'List',
        path: '/ecg/records',
        sort: 1,
        children: [
          { id: 411, name: '查看记录', code: 'ecg:list:view', type: 'permission' },
          { id: 412, name: '新增记录', code: 'ecg:list:add', type: 'permission' },
          { id: 413, name: '编辑记录', code: 'ecg:list:edit', type: 'permission' },
          { id: 414, name: '删除记录', code: 'ecg:list:delete', type: 'permission' }
        ]
      }
    ]
  },
  {
    id: 5,
    name: '医共体机构',
    code: 'institution',
    type: 'menu',
    icon: 'Office',
    path: '/institutions',
    sort: 5,
    children: [
      {
        id: 51,
        name: '机构列表',
        code: 'institution:list',
        type: 'menu',
        icon: 'List',
        path: '/institutions/list',
        sort: 1,
        children: [
          { id: 511, name: '查看机构', code: 'institution:list:view', type: 'permission' },
          { id: 512, name: '新增机构', code: 'institution:list:add', type: 'permission' },
          { id: 513, name: '编辑机构', code: 'institution:list:edit', type: 'permission' },
          { id: 514, name: '删除机构', code: 'institution:list:delete', type: 'permission' }
        ]
      }
    ]
  },
  {
    id: 6,
    name: '系统日志',
    code: 'log',
    type: 'menu',
    icon: 'Document',
    path: '/logs',
    sort: 6,
    children: [
      {
        id: 61,
        name: 'HIS对接日志',
        code: 'log:his',
        type: 'menu',
        icon: 'Connection',
        path: '/logs/his',
        sort: 1,
        children: [
          { id: 611, name: '查看日志', code: 'log:his:view', type: 'permission' }
        ]
      },
      {
        id: 62,
        name: '运维日志',
        code: 'log:operation',
        type: 'menu',
        icon: 'Operation',
        path: '/logs/operations',
        sort: 2,
        children: [
          { id: 621, name: '查看日志', code: 'log:operation:view', type: 'permission' }
        ]
      }
    ]
  },
  {
    id: 7,
    name: 'HIS对接',
    code: 'his',
    type: 'menu',
    icon: 'Connection',
    path: '/his',
    sort: 7,
    children: [
      {
        id: 71,
        name: '接口管理',
        code: 'his:config',
        type: 'menu',
        icon: 'Setting',
        path: '/his/interfaces',
        sort: 1,
        children: [
          { id: 711, name: '查看', code: 'his:config:view', type: 'permission' },
          { id: 712, name: '编辑', code: 'his:config:edit', type: 'permission' }
        ]
      }
    ]
  }
]

// 其他 mock 数据... 