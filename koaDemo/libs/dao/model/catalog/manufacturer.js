/**
* 生产厂商表 
*/
'use strict'

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('CatalogManufacturer', {
		id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
		name: { type: DataTypes.STRING, comment:'厂商名'},
		description: { type: DataTypes.STRING(1024), comment:'说明' },
		imageFileId: { type:DataTypes.BIGINT(20), field: 'image_file_id', comment:'图片文件'},
		published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, comment:'是否可用' },
		displayOrder: { type:DataTypes.BIGINT(20), field:'display_order', comment:'序号'},
		createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW },
		deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true }
	},
	{
		timestamps: true,
		underscore: false,
		freezeTableName: true,
		paranoid: true,
		schema: 'catalog',
		tableName: 'manufacturer',
		comment: '厂商表',
		charset: 'utf8',
		collate: 'utf8_general_ci',
	});
}
