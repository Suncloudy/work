/**
* 广告位配置表 
*/
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Ad', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    placement: { type: DataTypes.STRING, comment:'广告位置'},
    relationId: { type:DataTypes.BIGINT(20), field: 'relation_id', allowNull:false, comment:'相关信息Id'},
    displayOrder: { type:DataTypes.BIGINT(20), field:'display_order', comment:'序号'},
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'common',
    tableName: 'ad',
    comment: '广告位配置表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
