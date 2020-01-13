'use strict'

const Base = require('../base');

module.exports = function (models) {
	let AccountTransaction = models.user.AccountTransaction;

	let Order = models.order.Order;
	if(!AccountTransaction.associations.Order)
	{
		AccountTransaction.belongsTo(Order, {foreignKey:'relationId'});	
	}
	// 复制基类上的方法
	Base.copy(AccountTransaction);

	return AccountTransaction;
};


