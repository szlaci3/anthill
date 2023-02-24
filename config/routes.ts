export default [
  {
    path: '/404',
    component: './404',
  },
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    /*authority: ['admin', 'user'],*/
    routes: [
      { path: '/', redirect: '/index' },

/* dev only */
      {
        path: './icons',
        component: './user/MyIcons',
      },
      {
        path: './sandbox',
        component: './user/Sandbox',
      },
      {
        path: './sandfield',
        component: './user/Sandfield',
      },
/* /dev only */


      // {
      //   path: './company-setup',
      //   title: '账户信息',
      //   component: './user/Settings/CompanySetup',
      // },
      // {
      //   path: './change-password',
      //   title: '更改密码',
      //   component: './user/Settings/ChangePassword',
      // },
      // {
      //   path: './account-authorization',
      //   title: '子账户',
      //   component: './user/Settings/AccountAuthorization',
      // },
      // {
      //   path: './charging-details',
      //   title: '会员功能',
      //   component: './user/ChargingDetails',
      // },
      // {
      //   path: './messages',
      //   routes: [
      //     {
      //       path: './unread',
      //       title: '最新消息',
      //       component: './user/Messages/MessagesUnread/MessagesUnread',
      //     },
      //     {
      //       path: './read',
      //       title: '已读文件',
      //       component: './user/Messages/MessagesRead/MessagesRead',
      //     },
      //   ],
      // },
      {
        path: '/index',
        name: 'Home',
        iconClass: 'index-copy',
        routes: [
          {
            path: './',
            title: 'Home',
            component: './Index/Index',
          },
        ],
      },
      // {
      //   path: '/staff',
      //   name: 'Staff',
      //   iconClass: 'yuangongguanli',
      //   routes: [
          // {
          //   path: './employee',
          //   name: '员工信息总览',
          //   routes: [
          //     { path: './', redirect: './overview' },
          //     {
          //       path: './overview',
          //       title: '在职员工一览',
          //       component: './Staff/Employee/Overview/Overview',
          //     },
          //     {
          //       path: './details/:id?',
          //       title: '员工信息详情',
          //       component: './Staff/Employee/EmployeeDetails',
          //     },
          //     {
          //       path: './join',
          //       title: '员工入职一览',
          //       component: './Staff/Employee/Join/Join',
          //     },
          //     {
          //       path: './join-data/:id?',
          //       title: '员工入职详情',
          //       component: './Staff/Employee/Join/JoinData',
          //     },
          //     {
          //       path: './dismissed',
          //       title: '离职员工一览',
          //       component: './Staff/Employee/Dismissed/Dismissed',
          //     },
          //   ],
          // },
          {
            path: './contract',
            name: 'Contract',
            iconClass: 'yuangongguanli',//
            routes: [
              {
                path: './',
                title: 'Contract',
                component: './Staff/Contract/Contract',
              },
            ],
          },
          // {
          //   path: './holiday',
          //   name: '员工假期管理',
          //   routes: [
          //     { path: './', redirect: './records' },
          //     {
          //       path: './records',
          //       title: '请假记录',
          //       component: './Staff/Holiday/HolidayRecords/HolidayRecords',
          //     },
          //     {
          //       path: './details',
          //       title: '员工假期明细',
          //       component: './Staff/Holiday/HolidayDetails/HolidayDetails',
          //     },
          //     {
          //       path: './setup',
          //       title: '假期设置',
          //       component: './Staff/Holiday/HolidaySetup/HolidaySetup',
          //     },
          //   ],
          // },
          // {
          //   path: './company-structure',
          //   name: '组织架构设置',
          //   routes: [
          //     {
          //       path: './',
          //       title: '组织架构设置',
          //       component: './Staff/CompanyStructure/CompanyStructure',
          //     },
          //   ],
          // },
          // {
          //   path: './transfer-position',
          //   name: '调岗记录',
          //   isForCharge: true,
          //   routes: [
          //     {
          //       path: './',
          //       title: '调岗记录',
          //       component: './Staff/TransferPosition/TransferPosition',
          //     },
          //   ],
          // },
          // {
          //   path: './security-declaration',
          //   name: '社保申报查询',
          //   isForCharge: true,
          //   routes: [
          //     {
          //       path: './',
          //       title: '社保申报查询',
          //       component: './Staff/SecurityDeclaration/SecurityDeclaration',
          //     },
          //   ],
          // },
      //   ],
      // },
      // {
      //   path: '/payable',
      //   name: '社保薪资管理',
      //   iconClass: 'xinzi',
      //   routes: [
      //     {
      //       path: './payment',
      //       name: '支付明细',
      //       routes: [
      //         {
      //           path: './',
      //           title: '支付总览',
      //           component: './Payable/Payment/Payment',
      //         },
      //       ],
      //     },
      //     {
      //       path: './insurance',
      //       name: '社保管理',
      //       routes: [
      //         { path: './', redirect: './calculation' },
      //         {
      //           path: './calculation',
      //           title: '员工社保总览',
      //           component: './Payable/Insurance/InsuranceCalculation/InsuranceCalculation',
      //         },
      //         {
      //           path: './settings',
      //           title: '社保信息设置',
      //           component: './Payable/Insurance/InsuranceSettings/InsuranceSettings',
      //         },
      //         {
      //           path: './tools',
      //           title: '模拟计算',
      //           component: './Payable/Insurance/InsuranceTools/InsuranceTools',
      //         },
      //         {
      //           path: './agent',
      //           title: '社保代理',
      //           component: './Payable/Agent/Agent',
      //         },
      //       ],
      //     },
      //     {
      //       path: './salary',
      //       name: '薪资管理',
      //       routes: [
      //         { path: './', redirect: './calculation' },
      //         {
      //           path: './calculation',
      //           title: '员工薪资计算',
      //           component: './Payable/Salary/SalaryCalculation/SalaryCalculation',
      //         },
      //         {
      //           path: './settings',
      //           title: '薪资信息设置',
      //           component: './Payable/Salary/SalarySettings/SalarySettings',
      //         },
      //         {
      //           path: './item-setup',
      //           title: '计算项目设置',
      //           component: './Payable/Salary/SalaryItemSetup/SalaryItemSetup',
      //         },
      //         {
      //           path: './agent',
      //           title: '薪资代理',
      //           component: './Payable/Agent/Agent',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/announcements',
      //   name: '公告发布',
      //   iconClass: 'gonggaoguanli',
      //   routes: [
      //     {
      //       path: './',
      //       title: '公告发布',
      //       component: './Announcements/Announcements',
      //     },
      //   ],
      // },
      // {
      //   path: '/approval',
      //   name: '审批管理',
      //   iconClass: 'shenpi',
      //   routes: [
      //     {
      //       path: './reimbursement',
      //       name: '报销',
      //       isForCharge: true,
      //       routes: [
      //         { path: './', redirect: './pending' },
      //         {
      //           path: './pending',
      //           title: '报销审批',
      //           component: './Approval/Reimbursement/ReimbursementPending/ReimbursementPending',
      //         },
      //         {
      //           path: './template',
      //           title: '报销模板',
      //           component: './Approval/Reimbursement/ReimbursementTemplate/ReimbursementTemplate',
      //         },
      //         {
      //           path: './setup/:m_id?',
      //           title: '报销设置',
      //           component: './Approval/Reimbursement/ReimbursementTemplate/ReimbursementSetup',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/presence',
      //   name: '考勤管理',
      //   iconClass: 'kaoqinguanli',
      //   routes: [
      //     {
      //       path: './attendance',
      //       name: '考勤',
      //       isForCharge: true,
      //       routes: [
      //         { path: './', redirect: './trend' },
      //         {
      //           path: './trend',
      //           title: '打卡趋势',
      //           component: './Presence/Attendance/AttendanceTrend/AttendanceTrend',
      //         },
      //         {
      //           path: './rule',
      //           title: '打卡规则',
      //           component: './Presence/Attendance/AttendanceRule/AttendanceRule',
      //         },
      //         {
      //           path: './rule-setup/:id?',
      //           title: '打卡规则设置',
      //           component: './Presence/Attendance/AttendanceRule/RuleSetup',
      //         },
      //       ],
      //     },
      //     {
      //       path: './statistics',
      //       name: '考勤统计',
      //       isForCharge: true,
      //       routes: [
      //         {
      //           path: './',
      //           title: '考勤统计',
      //           component: './Presence/StatisticsAttendance/StatisticsAttendance',
      //         },
      //         {
      //           path: './details/:sid',
      //           title: '考勤统计 详情',
      //           component: './Presence/StatisticsAttendance/StatisticsDetails',
      //         },
      //       ],
      //     },
      //   ],
      // },


      // {
      //   path: '/admin',
      //   name: '公告发布',
      //   access: 'canAdmin',
      //   component: './Admin',
      //   iconClass: 'gonggaoguanli',
      //   routes: [
      //     {
      //       path: '/admin/sub-page',
      //       name: '调岗记录',
      //       component: './Welcome',
      //     },
      //   ],
      // },
      { redirect: '/404' },
    ]
  },
];
