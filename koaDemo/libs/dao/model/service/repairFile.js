/**
 * 返修退换货相关说明图片
 */
'use strict'
const {Money} = require('../../../utils');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('RepairFile', {
    id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'主键' },
    repairId: {type: DataTypes.BIGINT(11), field: 'repair_id', allowNull: false, comment:'返修单Id' },
    fileId: {type: DataTypes.BIGINT(11), field: 'file_id', allowNull: false, comment:'文件Id' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'service',
    tableName: 'repair_file',
    comment: '返修退换货相关说明图片',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
}
