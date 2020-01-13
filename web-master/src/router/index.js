import Vue from 'vue'
import Router from 'vue-router'

import IndexPage from '@/views/IndexPage'

import HomePage from '@/views/navpage/Homepage' //首页

import MedicalProduct from '@/views/navpage/MedicalProduct' //体检产品
import MedicalProductDetail from '@/views/navpage/MedicalSuitDetail' //体检产品详情
import MedicalInstitution from '@/views/navpage/MedicalInstitution' //体检机构
import MedicalInstitutionDetail from '@/views/navpage/MedicalInstituionIntroduce' //体检机构详情
import HealthAdvice from '@/views/navpage/HealthAdvice' //健康咨询
// import ArticleDetail from '@/views/AdvertisingPage' //文章详情
import FirmMedical from '@/views/navpage/FirmMedical' //企业团检


import Login from '@/views/Login'
import ForgetPwd from '@/views/ForgetPwd'
import ShoppingCart from '@/components/cart/ShoppingCart' //购物车
import ConfirmOrder from '@/components/cart/ConfirmOrder' //订单详情
import OrderPayment from '@/components/cart/OrderPayment' //订单支付（微信支付/线下汇款）
//个人中心
import PersonalCenter from '@/views/personalcenter/PersonalCenter'//个人中心
import PersonalPage from '@/components/personal/PersonalPage'//我的主页
import MyFamily from '@/components/personal/MyFamily' //我的企业
import MyBusiness from '@/components/personal/MyBusiness' //我的企业
import PersonOrderManage from '@/components/personal/OrderManage' //订单管理
import PersonalOrderDetail from '@/components/personal/PersonalOrderDetail' //订单详情
import AccountInfo from '@/components/personal/mypurse/AccountInfo' //我的钱包-账户信息
import CoinPage from '@/components/personal/mypurse/CoinPage' //我的钱包-金币
import PersonalData from '@/components/personal/accountmanage/PersonalData' //账户管理-个人资料
import SafeSetting from '@/views/SafeSetting' //账户管理-安全设置
import ShippingAddress from '@/components/personal/accountmanage/ShippingAddress'//账号管理-收获地址
import PersonMessageRemind from '@/components/personal/accountmanage/MessageRemind' //账户管理-消息提醒
import PersonMessageDetail from '@/components/personal/accountmanage/DetailMessage' //账户管理-消息详情
import PersonnelManage from '@/components/personal/accountmanage/PersonnelManage' //账户管理-体检人管理 2期
import MedicalCard from '@/components/personal/MedicalCard' //我的体检-体检卡
import ModifyPwdByCode from '@/components/personal/accountmanage/ModifyPwdByCode' // 通过短信验证修改密码
//企业中心
import FirmCenter from '@/views/firmcenter/FirmCenter'//企业中心
import FirmPage from '@/components/firm/FirmPage' //企业主页

import FirmMember from '@/components/firm/FirmMember.vue' //企业成员
import FirmStructure from '@/components/firm/FirmStructure' //企业架构
import FirmData from '@/components/firm/FirmData' //企业资料
import FirmSafeSetting from '@/components/firm/FirmSafeSetting' //企业安全设置
import MedicalConfiguration from '@/components/firm/MedicalConfiguration' //企业体检管理---体检配置
import MedicalPlan from '@/components/firm/MedicalPlan' //企业体检管理---体检计划
import FirmAccountOverview from '@/components/firm/costmanagement/AccountOverview' //企业费用管理---账户总览
import FirmOrderManage from '@/components/firm/costmanagement/OrderManage' //企业费用管理-订单管理
import FirmOrderDetail from '@/components/firm/costmanagement/OrderDetail' //企业费用管理-订单详细
import FirmTransactionRecords from '@/components/firm/costmanagement/TransactionRecords' //企业费用管理-交易记录
import InvoiceManagement from '@/components/firm/costmanagement/InvoiceManagement' //企业费用管理-发票管理
import OfflineRemittance from '@/components/firm/costmanagement/OfflineRemittance' //企业费用管理-线下汇款
import MessageRemind from '@/components/personal/accountmanage/MessageRemind' //账户管理-消息提醒
import MessageDetail from '@/components/personal/accountmanage/DetailMessage'

