/**
 * 返修退换货申请表 (等修改)
 */
'use strict'
const {Money} = require('../../../utils');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Repair', {
    id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
    number: { type: DataTypes.STRING, allowNull: false, comment:'服务单号' },
    accountId: {type: DataTypes.BIGINT(11), field: 'account_id', allowNull: false, comment:'用户Id' },
    orderId: {type: DataTypes.BIGINT(11), field: 'order_id', allowNull: true, comment:'所属订单' },
    itemId: {type: DataTypes.BIGINT(11), field: 'item_id', allowNull: true, comment:'订单明细表id' },

    type: { type: DataTypes.ENUM, values: ['refund', 'repair'], allowNull: false, comment:'服务单类型：refund-退款, repair-返修换货'},
    refundWays:{ type: DataTypes.ENUM, values: ['original', 'balance'], allowNull: false, comment:'退款类型：original-原方式, balance-账户余额'},
    reason:{ type: DataTypes.TEXT,  allowNull: false,comment:'原因'},
    description: { type: DataTypes.TEXT, allowNull: false, comment:'问题说明'},
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, comment:'申请数量、退款货数'},
    status: { type: DataTypes.ENUM, values: ['pending', 'resolve','mail', 'rejected', 'unreceive','abnormal', 'servicing', 'serviced','final'], allowNull: false, defaultValue: 'pending', 
      comment:'处理状态：pending-提交待审核,resolve-客服审核,mail-待邮寄, rejected-审核未通过,unreceive-待收货,abnormal-货物异常,servicing-售后中,serviced-售后完成,final-完成' },
    shippingStatus: { type: DataTypes.INTEGER, field: 'shipping_status', allowNull: false, defaultValue: 10, comment:'货物状态：10.未发货。20.部分发货。30.全部发货。40.已收货。50.无需发货'},
    refundedAmount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'refunded_amount', allowNull: false, defaultValue: 0, comment:'退款总额' },
    
    returnShippingMethod: { type: DataTypes.STRING, field: 'return_shipping_method', comment:'回运物流方式' },
    returnShippingNumber: { type: DataTypes.STRING, field: 'return_shipping_number', comment:'回运快递单号' },
    
    returnShippingAddress: {type: DataTypes.STRING, field: 'return_shipping_address',  comment:'商品回寄地址' },
    shippingId: {type: DataTypes.BIGINT(11), field: 'shipping_id',  comment:'收获地址 （用户地址）' },

    refundAt: { type: DataTypes.DATE, field: 'refund_at', allowNull: true, comment:'退款时间' },
    reviewedAt: { type: DataTypes.DATE, field: 'reviewed_at', allowNull: true, comment:'审核时间' },
    createdIp: { type: DataTypes.STRING, field: 'created_id', allowNull: true, comment:'用户IP' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW ,comment:'更新时间'}
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    paranoid: false,
    schema: 'service',
    tableName: 'repair',
    comment: '返回退换货申请',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [{
      name: 'repair_number',
      method: 'BTREE',
      fields: ['number']
    },
    {
      name: 'repair_accountId',
      method: 'BTREE',
      fields: ['account_id']
    },
    {
      name: 'repair_orderId',
      method: 'BTREE',
      fields: ['order_id']
    }]
  });
}
