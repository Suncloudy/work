const router = require('koa-router')()
const webController=require('../../controllers/web');
const publicService = require('../../controllers/web').public;
const {upload}=require('../../libs/utils')

const public = require('./public');
const catalog = require('./catalog');
const ad = require('./ad');
const cart = require('./cart');
const medical = require('./medical');
const service = require('./service');
//路由前缀
router.prefix('/api');

// 加载子模块
router.use(public.routes());
router.use(ad.routes());
router.use(catalog.routes());
router.use(cart.routes());
router.use(medical.routes());
router.use(service.routes());
/** personal center start */

//---------------------------------个人账户相关
//获取个人信息
router.get('/personal/:id',webController.personal.account.personalInfo);
//编辑个人信息
router.put('/personal/:id', webController.personal.account.personalInfoEdit);
//用户修改绑定手机号
router.put('/personal/:id/phoneReplacement',publicService.service.checkCaptcha,publicService.service.checkSmsCode, webController.personal.account.phoneReplacement );
//用户修改登录密码
router.put('/personal/:id/passwordReplacement', webController.personal.account.passwordReplacement);
router.put('/personal/:id/passwordReplacement/perPasswordEditForNumber',publicService.service.checkCaptcha,publicService.service.checkSmsCode,webController.personal.account.perPasswordEditForNumber);
//----------------------------------收货地址相关
//获取地址列表
router.get('/personal/:id/address', webController.personal.address.addressList);
//收货地址
router.post('/personal/:id/address', webController.personal.address.addressAdd);
//更新收货地址
router.put('/personal/:id/address',  webController.personal.address.addressEdit);
//设置默认收货地址
router.put('/personal/:id/defaultAddress', webController.personal.address.defaultAddress );
//设置成非默认的收货地址
router.put('/personal/:id/optionAddress', webController.personal.address.optionAddress );
//删除地址
router.delete('/personal/:id/address', webController.personal.address.addressDelete);
//----------------------------------消息相关
//消息提醒
router.post('/personal/:id/messages',webController.personal.message.addMessage);
//获取消息
router.get('/personal/:id/messages',webController.personal.message.messageList);
//更新消息状态
router.put('/personal/:id/messages',webController.personal.message.updateMessage);
//删除消息
router.delete('/personal/:id/:messageIds/messages',webController.personal.message.deleteMessage);
//-----------------------------------钱包相关
//钱包信息
router.get('/personal/:id/purse',webController.personal.purse.purseInfo);
//账目的流程日志
router.get('/personal/:id/transactionHistory',webController.personal.purse.transactionHistory);
//-----------------------------------订单相关
//获取订单列表
router.get('/personal/:id/orders',webController.order.order.orders);
//取消订单
router.delete('/personal/:id/orders',webController.order.order.deleteOrder);
//订单详情
router.get('/personal/:id/order',
    webController.order.order.shipping, 
    webController.order.order.transactionHistory,
    webController.order.order.transferReceipt,
    webController.order.order.history,
    webController.order.order.order);


//-----------------------------------我的体检
//用户体检卡列表
router.get('/personal/:id/:status/phyCards', webController.personal.cards.phyCardList);
//用户赠送体检卡(注，在我的家庭中体检卡可以一次赠送多张)
router.put('/personal/:id/phyCards',publicService.service.checkCaptcha,publicService.service.checkSmsCode,webController.personal.cards.phyCardGive);
//获取体检卡密码
router.get('/personal/:id/phyCards/password',publicService.service.checkCaptcha,publicService.service.checkSmsCode, webController.personal.cards.phyCardPassword);

//-----------------------------------我的家庭
//我的家庭基本信息(包括家人关爱计划)
router.get('/personal/:id/familyProfile', webController.personal.family.familyProfile);
//立即赠送折扣(家人关爱计划)
router.post('/personal/:id/familyDiscount',publicService.service.checkCaptcha,publicService.service.checkSmsCode, webController.personal.family.familyGiveDiscount);
//赠送体检卡(家人)
router.put('/personal/:id/familyPhyCard',publicService.service.checkCaptcha,publicService.service.checkSmsCode,webController.personal.family.familyGiveCard);
//-----------------------------------我的企业
//我的企业基本信息
router.get('/personal/:id/employee/enterpriseProfile', webController.personal.enterprise.employeeEntProfile);
//企业申请添加员工-拒绝/同意 1同意 2拒绝
router.put('/personal/:id/:status/employee/enterpriseRelation', webController.personal.enterprise.employeeEntRelationChange);
//企业员工关系解绑---员工关系存在，状态不变，deleteAt只修改
router.delete('/personal/:id/employee/enterpriseRelation', webController.personal.enterprise.employeeEntRelationRemove);

/** personal center end  */


