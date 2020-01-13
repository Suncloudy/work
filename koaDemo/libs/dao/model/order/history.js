/**
* 订单操作历史表
* 与订单关系 多对1
*/
'use strict'

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('OrderHistory', {
		id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
		orderId: {type: DataTypes.BIGINT(11), field: 'order_id', allowNull: false, comment:'订单Id' },
		orderStatus: { type: DataTypes.INTEGER, field: 'order_status', allowNull: false, defaultValue: 10, comment:'订单状态：10.待确认。20.处理中。30.处理完成。40.已取消'},
		shippingStatus: { type: DataTypes.INTEGER, field: 'shipping_status', allowNull: false, defaultValue: 10, comment:'发货状态：10.未发货。20.部分发货。30.全部发货。40.已收货。50.无需发货'},
		paymentStatus: { type: DataTypes.INTEGER, field: 'payment_status', allowNull: false, defaultValue: 10, comment:'支付状态：10.待支付。20.已支付。30.支付失败。40.已退款'},
		note: { type: DataTypes.TEXT, allowNull: true, comment:'备注' },
		systemNote: { type: DataTypes.TEXT, field: 'system_note', allowNull: true, comment:'系统备注' },
		displayToUser: { type: DataTypes.BOOLEAN, field:'display_to_user', allowNull: false, defaultValue: false, comment:'是否显示给用户'},
		operatorType: { type: DataTypes.ENUM, values: ['user', 'system', 'admin'], field: 'operator_type', defaultValue:'user', comment:'操作人类型: 用户、系统、管理员' },
		createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW }
	},
	{
		timestamps: false,
		underscore: false,
		freezeTableName: true,
		schema: 'order',
		tableName: 'history',
		comment: '订单操作历史表',
		charset: 'utf8',
		collate: 'utf8_general_ci',
		indexes: [{
			name: 'orderHistory_orderId',
			method: 'BTREE',
			fields: ['order_id']
		}]
	});
}
