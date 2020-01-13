/**
 * 已开发票信息表 
 * 与订单表是一对多 一开具发票可对应多订单
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Remittance', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    accountId: { type: DataTypes.BIGINT(20), field: 'account_id', comment:'所属账户 企业或者个人' },
    money:{type: DataTypes.DECIMAL(10, 2), field: 'money',comment:'汇款金额'},
    name: { type: DataTypes.STRING, comment:'汇款人姓名'},
    commitWay:{ type: DataTypes.INTEGER(2), field: 'commit_way', allowNull: false,  defaultValue:0, comment:'汇款证明提交方式 0提交汇款底单扫描件 1填写汇款底单信息' },
    image: { type: DataTypes.STRING, comment:'汇款底单扫描图片路径' },
    contact: { type: DataTypes.STRING,allowNull: false, comment:'联系人' },
    bankAccount: { type: DataTypes.STRING(32), comment:'汇款银行账户' },
    phoneNumber: { type: DataTypes.STRING, field: 'phone_number',allowNull: false, comment:'联系人手机号' },
    status:{ type: DataTypes.INTEGER(2), field: 'status', allowNull: false,  defaultValue:0, comment:'汇款审核状态 0审核中 1审核已完成' },
    note: { type: DataTypes.STRING, field: 'note', allowNull: true, comment:'备注' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true}
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'remittance',
    tableName: 'record',
    comment: '汇款记录表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