/** enterprise center start */
//企业申请
router.post('/enterprise/apply',webController.enterprise.enterprise.enterpriseApply);
//获取企业账户信息接口
router.get('/enterprise/account/:enterpriseId', webController.account.accountBasicEnterprise);
//***************************成员和分组
//添加部门接口
router.post('/enterprise/department/:enterpriseId', webController.enterprise.entDepartment.entDepartmentAdd);
//获取部门列表
router.get('/enterprise/departments/:enterpriseId', webController.enterprise.entDepartment.entDepartmentList);
//部门修改
router.put('/enterprise/department/:departmentId', webController.enterprise.entDepartment.entDepartmentEdit);
//部门删除
router.delete('/enterprise/department/:departmentId', webController.enterprise.entDepartment.entDepartmentDelete);
//企业部门获取(筛选条件)
router.get('/enterprise/departments/:enterpriseId/search', webController.enterprise.enterprise.entDepartmentsSearch);
//企业员工列表获取（搜索）
router.get('/enterprise/employees/:enterpriseId',  webController.enterprise.enterprise.entEmployeeList);
//企业员工添加
router.post('/enterprise/employee/:enterpriseId', webController.enterprise.enterprise.entEmployeeAdd);
//企业员工导入excel导入模板下载（暂时放弃）
// router.get('/enterprise/employee/excel/download', webController.enterprise.enterprise.employeeExcelModelDownload);
//企业员工导入excel  （暂时放弃）
// router.post('/enterprise/employee/excel/:enterpriseId', upload.single('file'),webController.enterprise.enterprise.entEmployeeExcelAdd);
//企业员工修改--只可以修改姓名
router.put('/enterprise/employee/:enterpriseId', webController.enterprise.enterprise.entEmployeeEdit);
//企业员工删除
router.delete('/enterprise/employee/:employeeId', webController.enterprise.enterprise.entEmployeeDelete);

//***********************************账号管理
//获取企业基本信息(企业资料)
router.get('/enterprise/profile/:enterpriseId', webController.enterprise.entProfile.entGetProfile);
//修改企业资料
router.put('/enterprise/profile/:enterpriseId',webController.enterprise.entProfile.entProfileEdit);
//修改企业注册码
router.put('/enterprise/identity/:enterpriseId', webController.enterprise.entProfile.entIdentityEdit);
//修改企业联系人
router.put('/enterprise/contact/:enterpriseId',webController.enterprise.entProfile.entContactEdit);
//修改企业联系地址
router.put('/enterprise/address/:enterpriseId',webController.enterprise.entProfile.entAddressEdit);
//**********************************安全设置
//返回企业安全设置内容
router.get('/enterprise/safeSetting/:enterpriseId',webController.enterprise.entProfile.entSafeSetting);
//修改企业密码
router.put('/enterprise/password/:enterpriseId',webController.enterprise.entProfile.entPasswordEdit);
router.put('/enterprise/password/:enterpriseId/phonenumber',publicService.service.checkCaptcha,publicService.service.checkSmsCode,webController.enterprise.entProfile.entPasswordEditForNumber);
//修改企业安全手机号
router.put('/enterprise/phone/:enterpriseId',publicService.service.checkCaptcha,publicService.service.checkSmsCode,webController.enterprise.entProfile.entPhoneEdit);
//修改企业邮箱
router.put('/enterprise/email/:enterpriseId',webController.enterprise.entProfile.entEmailEdit);
//**********************************消息相关
//消息提醒
router.post('/enterprise/:id/messages',webController.enterprise.entProfile.addMessage);
//获取消息
router.get('/enterprise/:id/messages',webController.enterprise.entProfile.messageList);
//更新消息状态
router.put('/enterprise/:id/messages',webController.enterprise.entProfile.updateMessage);
//删除消息
router.delete('/enterprise/:id/:messageIds/messages',webController.enterprise.entProfile.deleteMessage);
//***********************************体检管理
//体检额度套餐添加
router.post('/enterprise/setMeal/:enterpriseId', webController.enterprise.medicalExamiantion.setMealAdd);
//体检额度套餐获取全部
router.get('/enterprise/setMeals/:enterpriseId', webController.enterprise.medicalExamiantion.setMealList);
//体检额度套餐编辑
router.put('/enterprise/setMeal/:setMealId', webController.enterprise.medicalExamiantion.setMealEdit);
//体检额度套餐删除
router.delete('/enterprise/setMeal/:setMealId', webController.enterprise.medicalExamiantion.setMealDelete);
//部门额度套餐获取
router.get('/enterprise/department/setMeals/:enterpriseId',webController.enterprise.medicalExamiantion.setMealDepartmentList);
//部门额度套餐修改保存
router.put('/enterprise/department/setMeals/:enterpriseId',webController.enterprise.medicalExamiantion.setMealDepartmentEdit);
//体检计划中的员工列表获取
router.get('/enterprise/employees/:enterpriseId/medicalExamiantionPlan', webController.enterprise.medicalExamiantion.employeeListPhyPlan);
//体检计划创建
router.post('/enterprise/medicalExamiantionPlan/:enterpriseId', webController.enterprise.medicalExamiantion.phyPlanCreate);
//体检计划历史获取接口
router.get('/enterprise/medicalExamiantionPlans/:enterpriseId', webController.enterprise.medicalExamiantion.phyPlanList);
//体检计划修改时候员工列表获取
router.get('/enterprise/employees/:enterpriseId/medicalExamiantionPlanEdit',  webController.enterprise.medicalExamiantion.employeeListPhyPlanEdit);
//体检计划修改--未创建订单前均可修改
router.put('/enterprise/medicalExamiantionPlan/:phyPlanId', webController.enterprise.medicalExamiantion.phyPlanEdit);
//体检计划作废
router.delete('/enterprise/medicalExamiantionPlan/:phyPlanId', webController.enterprise.medicalExamiantion.phyPlanDelete);
//体检计划首页基础数据返回-首页只返回最近创建的五个计划
router.get('/enterprise/medicalExamiantionPlan/:enterpriseId/home', webController.enterprise.medicalExamiantion.phyPlanHome);
//获取所有周期----暂时无用
// router.get('/enterprise/cycleReminds', webController.entCycleRemind.cycleRemindList);
//企业体检周期设置(没有就设置，有就更新)---批量插入
router.post('/enterprise/cycleRemind/:enterpriseId', webController.enterprise.entCycleRemind.cycleRemindSetting);
//对应企业体检周期获取
router.get('/enterprise/cycleRemind/:enterpriseId',  webController.enterprise.entCycleRemind.cycleRemindGet);
//***************************************企业订单相关 */
//获取订单列表
router.get('/enterprise/orders/:id', webController.order.order.ordersOfEnt);
// //取消订单
router.delete('/enterprise/orders/:id',webController.order.order.deleteOrder);
//订单详情
router.get('/enterprise/:id/order',
    webController.order.order.shipping, 
    webController.order.order.transactionHistory,
    webController.order.order.transferReceipt,
    webController.order.order.history,
    webController.order.order.order);
