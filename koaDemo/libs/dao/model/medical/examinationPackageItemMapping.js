/**
 * 体检套餐-检查项目关系表 
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MedicalExaminationPackageItemMapping', {
    examinationPackageId: { type:DataTypes.BIGINT(20), field: 'examination_package_id', comment:'所属套餐'},
    examinationItemId: { type:DataTypes.BIGINT(20), field: 'examination_item_id', comment:'检查项目'},
    important: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment:'是否重点项目' },
    displayOrder: { type:DataTypes.BIGINT(20), field:'display_order', comment:'显示序号'}
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'medical',
    tableName: 'examination_package_item_mapping',
    comment: '体检套餐-检查项目关系表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
