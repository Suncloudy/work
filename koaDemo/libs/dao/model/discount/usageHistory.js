/**
 * 折扣使用记录表
 */
'use strict'
const {Money} = require('../../../utils');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('DiscountUsageHistory', {
    id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
    discountId: {type: DataTypes.BIGINT(11), field: 'discount_id', allowNull: false, comment:'折扣Id' },
    orderId: {type: DataTypes.BIGINT(11), field: 'order_id', allowNull: false, comment:'订单Id' },
    couponId: {type: DataTypes.BIGINT(11), field: 'coupon_id', comment:'优惠券Id，可能为空' },
    discountAmount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'discount_amount', allowNull: false, defaultValue: 0, comment:'实际优惠金额' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'discount',
    tableName: 'usage_hitory',
    comment: '折扣使用记录',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
}
