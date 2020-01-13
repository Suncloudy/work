/**
* 订单汇款收据表
* 与订单关系 多对1(用户每提交一次，创建一条收据）, 处理时结合订单支付状态，查找最后一条收据记录
*/
'use strict'

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('TransferReceipt', {
    id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
    orderId: {type: DataTypes.BIGINT(11), field: 'order_id', allowNull: false, comment:'订单Id' },
    fileId: { type:DataTypes.BIGINT(20), field: 'file_id', allowNull: false, comment:'收据文件Id'},
    adminId: { type: DataTypes.BIGINT(20), field: 'admin_id', comment:'处理人' },
    status: { type: DataTypes.BOOLEAN, comment:'审核状态'}, 
    note: { type: DataTypes.STRING, comment:'备注、处理说明' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    reviewedAt: { type: DataTypes.DATE, field: 'reviewed_at', comment:'审核时间'},
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    paranoid: false,
    schema: 'order',
    tableName: 'transfer_receipt',
    comment: '订单汇款收据表',//交易表
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [{
      name: 'orderTransactionTransferReceipt_orderId',
      method: 'BTREE',
      fields: ['order_id']
    }]
  });
}
