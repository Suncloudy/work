/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 08:12:02
 * @LastEditTime: 2019-08-13 10:01:46
 * @LastEditors: Please set LastEditors
 */
/**
* 商品表 
*/
'use strict'
const {Money} = require('../../../utils');

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('CatalogProduct', {
		id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
		productType: { type: DataTypes.ENUM('recharge', 'medicalCard', 'physical'), allowNull: true, field:'product_type', comment: '产品类型：1. 充值 2. 虚拟-体检卡 3. 实物产品'},

		parentGroupProductId: { type: DataTypes.BIGINT(11), field: 'parent_group_product_id', comment:'父产品组Id' },
		isGroupProduct: { type: DataTypes.BOOLEAN, field: 'is_group_product', defaultValue: false, comment:'是否产品组' },
		visibleIndividually: { type: DataTypes.BOOLEAN, field:'visible_individually', allowNull: false, defaultValue: false, comment:'是否单独显示' },
		isSupportCoin: { type: DataTypes.BOOLEAN, field: 'is_support_coin', defaultValue: false, comment:'是否支持金币' },
		coinRate: { type: DataTypes.DECIMAL(10, 2), field: 'coin_rate', defaultValue: 0, comment:'金币比率' },
		name: { type: DataTypes.STRING, comment:'商品名称'},
		simpleDescription: { type: DataTypes.TEXT, field: 'simple_description',comment:'产品简单详情 简介'},
		description: { type: DataTypes.TEXT, comment:'产品详情'},
		imageFileId: { type:DataTypes.BIGINT(20), field: 'image_file_id', comment:'图片文件'},

		customerEntersPrice: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment:'是否用户输入价格' },
		minCustomerEnteredPrice: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'min_customer_entered_price', comment:'最低用户输入价格' },
		maxCustomerEnteredPrice: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'max_customer_entered_price', comment:'最高用户输入价格' },

		purchasePrice: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'purchase_price', comment:'进货价' },
		marketPrice: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'market_price',comment:'市场价' },
		salePrice: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'sale_price', allowNull: false, defaultValue:0,comment:'销售价' },
		discountPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true,field: 'discount_price', comment:'折扣价格' },
		discount: { type: DataTypes.INTEGER, allowNull: true, comment: '折扣'},
		specialPrice: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'special_price', comment:'特价' },
		specialPriceStartDate: { type: DataTypes.DATE, field: 'special_price_start_date', defaultValue: DataTypes.NOW, comment:'特价开始时间'},
		specialPriceEndDate: { type: DataTypes.DATE, field: 'special_price_end_date', defaultValue: DataTypes.NOW, comment:'特价结束时间'},

		sku: { type: DataTypes.STRING, comment:'商品编号(预留)'},
		manufacturerNumber: { type: DataTypes.STRING, field: 'manufacturer_number', comment:'厂商编号(预留)'},
		published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment:'是否可用 上下架' },
		displayOrder: { type:DataTypes.BIGINT(20), field:'display_order', comment:'序号'},
		stockQuantity: { type: DataTypes.INTEGER, field: 'stock_quantity', allowNull: false, defaultValue:0, comment: '库存量'},
		minStockQuantity: { type: DataTypes.INTEGER, field: 'min_stock_quantity', allowNull: false, defaultValue:0, comment: '最低库存量'},
		notifyStockQuantity: { type: DataTypes.INTEGER, field: 'notify_stock_quantity', allowNull: false, defaultValue:0, comment: '库存量预警量'},
		sales: { type: DataTypes.INTEGER, allowNull: false, defaultValue:0, comment: '累计销量'},
		createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false },
		deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true }
	},
	{
		timestamps: true,
		underscore: false,
		freezeTableName: true,
		paranoid: true,
		schema: 'catalog',
		tableName: 'product',
		comment: '商品表',
		charset: 'utf8',
		collate: 'utf8_general_ci',
	});
}
