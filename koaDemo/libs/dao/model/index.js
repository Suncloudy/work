/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 08:12:02
 * @LastEditTime: 2019-08-13 08:51:40
 * @LastEditors: Please set LastEditors
 */
const path = require('path');


module.exports = function (sequelize) {
	return {
		catalog:{
			Category: sequelize.import(path.join(__dirname, './catalog/category')),
			Manufacturer: sequelize.import(path.join(__dirname, './catalog/manufacturer')),
			Product: sequelize.import(path.join(__dirname, './catalog/product')),
		},
		common: {
			Ad: sequelize.import(path.join(__dirname, './common/ad')),
			File: sequelize.import(path.join(__dirname, './common/file'))
		},
		discount: {
			Coupon: sequelize.import(path.join(__dirname, './discount/coupon')),
			Discount: sequelize.import(path.join(__dirname, './discount/discount')),
			UsageHistory: sequelize.import(path.join(__dirname, './discount/usageHistory')),
		},
		//企业体检计划相关
		enterprise:{
  		CycleRemind:sequelize.import(path.join(__dirname, './enterprise/cycleRemind')),
			PhyEmployeePlan:sequelize.import(path.join(__dirname, './enterprise/phyEmployeePlan')),
			PhyExamiantionPlan:sequelize.import(path.join(__dirname, './enterprise/phyExamiantionPlan')),
			SetMeal:sequelize.import(path.join(__dirname, './enterprise/setMeal')),
			EntEmployee: sequelize.import(path.join(__dirname, './enterprise/entEmployee')),
		},
		//订单
		order:{
			History: sequelize.import(path.join(__dirname, './order/history')),
			Item: sequelize.import(path.join(__dirname, './order/item')),
			Order: sequelize.import(path.join(__dirname, './order/order')),
			Shipping: sequelize.import(path.join(__dirname, './order/shipping')),
			TransactionHistory: sequelize.import(path.join(__dirname, './order/transactionHistory')),
			TransferReceipt: sequelize.import(path.join(__dirname, './order/transferReceipt'))
		},
		//发票
		invoice:{
			InvoiceAddress:sequelize.import(path.join(__dirname, './invoice/invoiceAddress')),
			InvoiceMessage:sequelize.import(path.join(__dirname, './invoice/invoiceMessage')),
			InvoiceProfile:sequelize.import(path.join(__dirname, './invoice/invoiceProfile')),
		},
		//体检管理
		medical:{
			Card: sequelize.import(path.join(__dirname, './medical/card')),
			Center: sequelize.import(path.join(__dirname, './medical/center')),
			ExaminationItem: sequelize.import(path.join(__dirname, './medical/examinationItem')),
			ExaminationPackage: sequelize.import(path.join(__dirname, './medical/examinationPackage')),
			ExaminationPackageItemMapping: sequelize.import(path.join(__dirname, './medical/examinationPackageItemMapping')),
			ExaminationPackageType: sequelize.import(path.join(__dirname, './medical/examinationPackageType')),
			ExaminationPackageTypeMapping: sequelize.import(path.join(__dirname, './medical/examinationPackageTypeMapping')),
			Organization: sequelize.import(path.join(__dirname, './medical/organization')),
		},
		//汇款
		remittance:{
			Remittance:sequelize.import(path.join(__dirname, './remittance/remittance')),
		},
		//内容
		content: {
			Article: sequelize.import(path.join(__dirname, './content/article')),
			ArticleTagMapping: sequelize.import(path.join(__dirname, './content/articleTagMapping')),
			Tag: sequelize.import(path.join(__dirname, './content/tag')),
		},
		user: {
			Account: sequelize.import(path.join(__dirname, './user/account')),
			AccountTransaction: sequelize.import(path.join(__dirname, './user/accountTransaction')),
			Address: sequelize.import(path.join(__dirname, './user/address')),
			EntApply: sequelize.import(path.join(__dirname, './user/entApply')),
			EntDepartment: sequelize.import(path.join(__dirname, './user/entDepartment')),
			EntEmployee: sequelize.import(path.join(__dirname, './user/entEmployee')),
			Enterprise: sequelize.import(path.join(__dirname, './user/enterprise')),
			Personal: sequelize.import(path.join(__dirname, './user/personal')),
			FindPassword: sequelize.import(path.join(__dirname, './user/findPassword')),
			Invite: sequelize.import(path.join(__dirname, './user/invite')),
			Message: sequelize.import(path.join(__dirname, './user/message')),
			WxInfo: sequelize.import(path.join(__dirname, './user/wxInfo')),
			CoinTransaction: sequelize.import(path.join(__dirname, './user/coinTransaction'))
		},
		//售后
		service: {
			Repair: sequelize.import(path.join(__dirname, './service/repair')),
			RepairFile: sequelize.import(path.join(__dirname, './service/repairFile')),
			RepairProcessingHistory: sequelize.import(path.join(__dirname, './service/repairProcessingHistory')),
		},
	}
} 

