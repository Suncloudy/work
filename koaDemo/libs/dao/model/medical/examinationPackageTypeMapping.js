/**
 * 体检套餐-套餐类型关系表 
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MedicalExaminationPackageTypeMapping', {
    examinationPackageId: { type:DataTypes.BIGINT(20), field: 'examination_package_id', comment:'所属套餐'},
    examinationPackageTypeId: {type:DataTypes.BIGINT(20), field: 'examination_package_type_id', allowNull: false, comment: '套餐类别id'},
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'medical',
    tableName: 'examination_package_type_mapping',
    comment: '体检套餐-套餐类型关系表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