//售后服务
import AfterSalesApplication from '@/components/firm/aftersales/AfterSalesApplication.vue'//取消订单管理
import ReturnedPurchase from '@/components/firm/aftersales/ReturnedPurchase.vue'//退换货管理
import CommitSuccessAfterSales from '@/components/firm/aftersales/CommitSuccessAfterSales.vue'//提交成功
import AfterSalesDetail from '@/components/firm/aftersales/AfterSalesDetail.vue'//售后详细

// import InvoiceDetail from '@/components/firm/costmanagement/InvoiceDetails'
// 帮助中心
import HelpCenter from '@/views/helpcenter/HelpCenter' //帮助中心
import BrandIntroduce from '@/components/helpcenter/BrandIntroduce' //品牌介绍
import ContactUs from '@/components/helpcenter/ContactUs' //联系我们
import PrivacyPolicy from '@/components/helpcenter/PrivacyPolicy' //隐私政策

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/HomePage',
      component: HomePage,
      // redirect: '/Login',
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/ForgetPwd',
      name: 'ForgetPwd',
      component: ForgetPwd
    },
    // {
    //   path:'/ShoppingCart',
    //   name:'ShoppingCart',
    //   component:ShoppingCart
    // },
    // {
    //   path:'/HomePage',
    //   name:'HomePage',
    //   component:HomePage,
    // },
    // {
    //   path:'/FirmMedical',
    //   name:'FirmMedical',
    //   component:FirmMedical,
    // },
    /*横着的导航*/
    {
      path: '/IndexPage',
      name: 'IndexPage',
      redirect: '/HomePage',
      component: IndexPage,
      children: [
        {
          path: '/HomePage',
          name: 'HomePage',
          component: HomePage,
        },
        {
          path: '/FirmMedical',
          name: 'FirmMedical',
          component: FirmMedical,
        },
        {
          path: '/MedicalProduct',
          name: 'MedicalProduct',
          component: MedicalProduct,
        },
        {
          path: '/HealthAdvice',
          name: 'HealthAdvice',
          component: HealthAdvice,
        },
        // {
        //   path:'/ArticleDetail',
        //   name:'ArticleDetail',
        //   component:ArticleDetail
        // },
        {
          path: '/MedicalProductDetail',
          name: 'MedicalProductDetail',
          component: MedicalProductDetail,
        },
        {
          path: '/MedicalInstitution',
          name: 'MedicalInstitution',
          component: MedicalInstitution,
        },
        {
          path:'/MedicalInstitutionDetail',
          name:'MedicalInstitutionDetail',
          component:MedicalInstitutionDetail
        },
        {
          path: '/ShoppingCart',
          name: 'ShoppingCart',
          component: ShoppingCart,
          children:[
            {
              path: '/ConfirmOrder',
              name: 'ConfirmOrder',
              component: ConfirmOrder
            },
            {
              path: '/OrderPayment',
              name: 'OrderPayment',
              component: OrderPayment
            },
          ]

        },
        {
          path: '/FirmCenter',
          name: 'FirmCenter',
          redirect: '/FirmPage',
          component: FirmCenter,
          children: [
            {
              //企业主页
              path: '/FirmPage',
              name: 'FirmPage',
              component: FirmPage
            },
            {
              // 企业成员
              path: '/FirmMember',
              name: 'FirmMember',
              component: FirmMember
            },
            {
              // 企业架构
              path: '/FirmStructure',
              name: 'FirmStructure',
              component: FirmStructure
            },
            {
              //  体检计划-体检配置
              path: '/MedicalConfiguration',
              name: 'MedicalConfiguration',
              component: MedicalConfiguration
            },
            {
              path: '/MedicalPlan',
              name: 'MedicalPlan',
              component: MedicalPlan
            },
            {
              //费用管理-账户总览
              path: '/FirmAccountOverview',
              name: 'FirmAccountOverview',
              component: FirmAccountOverview
            },
            {
              //费用管理-订单管理
              path: '/FirmOrderManage',
              name: 'FirmOrderManage',
              component: FirmOrderManage
            },
            {
              path:'/FirmOrderDetail',
              name:'FirmOrderDetail',
              component:FirmOrderDetail
            },
            {
              //费用管理-交易记录
              path: '/FirmTransactionRecords',
              name: 'FirmTransactionRecords',
              component: FirmTransactionRecords
            },
            {
              //费用管理-发票管理
              path: '/InvoiceManagement',
              name: 'InvoiceManagement',
              component: InvoiceManagement
            },
            // {
            //   //费用管理-发票详情
            //   path:'/InvoiceDetail',
            //   name:'InvoiceDetail',
            //   component:InvoiceDetail
            // },
            {
              //费用管理-交易记录
              path: '/OfflineRemittance',
              name: 'OfflineRemittance',
              component: OfflineRemittance
            },
            //售后管理
            {
              path:'/AfterSalesApplication',
              name: 'AfterSalesApplication',
              component:AfterSalesApplication,
            },{
              path:'/ReturnedPurchase',
              name:'ReturnedPurchase',
              component:ReturnedPurchase,
            },
            {
              path:'/CommitSuccessAfterSales',
              name:'CommitSuccessAfterSales',
              component:CommitSuccessAfterSales,
            },
            {
              path:'/AfterSalesDetail',
              name:'AfterSalesDetail',
              component:AfterSalesDetail,
            },
            {
              // 企业资料
              path: '/FirmData',
              name: 'FirmData',
              component: FirmData
            },
            {
              // 企业安全设置
              path: '/FirmSafeSetting',
              name: 'FirmSafeSetting',
              component: FirmSafeSetting
            },
            //消息提醒
            {
              path:'/MessageRemind',
              name:'MessageRemind',
              component:MessageRemind
            },
            {
              path:'/MessageDetail',
              name:'MessageDetail',
              component:MessageDetail
            },
          ]
        },
        {
          path: '/PersonalCenter',
          name: 'PersonalCenter',
          redirect: '/PersonalPage',
          component: PersonalCenter,
          children: [
            {
              path: '/AccountInfo',
              name: 'AccountInfo',
              component: AccountInfo
            },
            {
              path: '/CoinPage',
              name: 'CoinPage',
              component: CoinPage
            },
            {
              // 我的主页
              path: '/PersonalPage',
              name: 'PersonalPage',
              component: PersonalPage
            },
            {
              // 订单管理
              path: '/PersonOrderManage',
              name: 'PersonOrderManage',
              component: PersonOrderManage
            },
            //订单详情
            {
              path:'/PersonalOrderDetail',
              name:'PersonalOrderDetail',
              component:PersonalOrderDetail
            },
            {
              // 我的企业
              path: '/MyBusiness',
              name: 'MyBusiness',
              component: MyBusiness
            },
            {
              // 我的家庭
              path: '/MyFamily',
              name: 'MyFamily',
              component: MyFamily
            },
            {
              //体检卡
              path:'/MedicalCard',
              name:'MedicalCard',
              component:MedicalCard
            },
            {
              path: '/SafeSetting',
              name: 'SafeSetting',
              component: SafeSetting
            },
            {
              path: '/ModifyPwdByCode',
              name: 'ModifyPwdByCode',
              component:ModifyPwdByCode
            },
            {
              //个人资料
              path: '/PersonalData',
              name: 'PersonalData',
              component: PersonalData,
            },
            {
              // 收货地址
              path: '/ShippingAddress',
              name: 'ShippingAddress',
              component: ShippingAddress
            }, {
              // 体检人管理 2期
              path: '/PersonnelManage',
              name: 'PersonnelManage',
              component: PersonnelManage
            },
            //消息提醒
            {
              path:'/PersonMessageRemind',
              name:'PersonMessageRemind',
              component:PersonMessageRemind
            },
            {
              path:'/PersonMessageDetail',
              name:'PersonMessageDetail',
              component:PersonMessageDetail
            },

          ]
        },
        {
          path: '/PrivacyPolicy',
          name: 'HelpCenter',
          redirect: '/PrivacyPolicy',
          component: HelpCenter,
          children: [
            {
              path: '/PrivacyPolicy',
              name: 'PrivacyPolicy',
              component: PrivacyPolicy
            },
            {
              path: '/BrandIntroduce',
              name: 'BrandIntroduce',
              component: BrandIntroduce
            },
            {
              path: '/ContactUs',
              name: 'ContactUs',
              component: ContactUs
            },]
        }
      ]
    }

  ]
})
