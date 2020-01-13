// 个人中心的控制器

module.exports = {
	//账户管理
	account:require('./account/account'),
	address:require('./account/address'),
	//消息
	message:require('./account/message'),
	//我的家庭
	family:require('./family/family'),
	//我的企业
	enterprise:require('./enterprise/enterprise'),
	//钱包里的账户信息
	purse:require('./purse/purse'),
	//优惠券
	coupon:require('./purse/coupon'),
	//订单
	order:require('./order/order'),
	//卡券
	cards:require('./cards/cards'),
}