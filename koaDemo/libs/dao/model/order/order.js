/**
 * 订单表
 * 订单基本信息
 * 与用户关系 多对1
 */
'use strict'
const {Money} = require('../../../utils');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Order', {
    id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
    uuid: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4, comment:'UUID（设备唯一标识）' },        
    orderNumber: { type: DataTypes.STRING, field: 'order_number', allowNull: false, comment:'订单编号' },
    accountId: {type: DataTypes.BIGINT(11), field: 'account_id', allowNull: false, comment:'账户id 可以是企业用户，可以是基础用户' },
    invoiceId: {type: DataTypes.BIGINT(11), field: 'invoice_id', allowNull: true, comment:'发票id' },

    subTotal: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field:'sub_total', allowNull: false, comment:'小计（商品总额）' },
    subTotalDiscount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'sub_total_discount', allowNull: false, defaultValue: 0, comment:'商品优惠金额' },
    shippingFee: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'shipping_fee', allowNull: false, defaultValue: 0, comment:'运费' },
    total: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, allowNull: false, comment:'订单总额' },
    totalDiscount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'total_discount', allowNull: false, defaultValue: 0, comment:'总优惠金额' },

    accountAmount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'account_amount', allowNull: false, defaultValue: 0,comment:'帐号支付金额' },
    paymentAmount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'payment_amount', allowNull: false,defaultValue: 0, comment:'支付金额' },
    refundedAmount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'refunded_amount', allowNull: false, defaultValue: 0, comment:'退款总额' },

    orderStatus: { type: DataTypes.INTEGER, field: 'order_status', allowNull: false, defaultValue: 10, comment:'订单状态：10.待确认。20.处理中。30.已完成。40.已取消'},
    shippingStatus: { type: DataTypes.INTEGER, field: 'shipping_status', allowNull: false, defaultValue: 10, comment:'发货状态：10.未发货。20.部分发货。30.全部发货。40.已收货。50.无需发货'},
    paymentStatus: { type: DataTypes.INTEGER, field: 'payment_status', allowNull: false, defaultValue: 10, comment:'支付状态：10.待支付。20.已支付。30.支付失败。40.已退款'},
    paymentMethod: { type: DataTypes.ENUM, values: ['wxpay', 'alipay', 'transfer'], field: 'payment_method', comment:'支付方式: 支付宝 微信 转帐' },

    note: { type: DataTypes.STRING, allowNull: true, comment:'备注' },
    paymentExpiredAt: { type: DataTypes.DATE, field: 'payment_expired_at', allowNull: true, comment:'支付过期时间' },
    paidAt: { type: DataTypes.DATE, field: 'paid_at', allowNull: true, comment:'支付时间' },
    createdIp: { type: DataTypes.STRING, field: 'created_id', allowNull: true, comment:'用户IP' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW ,comment:'更新时间'},
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'}
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'order',
    tableName: 'order',
    comment: '订单表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [{
      name: 'order_uuid',
      method: 'BTREE',
      fields: ['uuid']
    },
    {
      name: 'order_accountId',
      method: 'BTREE',
      fields: ['account_id']
    },
    {
      name: 'order_orderStatus',
      method: 'BTREE',
      fields: ['order_status']
    }]
  });
}
