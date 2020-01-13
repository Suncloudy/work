/**
 * 企业部门表 企业与部门的关系是一对多 部门是企业自己维护的
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('EntDepartment', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    enterpriseId: { type:DataTypes.BIGINT(20), field: 'enterprise_id' },
    numberEmps:{type:DataTypes.BIGINT,field:"number_employees",allowNull:false,defaultValue:0,comment:'员工的总人数'},
    name: { type: DataTypes.STRING, comment:'部门名称'},
    money:{ type: DataTypes.DECIMAL(10, 2),comment:'部门对应体检套餐额度'},
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
    schema: 'user',
    tableName: 'ent_department',
    comment: '用户-企业部门表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
