/**
 * 用户企业部门中间表  ent_employee表示企业、部门、员工三者关系
 * 使用虚拟删除为保证员工删除后依然可查询到相关数据
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('EntEmployee', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    accountId:{ type:DataTypes.BIGINT(20), field: 'account_id', comment:'用户id'},
    enterpriseId: { type:DataTypes.BIGINT(20), field: 'enterprise_id', comment:'企业id'},
    departmentId: { type:DataTypes.BIGINT(20), field: 'department_id',allowNull: true,  comment:'部门id'},
    status:{ type: DataTypes.INTEGER(2), field: 'status', allowNull: false,  defaultValue:1, comment:'员工确认状态，员工登录确认后才能正式关联到当前企业下 0默认员工待确认待处理 1员工已确认正常状态 2拒绝解除关系状态' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'},
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'user',
    tableName: 'ent_employee',
    comment: '用户-企业-部门中间表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
