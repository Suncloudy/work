/**
 * 折扣优惠券
 */
'use strict'

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('DiscountCoupon', {
    id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
    discountId: { type: DataTypes.BIGINT(11), field: 'discount_id', allowNull: true, comment:'所属折扣' },
    accountId: { type: DataTypes.BIGINT(11), field: 'account_id', comment:'领取用户' },
    couponCode: { type: DataTypes.STRING,field: 'coupon_code', comment:'优惠券编码'},
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW, comment:'更新时间'}
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    schema: 'discount',
    tableName: 'coupon',
    comment: '折扣优惠券',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
}
