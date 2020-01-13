/**
 * 体检套餐表（等补充）
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MedicalExaminationPackage', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    manufacturerMedicalCenterId: { type:DataTypes.BIGINT(20), field: 'manufacturer_medical_center_id', comment:'所属体检中心'},
    productId: { type:DataTypes.BIGINT(20), field: 'product_id', comment:'所关联产品'},
    name: { type: DataTypes.STRING, comment:'套餐名称'},
    description: { type: DataTypes.STRING(1024), comment:'项目简介' },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, comment:'是否可用' },
    gender: { type: DataTypes.INTEGER, allowNull: false, defaultValue:0, comment:'适用性别: 1-男、2-女、0-全部' },
    maxAge: { type: DataTypes.INTEGER(3), field: 'max_age', allowNull: false, defaultValue:60, comment:'套餐适应最大年龄' },
    minAge: { type: DataTypes.INTEGER(3), field: 'min_age', allowNull: false, defaultValue:18, comment:'套餐适应最小年龄' },
    items: { type: DataTypes.INTEGER(8), allowNull: false, defaultValue: 0, comment:'体检项目数' },
    importantItems: { type: DataTypes.INTEGER(8), field: 'important_items', allowNull: false, defaultValue: 0, comment:'重点项目数' },
    cards: { type: DataTypes.INTEGER(8), allowNull: false, defaultValue: 0, comment:'套餐添加体检卡数量' },
    unusedCards: { type: DataTypes.INTEGER(8), field: 'unused_cards', allowNull: false, defaultValue: 0, comment:'未使用体检卡数量' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true },
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'medical',
    tableName: 'examination_package',
    comment: '体检套餐表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
