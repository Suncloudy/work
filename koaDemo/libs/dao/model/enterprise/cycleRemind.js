/**
 * 周期提醒表  企业可以设置
 * 使用虚拟删除为保证员工删除后依然可查询到相关体检计划数据
 */
'use strict'

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('CycleRemind', {
    id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'Id' },
    enterpriseId: { type:DataTypes.BIGINT(20), field: 'enterprise_id',allowNull: false,  comment:'企业id' },
    cycle: { type: DataTypes.INTEGER, comment:'周期倍数' },
    cyclePeriod: { type: DataTypes.INTEGER, field:'cycle_period', allowNull: false, defaultValue:20, comment:'周期类型：0.天 10.周 20.月 30.年' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'}
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'enterprise',
    tableName: 'cycle_remind',
    comment: '周期提醒表',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
};
