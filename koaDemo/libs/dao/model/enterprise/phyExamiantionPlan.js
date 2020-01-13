/**
 * 体检计划表
 * 每次体检考虑那些人就可以，不用考虑体检那些部门
 * deletedAt体检计划用于企业体检计划作废
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PhyExamiantionPlan', {
    id: { type:DataTypes.BIGINT(20),autoIncrement:true, primaryKey : true, unique : true},
    enterpriseId: { type: DataTypes.BIGINT(20), field: 'enterprise_id', allowNull: true, comment:'所属企业' },
    payout:{type: DataTypes.DECIMAL(10, 2), field: 'payout',comment:'体检支出'},
    name: { type: DataTypes.STRING, comment:'体检计划名称'},
    status: { type: DataTypes.INTEGER(4), allowNull: false, defaultValue: 0, comment:'体检计划状态 0是创建 1是进行 2是完成 -1失败'},
    planDate:{ type: DataTypes.DATE, field: 'plan_date', allowNull: true,  comment:'体检时间' },
    employeeNumber: { type: DataTypes.INTEGER(4), field: 'employee_number',allowNull: false, defaultValue: 0, comment:'体检人数'},
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW ,comment:'更新时间'},
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'}
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'enterprise',
    tableName: 'phy_examiantion_plan',
    comment: '体检计划表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
