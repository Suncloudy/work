/**
 * 金币流水表
 */
'use strict'
const {Money} = require('../../../utils');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AccountTransaction', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    accountId: { type: DataTypes.BIGINT(20),allowNull:false, field: 'account_id', comment:'所属用户' },
    type: { type: DataTypes.ENUM, allowNull: false, values:['recharge', 'withdraw', 'consumption', 'refund', 'manager', 'other'], default:'other', comment:'交易类型' },
    balance: {type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, default: 0, comment:'操作后余额' },
    transactionAmount: { type: DataTypes.DECIMAL(10,2), get: Money.get, set: Money.set, allowNull:false,field: 'transaction_amount',comment:'此次操作金额' },
    relationId: { type: DataTypes.BIGINT(20), allowNull:false, field: 'relation_id', comment:'相关Id，如：订单Id等' },
    note: { type: DataTypes.STRING(1024), allowNull:false, field: 'note', comment:'操作说明' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW ,comment:'更新时间'},
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'}
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'user',
    tableName: 'account_transaction',
    comment: '用户-金币流水',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