//*************************************发票相关 */
 //企业设置发票信息基本设置接口
router.post('/enterprise/invoice/basic/:enterpriseId',webController.invoice.invoice.invoiceBasicEntSetting);
//添加发票邮寄地址
router.post('/user/invoiceAddress/:userId',webController.invoice.invoiceAddress.invoiceAddressAdd);
//获取发票邮寄地址列表
router.get('/user/invoiceAddress/:userId',webController.invoice.invoiceAddress.invoiceAddressList);
//修改发票邮寄地址
router.put('/user/invoiceAddress/:addressId',webController.invoice.invoiceAddress.invoiceAddressEdit);
//修改发票邮寄默认状态
router.put('/user/invoiceAddress/:addressId/default',webController.invoice.invoiceAddress.invoiceAddressDefault);
//删除发票邮寄地址
router.delete('/user/invoiceAddress/:addressId',webController.invoice.invoiceAddress.invoiceAddressDelete);
//开通发票基本信息获取
router.get('/enterprise/invoice/basic/:enterpriseId',webController.invoice.invoice.invoiceBasicEnt);
//可开具发票订单列表（发票管理界面主页）
router.get('/enterprise/invoice/orders/:enterpriseId',webController.invoice.invoice.orderListEntInvoice);
//确认开通发票
router.post('/enterprise/invoice/:enterpriseId',webController.invoice.invoice.invoiceAdd);
//发票列表
router.get('/enterprise/invoices/:accountId',webController.invoice.invoice.invoiceList);
//发票详情
router.get('/enterprise/invoice/:invoiceId/detail',webController.invoice.invoice.invoiceDetail);
//取消发票
router.delete('/enterprise/invoice/:invoiceId/delete',webController.invoice.invoice.delete);
//************************************汇款相关 */
//添加汇款记录
router.post('/enterprise/remittances/:enterpriseId',webController.remittance.remittance.remittanceAdd);
//获取汇款列表
router.get('/enterprise/remittances/:enterpriseId', webController.remittance.remittance.remittanceList);
//************************************交易记录 */
//添加交易记录
router.post('/enterprise/transactionHistory', webController.order.transaction.transactionHistoryAdd);
//获取交易记录
router.get('/enterprise/transactionHistory', webController.order.transaction.transactionHistoryLists);

/**   enterprise center  end */


/** content start  */

//获取文章列表 (可以传入标签ID: url:/content/articles?tagId=xxx   ps:tag select article)  article select tag
router.get('/content/articles',webController.content.article.getArticleItems);
//获取热门文章
router.get('/content/hotarticles',webController.content.article.getHotArticleItems);
//获取文章明细
router.get('/content/articles/:id',webController.content.article.articleInfo);
//获取标签列表
router.get('/content/tags',webController.content.tag.getTagItems);

/** content end  */

//体检商品生成订单
module.exports = router