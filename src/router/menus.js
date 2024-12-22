// 仪表盘
const dashboard = {
  path: 'dashboard',
  name: 'Dashboard',
  component: () => import('@/views/DashboardNew.vue'),
  meta: { 
    title: '仪表盘', 
    icon: 'Odometer',
    requiresAuth: true 
  }
}

// 设备管理
const devices = {
  path: 'devices',
  name: 'Devices',
  meta: { 
    title: '设备管理',
    icon: 'Monitor'
  },
  children: [
    {
      path: 'ecg',
      name: 'EcgDevices',
      component: () => import('@/views/devices/EcgDevices.vue'),
      meta: { 
        title: '心电设备',
        icon: 'Monitor'
      }
    },
    {
      path: 'ecg/:deviceNo',
      name: 'EcgDeviceDetail',
      component: () => import('@/views/devices/EcgDetail.vue'),
      meta: {
        title: '设备详情',
        hidden: true
      }
    }
  ]
}

// 患者管理
const patients = {
  path: 'patients',
  name: 'Patients',
  meta: { 
    title: '患者管理',
    icon: 'User'
  },
  children: [
    {
      path: 'list',
      name: 'PatientList',
      component: () => import('@/views/patients/List.vue'),
      meta: { 
        title: '患者列表',
        icon: 'List'
      }
    },
    {
      path: '/patients/:id',
      name: 'PatientDetail',
      component: () => import('@/views/patients/Detail.vue'),
      meta: {
        title: '患者详情',
        hidden: true,
        requiresAuth: true
      }
    },
    {
      path: 'records',
      name: 'PatientRecords',
      component: () => import('@/views/patients/Records.vue'),
      meta: { 
        title: '就诊记录',
        icon: 'Document'
      }
    },
    {
      path: 'ecg',
      name: 'PatientEcg',
      component: () => import('@/views/patients/EcgList.vue'),
      meta: { 
        title: '心电记录',
        icon: 'TrendCharts'
      }
    },
    {
      path: '/ecg/:id',
      name: 'EcgDetail',
      component: () => import('@/views/patients/EcgDetail.vue'),
      meta: {
        title: '心电图详情',
        hidden: true,
        requiresAuth: true
      }
    },
    {
      path: '/ecg/:id/diagnosis',
      name: 'EcgDiagnosis',
      component: () => import('@/views/patients/EcgDiagnosis.vue'),
      meta: {
        title: '心电图判读',
        hidden: true,
        requiresAuth: true
      }
    },
    {
      path: 'his-cases',
      name: 'HisCases',
      component: () => import('@/views/patients/HisCases.vue'),
      meta: { 
        title: 'HIS病例',
        icon: 'Connection'
      }
    },
    {
      path: '/his-cases/:id',
      name: 'HisCaseDetail',
      component: () => import('@/views/patients/HisCaseDetail.vue'),
      meta: {
        title: 'HIS病例详情',
        hidden: true,
        requiresAuth: true
      }
    }
  ]
}

// 就诊管理
const visits = {
  path: 'visits',
  name: 'Visits',
  meta: { 
    title: '就诊管理',
    icon: 'Document'
  },
  children: [
    {
      path: 'records',
      name: 'VisitRecords',
      component: () => import('@/views/patients/Records.vue'),
      meta: { 
        title: '就诊记录',
        icon: 'List'
      }
    },
    {
      path: ':visitNo',
      name: 'VisitDetail',
      component: () => import('@/views/visits/Detail.vue'),
      meta: {
        title: '就诊详情',
        hidden: true
      }
    }
  ]
}

// 运维管理
const operation = {
  path: 'operation',
  name: 'Operation',
  meta: { 
    title: '运维管理',
    icon: 'Operation'
  },
  children: [
    {
      path: 'monitor',
      name: 'OperationMonitor',
      component: () => import('@/views/operation/Monitor.vue'),
      meta: { 
        title: '运行监控',
        icon: 'Monitor'
      }
    },
    {
      path: 'logs',
      name: 'OperationLogs',
      component: () => import('@/views/operation/Logs.vue'),
      meta: { 
        title: '运维日志',
        icon: 'Document'
      }
    },
    {
      path: 'alerts',
      name: 'Alerts',
      component: () => import('@/views/operation/Alerts.vue'),
      meta: { 
        title: '告警管理',
        icon: 'Warning'
      }
    },
    {
      path: '/alerts/:id',
      name: 'AlertDetail',
      component: () => import('@/views/operation/AlertDetail.vue'),
      meta: {
        title: '告警详情',
        hidden: true,
        requiresAuth: true
      }
    },
    {
      path: 'inspection',
      name: 'OperationInspection',
      component: () => import('@/views/operation/Inspection.vue'),
      meta: { 
        title: '一键巡检',
        icon: 'Search'
      }
    }
  ]
}

// HIS对接
const his = {
  path: 'his',
  name: 'His',
  meta: { 
    title: 'HIS对接',
    icon: 'Connection'
  },
  children: [
    {
      path: 'interfaces',
      name: 'HisInterfaces',
      component: () => import('@/views/his/Interfaces.vue'),
      meta: { 
        title: '接口管理',
        icon: 'Setting'
      }
    },
    {
      path: 'config',
      name: 'HisConfig',
      component: () => import('@/views/his/Config.vue'),
      meta: { 
        title: '对接配置',
        icon: 'Tools'
      }
    },
    {
      path: 'logs',
      name: 'HisLogs',
      component: () => import('@/views/logs/HisLogs.vue'),
      meta: { 
        title: '对接日志',
        icon: 'Document'
      }
    }
  ]
}

// 系统管理
const system = {
  path: 'system',
  name: 'System',
  meta: { 
    title: '系统管理',
    icon: 'Setting'
  },
  children: [
    {
      path: 'users',
      name: 'SystemUsers',
      component: () => import('@/views/system/Users.vue'),
      meta: { 
        title: '用户管理',
        icon: 'User'
      }
    },
    {
      path: 'roles',
      name: 'SystemRoles',
      component: () => import('@/views/system/Roles.vue'),
      meta: { 
        title: '角色管理',
        icon: 'UserFilled'
      }
    },
    {
      path: 'permissions',
      name: 'SystemPermissions',
      component: () => import('@/views/system/Permissions.vue'),
      meta: { 
        title: '权限管理',
        icon: 'Lock'
      }
    }
  ]
}

// 系统设置
const settings = {
  path: 'settings',
  name: 'Settings',
  meta: { 
    title: '系统设置',
    icon: 'Setting'
  },
  children: [
    {
      path: 'profile',
      name: 'Profile',
      component: () => import('@/views/settings/Profile.vue'),
      meta: { 
        title: '个人信息',
        icon: 'User'
      }
    },
    {
      path: 'users',
      name: 'Users',
      component: () => import('@/views/settings/Users.vue'),
      meta: { 
        title: '用户管理',
        icon: 'UserFilled'
      }
    }
  ]
}

// 导出所有路由
export const mainRoutes = [
  dashboard,
  devices,
  patients,
  visits,
  operation,
  his,
  settings
]

// 导出所有菜单项
export const menuItems = [
  dashboard,
  devices,
  patients,
  operation,
  his,
  system
]
 