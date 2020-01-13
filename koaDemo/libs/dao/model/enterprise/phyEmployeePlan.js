/**
 * 员工体检计划中间表  employee_phy_plan表示员工-体检计划-额度中间表 体检计划和员工关系表中要存划拨给员工的套餐金额
 * 使用虚拟删除为保证员工删除后依然可查询到相关体检计划数据
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PhyEmployeePlan', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    phyPlanId:{ type:DataTypes.BIGINT(20), field: 'phy_plan_id', comment:'体检计划id'},
    employeeId: { type:DataTypes.BIGINT(20), field: 'employee_id', comment:'员工id'},
    money:{ type: DataTypes.DECIMAL(10, 2),comment:'划拨给员工的套餐金额'},
    status:{ type: DataTypes.INTEGER(2), field: 'status', allowNull: false,  defaultValue:0, comment:'员工体检计划完成状态 0未完成 1已完成' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'},
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'enterprise',
    tableName: 'phy_employee_plan',
    comment: '体检计划-员工-套餐中间表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
