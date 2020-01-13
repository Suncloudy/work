/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 08:12:02
 * @LastEditTime: 2019-08-13 08:52:10
 * @LastEditors: Please set LastEditors
 */
const Model = require('../model');

/**
* 导出 ORM 对象
* @param {object} sequelize Sequelize 实例
*/
module.exports = function (sequelize) {
	let models = Model(sequelize);

	return  {
		catalog:{
			Category: require( './catalog/category')(models),
			Manufacturer: require( './catalog/manufacturer')(models),
			Product: require( './catalog/product')(models)
		},
		common: {
			Ad: require('./common/ad')(models),
			File: require('./common/file')(models)
		},
		discount: {
			Coupon: require( './discount/coupon')(models),
			Discount: require( './discount/discount')(models),
			UsageHistory: require( './discount/usageHistory')(models)
		},
		enterprise:{
			CycleRemind:require('./enterprise/cycleRemind')(models),
			PhyEmployeePlan:require('./enterprise/phyEmployeePlan')(models),
			PhyExamiantionPlan:require( './enterprise/phyExamiantionPlan')(models),
			SetMeal:require('./enterprise/setMeal')(models),
			EntEmployee:require('./enterprise/entEmployee')(models),
		},
		order:{
			History: require('./order/history')(models),
			Item: require( './order/item')(models),
			Order: require('./order/order')(models),
			Shipping: require('./order/shipping')(models),
			TransactionHistory: require( './order/transactionHistory')(models),
			TransferReceipt: require( './order/transferReceipt')(models)
		},
		//发票
		invoice:{
			InvoiceAddress:require( './invoice/invoiceAddress')(models),
			InvoiceMessage:require( './invoice/invoiceMessage')(models),
			InvoiceProfile:require( './invoice/invoiceProfile')(models),
		},
		//汇款
		remittance:{
			Remittance:require( './remittance/remittance')(models),
		},
		//商品目录
		//体检管理
		medical:{
			Card:require( './medical/card')(models),
			Center:require( './medical/center')(models),
			ExaminationItem:require( './medical/examinationItem')(models),
			ExaminationPackage:require( './medical/examinationPackage')(models),
			ExaminationPackageItemMapping:require( './medical/examinationPackageItemMapping')(models),
			ExaminationPackageType:require( './medical/examinationPackageType')(models),
			ExaminationPackageTypeMapping:require( './medical/examinationPackageTypeMapping')(models),
			Organization:require( './medical/organization')(models),
		},
		//内容
		content:{
			Article: require('./content/article')(models),
			Tag: require('./content/tag')(models),
			ArticleTagMapping: require('./content/articleTagMapping')(models),
		},
		user:{
			Account: require('./user/account')(models),
			AccountTransaction: require('./user/accountTransaction')(models),
			Address:require('./user/address')(models),
			Personal: require('./user/personal')(models),
			Enterprise: require('./user/enterprise')(models),
			EntApply: require('./user/entApply')(models),
			EntDepartment: require('./user/entDepartment')(models),
			EntEmployee: require('./user/entEmployee')(models),
			FindPassword: require('./user/findPassword')(models),
			Invite: require('./user/invite')(models),
			Message: require('./user/message')(models),
			WxInfo: require('./user/wxInfo')(models),
			CoinTransaction: require('./user/coinTransaction')(models)
		},
		//售后
		service:{
			Repair: require('./service/repair')(models),
			RepairFile: require('./service/repairFile')(models),
			RepairProcessingHistory: require('./service/repairProcessingHistory')(models),
		},
	}
}