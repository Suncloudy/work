'use strict'

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('MedicalExaminationPackageType', {
    id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment: 'id'},
    name: {type: DataTypes.STRING, allowNull: false, comment: '套餐类别名称'},
    displayOrder: { type:DataTypes.BIGINT(20), field:'display_order', comment:'显示序号'},
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'medical',
    tableName: 'examination_package_type',
    comment: '体检套餐类型表',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
};