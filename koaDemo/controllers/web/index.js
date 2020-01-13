// 网站前端的控制器

module.exports = {
	ad: require('./ad'),
	catalog: {
		medicalCard: require('./catalog/medicalCard'),
		recharge: require('./catalog/recharge')
	},
	cart: require('./cart'),
	public: {
		login: require('./public/login'),
		password: require('./public/password'),
		service: require('./public/service')
	},
	//用户体系下内容
	user:require('./user/user'),
	findPassword:require('./user/findPassword'),
	address:require('./user/address'),
	account:require('./user/account'),
	medicalExamiantion:require('./enterprise/medicalExamiantion'),
	family:require('./user/family'),//我的家庭
	employeeEnt:require('./enterprise/employeeEnt'),
	searchCondition:require('./searchCondition/searchCondition'),
  	shopCar:require('./order/shopCar'),//购物车
	
	  
	//体检机构相关
	medical:require('./medical/medical'),//体检机构
	//个人中心
	personal:require('./personal'),
	//企业中心
	enterprise:{
		enterprise:require('./enterprise/enterprise'),
		entProfile:require('./enterprise/entProfile'),
		entDepartment:require('./enterprise/entDepartment'),
		medicalExamiantion:require('./enterprise/medicalExamiantion'),
		entCycleRemind:require('./enterprise/entCycleRemind'),
	},
	//订单内容
	order:{
		transaction:require('./order/transaction'),
		order:require('./order/order'),
	},
	//售后
	service:require('./service/service'),
	//发票内容
	invoice:{
		invoice:require('./invoice/invoice'),
		invoiceAddress:require('./invoice/invoiceAddress'),
	},
	//汇款内容
	remittance:{remittance:require('./remittance/remittance')},
	//内容管理
	content:{
		article:require('./content/article'),
		tag:require('./content/tag'),
	},
}