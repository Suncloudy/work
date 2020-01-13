/**
 * 体检项目表
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MedicalExaminationItem', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    name: { type: DataTypes.STRING, comment:'项目名称'},
    description: { type: DataTypes.STRING(1024), comment:'项目说明' },
    filter: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment:'是否筛选器' },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment:'是否可用' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'medical',
    tableName: 'examination_item',
    comment: '体检项目表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
