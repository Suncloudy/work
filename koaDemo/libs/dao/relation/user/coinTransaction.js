/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 08:44:45
 * @LastEditTime: 2019-08-13 08:52:00
 * @LastEditors: Please set LastEditors
 */
'use strict'

const Base = require('../base');

module.exports = function (models) {
	let CoinTransaction = models.user.CoinTransaction;

	let Order = models.order.Order;
	if(!CoinTransaction.associations.Order)
	{
		CoinTransaction.belongsTo(Order, {foreignKey:'relationId'});	
	}
	// 复制基类上的方法
	Base.copy(CoinTransaction);

	return CoinTransaction;
};


