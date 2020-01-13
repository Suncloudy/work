/**
 * 体检套餐表(可用额度)
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SetMeal', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    enterpriseId: { type:DataTypes.BIGINT(20), field: 'enterprise_id',allowNull: false,  comment:'企业id' },
    money:{ type: DataTypes.DECIMAL(10, 2),comment:'金额'},
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
    tableName: 'set_meal',
    comment: '企业套餐额度表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
