export const PersonalMenu = {
  "list": [
    {
      iconUrl: require("@/assets/asideIcon/zhuye_icon@2x.png"),
      path: '/PersonalPage',
      // path: '/AccountInfo',
      navItem: '我的主页'
    },
    {
      iconUrl: require("@/assets/asideIcon/ddgl_icon@2x.png"),
      path: '/PersonOrderManage',
      navItem: '订单管理'
    },
    {
      iconUrl: require("@/assets/asideIcon/jiating_icon@2x.png"),
      path: '/MyFamily',
      navItem: '我的家庭'
    },
    {
      iconUrl: require("@/assets/asideIcon/qiye_icon@2x.png"),
      path: '/MyBusiness',
      navItem: '我的企业'
    },
    {
      iconUrl: require("@/assets/asideIcon/tjbg_icon@2x.png"),
      // path: '/PersonalPage',
      navItem: '我的体检',
      submenu: [{
        path: '/MedicalCard',
        navItem: '体检卡',
      }]
    },
    {
      iconUrl: require("@/assets/asideIcon/qianbao_icon@2x.png"),
      path: '/AccountInfo',
      navItem: '我的钱包',
      submenu: [{
        path: '/AccountInfo',
        navItem: '账户信息',
        },
        {
          path: '/CoinPage',
          navItem: '金币',
        // {
        //   path: '/PersonalPage',
        //   navItem: '优惠券',
        }]
    },
    {
      iconUrl: require("@/assets/asideIcon/zhgl_icon@2x.png"),
      path: '/PersonalData',
      navItem: '账号管理',
      // label: { value: 3, color: 'success' },
      submenu: [{
        path: '/PersonalData',
        navItem: '个人资料',
      },
        {
          path: '/SafeSetting',
          navItem: '安全设置',
        },
        {
          path: '/ShippingAddress',
          navItem: '收货地址',
        },{
          path:'/PersonMessageRemind',
          navItem:'消息提醒',
          label: { value: 3, color: 'success' },
        }
        // {
        //   path: '/PersonnelManage',
        //   navItem: '体检人管理',
        // },
      ]
    }
  ]

}
