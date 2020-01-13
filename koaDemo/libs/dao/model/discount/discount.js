/**
 * 折扣表
 */
'use strict'
const {Money} = require('../../../utils');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Discount', {
    id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
    name: { type: DataTypes.STRING, comment:'折扣名称'},
    discountType: { type: DataTypes.ENUM('enterprise', 'shippingFee', 'coupon'), allowNull: true, field:'discount_type', comment: '折扣类型类型：1. 企业会员 2. 优惠券 3. 运费券'},
    usePercentage: { type: DataTypes.BOOLEAN, field: 'use_percentage', defaultValue: false, comment:'是否使用百分比' },
    discountPercentage: { type: DataTypes.DECIMAL(10, 2), field: 'discount_percentage', allowNull: false, defaultValue: 1, comment:'折扣率',
      validate: { min:0.01, max: 1},
      get: function() { 
        if(this.getDataValue('usePercentage')) {
          let val = this.getDataValue('discountPercentage'); 
          if(!val) return 1;
          else return Number(val);
        } else return null;
      }
    },
    discountAmount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'discount_amount', allowNull: false, defaultValue: 0, comment:'折扣金额' },
    startAt: { type: DataTypes.DATE, field: 'start_at', allowNull: false, comment:'开始时间' },
    endAt: { type: DataTypes.DATE, field: 'end_at', allowNull: false, comment:'结束时间' },
    limitTime: { type: DataTypes.BOOLEAN, field: 'limit_time', allowNull: false, defaultValue: true, comment:'是否限制使 ' },
    limitTimes: { type: DataTypes.INTEGER, field: 'limit_times', allowNull: false, defaultValue: 0, comment:'限制使用次数' },
    limitId: { type: DataTypes.BOOLEAN, field: 'limit_id', allowNull: false, defaultValue: false, comment:'是否限制用户id' },
    limitAmount: { type: DataTypes.DECIMAL(10, 2), field: 'limit_amount', get: Money.get, set: Money.set, allowNull: false, defaultValue: 0, comment:'最低使用金额' },
    requiresCoupon: { type: DataTypes.BOOLEAN, field: 'requires_coupon', allowNull: false, defaultValue: false, comment:'是否需要优惠券' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW, comment:'更新时间'}
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    schema: 'discount',
    tableName: 'discount',
    comment: '折扣主表',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
}
