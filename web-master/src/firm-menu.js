export const FirmMenu = {
  "list": [
    {
      iconUrl: require("@/assets/firm/zhuye_icon@2x.png"),
      path: '/FirmPage',
      navItem: '企业主页'
    },
    {
      iconUrl: require("@/assets/firm/fenzu_icon_d@2x.png"),
      path: '/',
      navItem: '成员与分组',
      submenu: [{
        path: '/FirmMember',
        navItem: '企业成员',
      },
        {
          path: '/FirmStructure',
          navItem: '组织架构',
        }]
    },
    {
      iconUrl: require("@/assets/asideIcon/jiating_icon@2x.png"),
      path: '/',
      navItem: '体检管理',
      submenu: [{
        path: '/MedicalPlan',
        navItem: '体检计划',
      },{
        path: '/MedicalConfiguration',
        navItem: '体检配置',
      }]
    },
    {
      iconUrl: require("@/assets/firm/feiyong_icon_n@2x.png"),
      path: '/',
      navItem: '费用管理',
      submenu: [{
        path: '/FirmAccountOverview',
        navItem: '账户总览',
      },{
        path: '/FirmOrderManage',
        navItem: '订单管理',
      },{
        path:'/FirmTransactionRecords',
        navItem: '交易记录',
      }, {
        path: '/InvoiceManagement',
        navItem: '发票管理',
      }, {
        path: '/OfflineRemittance',
        navItem: '线下汇款'
      }]
    },
    // {
    //   iconUrl: require("@/assets/firm/feiyong_icon_n@2x.png"),
    //   path: '/',
    //   navItem: '售后服务',
    //   submenu: [{
    //     path: '/AfterSalesApplication',
    //     navItem: '售后申请',
    //   }]
    // },
    {
      iconUrl: require("@/assets/firm/zhgl_icon@2x.png"),
      path: '/',
      navItem: '账号管理',
      submenu: [{
        path: '/FirmData',
        navItem: '企业资料',
      }, {
          path: '/FirmSafeSetting',
          navItem: '安全设置',
      }, {
          path:'/MessageRemind',
          navItem:'消息提醒',
          label: { value: 3, color: 'success' },
        }
      ]
    }
  ]

}
