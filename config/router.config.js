export default [
  // user
  {
    path: '/app',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/app', redirect: '/user/login' },
      { path: '/app/login', name: 'login', component: './User/Login' },
      { path: '/app/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/workplace' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          // {
          //   path: '/dashboard/analysis',
          //   name: 'analysis',
          //   component: './Dashboard/Analysis',
          // },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      
      // 项目
      {
        path: '/project',
        authority: ['projectM'],
        icon: 'table',
        name: 'projectManage',
        routes: [
          {
            path: '/project/project',
            name: 'project',
            component: './Project/Project',
          },
          {
            path: '/project/projectAdd',
            name: 'projectAdd',
            component: './Project/ProjectAdd',
          },
         
          {
            path: '/project/profile',
            name: 'profile',
            hideInMenu: true,
            component: './Project/ProjectProfile',
          },
          {
            path: '/project/audit',
            name: 'audit',
            hideInMenu: true,
            component: './Project/ProjectAudit',
          },
        ],
      },
      // 设备
      {
        path: '/machinery',
        authority: ['machineryM'],
        icon: 'table',
        name: 'machineryManage',
        routes: [
          {
            path: '/machinery/machinery',
            name: 'machinery',
            component: './Machinery/Machinery',
          },
          {
            path: '/machinery/machineryType',
            name: 'machineryType',
            component: './Machinery/MachineryType',
          },
        ],
      },
       // 进出场管理
       {
        path: '/registration',
        authority: ['registrationM'],
        icon: 'table',
        name: 'registrationManage',
        routes: [
          {
            path: '/registration/into',
            name: 'into',
            component: './Registration/EInto',
          },
          {
            path: '/registration/exit',
            name: 'exit',
            component: './Registration/EExit',
          },
        ],
      },
       // 结算管理
      //  {
      //   path: '/bill',
      //   icon: 'table',
      //   // authority: ['billM'],
      //   name: 'billManage',
      //   routes: [
      //     {
      //       path: '/bill/billAdd',
      //       name: 'billAdd',
      //       component: './Bill/BillAdd',
      //     },
      //     {
      //       path: '/bill/bill',
      //       name: 'bill',
      //       component: './Bill/Bill',
      //     },
      //   ],
      // },
      // 租赁管理
      // {
      //   path: '/rental',
      //   icon: 'table',
      //   authority: ['rentalM'],
      //   name: 'rentalManage',
      //   routes: [
      //     {
      //       path: '/rental/rental',
      //       name: 'rental',
      //       component: './Project/working',
      //     },
      //     {
      //       path: '/rental/cost',
      //       name: 'cost',
      //       component: './Project/ProjectCost',
      //     },
      //   ],
      // },
      // 票据管理
      {
        path: '/ticket',
        icon: 'table',
        authority: ['ticketM'],
        name: 'ticketManage',
        routes: [
          {
            path: '/ticket/working',
            name: 'working',
            component: './Project/working',
          },
          {
            path: '/ticket/ticket',
            name: 'ticket',
            component: './Ticket/Ticket',
          },
          {
            path: '/ticket/type',
            name: 'type',
            component: './Ticket/TicketType',
          },
        ],
      },
       // 人员管理
      //  {
      //   path: '/user',
      //   icon: 'user',
      //   // authority: ['userM'],
      //   name: 'userManage',
      //   routes: [
      //     {
      //       path: '/user/user',
      //       name: 'user',
      //       component: './User/User',
      //     },
         
      //   ],
      // },
       // 系统管理
       {
        path: '/sys',
        icon: 'highlight',
        name: 'sysManage',
        authority: ['sysM'],
        routes: [
          {
            path: '/sys/user',
            name: 'user',
            component: './User/User',
          },
          {
            path: '/sys/permission',
            name: 'permission',
            component: './Sys/Permission',
          },
          {
            path: '/sys/role',
            name: 'role',
            component: './Sys/Role',
          },
          {
            path: '/sys/userRole',
            name: 'userRole',
            component: './Sys/UserRole',
          },
        ],
      },
      // list
      
     
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu:true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu:true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
