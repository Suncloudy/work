/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 08:35:01
 * @LastEditTime: 2019-08-14 11:15:35
 * @LastEditors: Please set LastEditors
 */
/**
* 订单明细表 
* 订单表与它一对多
*/
'use strict'
const {Money} = require('../../../utils');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('OrderItem', {
		id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
		manufacturerId: { type:DataTypes.BIGINT(20), field: 'manufacturer_id', comment:'厂商Id'},
		orderId: {type: DataTypes.BIGINT(11), field: 'order_id', allowNull: false, comment:'订单Id' },
		productId: {type: DataTypes.BIGINT(11), field: 'product_id', allowNull: false, comment:'产品Id' },
		name: { type: DataTypes.STRING, allowNull: false, comment:'产品名' },
		imageFileId: { type:DataTypes.BIGINT(20), field: 'image_file_id', comment:'图片文件'},
		productType: { type: DataTypes.ENUM('recharge', 'medicalCard', 'physical'), allowNull: true, comment: '产品类型：1. 充值 2. 虚拟-体检卡 3. 实物产品'},
		quantity: { type: DataTypes.INTEGER, allowNull: true, comment:'数量'},
		salePrice: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'sale_price', allowNull: true, comment:'原价' },
		price: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'price', comment:'购买价' },
		discountAmount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'discount_amount', allowNull: false, defaultValue: 0, comment:'优惠总额'},
		total: { type: DataTypes.DECIMAL(10, 2), comment:'总计' }
	},
	{
		timestamps: false,
		underscore: false,
		freezeTableName: true,
		schema: 'order',
		tableName: 'item',
		comment: '订单明细表',
		charset: 'utf8',
		collate: 'utf8_general_ci',
		indexes: [{
			name: 'orderItem_orderId',
			method: 'BTREE',// 具有有序字段的BTREE索引
			fields: ['order_id']
		},
		{
				name: 'orderItem_productId',
			method: 'BTREE',// 具有有序字段的BTREE索引
			fields: ['product_id']
		}]
	});
}

