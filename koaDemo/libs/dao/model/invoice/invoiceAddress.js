/**
 * 发票邮寄地址表 目前发票邮寄只针对企业用户 且一个企业用户最多添加地址为5个
 * 与发票信息关系 1对1  与用户关系 多对1
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('InvoiceAddress', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    accountId: { type: DataTypes.BIGINT(20), field: 'account_id', comment:'所属账户' },
    name: { type: DataTypes.STRING, comment:'地址名'},
    receiver: { type: DataTypes.STRING, comment:'收货人' },
    phoneNumber: { type: DataTypes.STRING, field: 'phone_number', comment:'手机号码' },
    province: { type: DataTypes.STRING(64), comment:'省份' },
    city: { type: DataTypes.STRING(64), comment:'市' },
    county: { type: DataTypes.STRING(64), comment:'区县' },
    address: { type: DataTypes.STRING, comment:'详细地址' },
    default: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment:'是否默认地址' },
    order: { type:DataTypes.BIGINT(20), comment:'序号'},
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
    tableName: 'address',
    comment: '发票邮寄地址表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
