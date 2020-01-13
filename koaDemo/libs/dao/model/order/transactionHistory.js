/**
* 订单支付历史表（交易表）
* 与订单关系 多对1
*/
'use strict'
const {Money} = require('../../../utils');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('TransactionHistory', {
		id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
		orderId: {type: DataTypes.BIGINT(11), field: 'order_id', allowNull: false, comment:'订单Id' },
		paymentStatus: { type: DataTypes.INTEGER, field: 'payment_status', allowNull: false, defaultValue: 20, comment:'10.待支付。20.已支付。30.交易完成。40.已退款。50.支付无效'},
		paymentMethod: { type: DataTypes.ENUM, values: ['wxpay', 'alipay', 'transfer'], field: 'payment_method', comment:'支付方式: 支付宝 微信 转帐' },
		transactionNo: { type: DataTypes.STRING, field: 'transaction_no', allowNull: false, comment:'交易单号'}, 
		success: { type: DataTypes.BOOLEAN, allowNull: false, default: false, comment:'支付是否成功'}, 
		paymentAmount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'payment_amount', allowNull: false,defaultValue: 0, comment:'支付金额' },
		raw: { type: DataTypes.TEXT, allowNull: true, comment:'支付接口原始数据'}, 
		note: { type: DataTypes.STRING, allowNull: true, comment:'备注' },
		createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
	},
	{
		timestamps: false,
		underscore: false,
		freezeTableName: true,
		paranoid: false,
		schema: 'order',
		tableName: 'transaction_history',
		comment: '订单支付历史表',//交易表
		charset: 'utf8',
		collate: 'utf8_general_ci',
		indexes: [{
			name: 'orderTransactionHistory_orderId',
			method: 'BTREE',
			fields: ['order_id']
		}]
	});
}
