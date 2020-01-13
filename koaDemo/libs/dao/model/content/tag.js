/**
 * 标签管理表
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Tag', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    name: { type: DataTypes.STRING, field: 'name', allowNull: false, comment:'标签名称' },
    displayOrder: { type:DataTypes.BIGINT(20), field:'display_order',allowNull:false, comment:'序号'},
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'},
  },
  {
    underscore: false,
    freezeTableName: true,
    schema: 'content',
    tableName: 'tag',
    comment: '标签表',
    charset: 'utf8',
    collate: 'utf8_general_ci', 
  });
}
