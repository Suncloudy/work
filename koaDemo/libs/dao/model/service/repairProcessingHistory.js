/**
 * 返修退换货处理历史
 */
'use strict'
const {Money} = require('../../../utils');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('RepairProcessingHistory`', {
    id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
    repairId: {type: DataTypes.BIGINT(11), field: 'repair_id', allowNull: false, comment:'返修单Id' },
    operatorId: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue:-1, comment:'处理人Id' },
    operator: { type: DataTypes.STRING, comment:'处理人' },
    lastStatus: { type: DataTypes.ENUM, values: ['pending','resolve', 'mail', 'rejected',  'unreceive','abnormal', 'servicing', 'serviced','final'], allowNull: false,
    comment:'处理状态：pending-提交待审核,resolve-客服审核,mail-待邮寄, rejected-审核未通过,unreceive-待收货,abnormal-货物异常,servicing-售后中,serviced-售后完成,final-完成' },
    status: { type: DataTypes.ENUM, values: ['pending', 'resolve','mail', 'rejected',  'unreceive','abnormal', 'servicing', 'serviced','final'], allowNull: false,
    comment:'处理状态：pending-提交待审核,resolve-客服审核,mail-待邮寄, rejected-审核未通过,unreceive-待收货,abnormal-货物异常,servicing-售后中,serviced-售后完成,final-完成' },
    description: { type: DataTypes.TEXT, comment:'处理说明'},
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'service',
    tableName: 'repair_processing_history',
    comment: '返修退换货处理历史',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
}
