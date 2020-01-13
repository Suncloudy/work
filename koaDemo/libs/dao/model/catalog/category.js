/**
* 商品分类表 
*/
'use strict'

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('CatalogCategory', {
		id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
		name: { type: DataTypes.STRING, comment:'分类名'},
		description: { type: DataTypes.STRING(1024), comment:'说明' },
		parentCategoryId: { type:DataTypes.BIGINT(20), field: 'parent_category_id', comment:'上级分类Id'},
		showOnHomePage: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'show_on_home_page', comment:'是否首页显示（预留）' },
		published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment:'是否可用' },
		displayOrder: { type:DataTypes.BIGINT(20), field:'display_order', comment:'序号'},
		deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'}
	},
	{
		timestamps: false,
		underscore: false,
		freezeTableName: true,
		paranoid: true,
		schema: 'catalog',
		tableName: 'category',
		comment: '商品分类表',
		charset: 'utf8',
		collate: 'utf8_general_ci',
	});
}
