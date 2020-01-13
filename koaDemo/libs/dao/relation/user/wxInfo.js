'use strict'

const Base = require('../base');
const {Discount} = require('../../../consts');

module.exports = function (models) {
	let WxInfo = models.user.WxInfo;
	let Account = models.user.Account;
	
	if(!WxInfo.associations.Account) {
		WxInfo.belongsTo(Account, {foreignKey:'accountId'})
	}

	// 复制基类上的方法
	Base.copy(WxInfo);

	return WxInfo;
}