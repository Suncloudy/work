/**
 * 发票基本信息表--企业设置自己的基础发票信息
 * 与用户关系 1对1
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('InvoiceProfile', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    accountId: { type: DataTypes.BIGINT(20), field: 'account_id',allowNull: false,  comment:'对应的企业或个人' },
    accountType:{  type: DataTypes.INTEGER(2), field: 'account_type',allowNull: false, defaultValue: 0,comment:'开票人类型 0企业 1普通用户' },
    invoiceHead: { type: DataTypes.STRING,allowNull: false, field: 'invoice_head', comment:'发票抬头'},
    invoiceType: {  type: DataTypes.INTEGER(2), field: 'invoice_type',allowNull: false, defaultValue: 0,comment:'发票类型 0企业增值税普通发票 1增值税专用发票' },
    taxpayerId: { type:DataTypes.BIGINT(20), field: 'taxpayer_id',allowNull: false,comment:'纳税人识别码' },
    bankAccount: { type: DataTypes.STRING(32), comment:'开户银行账户，开户许可证上的银行帐号' },
    bankName: { type: DataTypes.STRING(32), comment:'基本开会银行名称 开户许可证上的开户行名称' },
    address: { type: DataTypes.STRING, comment:'企业注册地址，营业执照上的注册地址' },
    province: { type: DataTypes.STRING, comment:'省份' },
    city: { type: DataTypes.STRING, comment:'市' },
    county: { type: DataTypes.STRING, comment:'区县' },
    phoneNumber: { type: DataTypes.STRING, field: 'phone_number', comment:'有效联系电话' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW ,comment:'更新时间'},
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'}
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'invoice',
    tableName: 'profile',
    comment: '发票基础信息表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
