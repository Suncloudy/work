/**
 * 体检卡表
 */
'use strict'
const {Money} = require('../../../utils');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MedicalCard', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    userId: {type: DataTypes.BIGINT(11), field: 'user_id', comment: '用户id 卡归属用户'},
    purchasedOrderId: { type:DataTypes.BIGINT(20), field: 'purchased_order_id', comment:'购买的订单编号'},
    purchasedOrderItemId: { type:DataTypes.BIGINT(20), field: 'purchased_order_item_id', comment:'购买的订单详细'},
    manufacturerMedicalCenterId: { type:DataTypes.BIGINT(20), field: 'manufacturer_medical_center_id', comment:'所属体检中心'},
    examinationPackageId: { type:DataTypes.BIGINT(20), field: 'examination_package_id', comment:'所属套餐'},
    amount: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, comment:'卡额度' },
    cardNumber: {type: DataTypes.STRING, field: 'card_number',  allowNull: false,comment: '卡号'},
    cardPassword:{ type: DataTypes.STRING, field: 'card_password', allowNull: false, comment:'卡密码 管理员录入的时候密码是体检机构给的 用户需要验证码获取体检卡密码' },
    status:{ type: DataTypes.INTEGER, field: 'status', defaultValue:0, comment:'体检卡状态体检卡状态：0 未使用; 1 锁定; 2 已绑定用户（售出）; 3 已使用 ' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW ,comment:'更新时间'},
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'medical',
    tableName: 'card',
    comment: '体检卡表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
