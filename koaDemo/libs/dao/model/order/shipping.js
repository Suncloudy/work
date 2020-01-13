/**
* 订单明细表 
* 与订单表一对一
*/
'use strict'

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('OrderShipping', {
    id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
    orderId: {type: DataTypes.BIGINT(11), field: 'order_id', allowNull: false, comment:'订单Id' },
    receiver: { type: DataTypes.STRING, comment:'收货人' },
    phoneNumber: { type: DataTypes.STRING, field: 'phone_number', comment:'手机号码' },
    province: { type: DataTypes.STRING(64), comment:'省份' },
    city: { type: DataTypes.STRING(64), comment:'市' },
    county: { type: DataTypes.STRING(64), comment:'区县' },
    address: { type: DataTypes.STRING, comment:'详细地址' }
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'order',
    tableName: 'shipping',
    comment: '订单货运信息表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [{
      name: 'orderShipping_orderId',
      method: 'BTREE',
      fields: ['order_id']
    }]
  });
}

