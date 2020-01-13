/**
 * 用户联系地址表
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Address', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    accountId: { type: DataTypes.BIGINT(20), field: 'account_id', comment:'所属用户' },
    name: { type: DataTypes.STRING, comment:'地址名'},
    receiver: { type: DataTypes.STRING, comment:'收货人' },
    phoneNumber: { type: DataTypes.STRING, field: 'phone_number', comment:'手机号码' },
    province: { type: DataTypes.STRING(64), comment:'省份' },
    city: { type: DataTypes.STRING(64), comment:'市' },
    county: { type: DataTypes.STRING(64), comment:'区县' },
    address: { type: DataTypes.STRING, comment:'详细地址' },
    default: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment:'是否默认地址' },
    order: { type:DataTypes.BIGINT(20), comment:'序号'},
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'user',
    tableName: 'address',
    comment: '用户-收货地址',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
