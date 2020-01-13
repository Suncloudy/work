/**
* 企业扩展信息表
*/
'use strict'

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Enterprise', {
		accountId: { type:DataTypes.BIGINT(20), field: 'account_id', primaryKey : true, unique : true},

		name: { type: DataTypes.STRING, comment:'企业名'},
		logoFileId: { type: DataTypes.BIGINT(20), field: 'logo_file_id', comment:'企业Logo' },
		licenseFileId: { type: DataTypes.BIGINT(20), field: 'license_file_id', comment:'营业执照图片' },
		telephone: { type: DataTypes.STRING(32), comment:'座机号' },
		identity: { type: DataTypes.STRING(32), comment:'企业注册码' },
		province: { type: DataTypes.STRING, comment:'省份' },
		city: { type: DataTypes.STRING, comment:'市' },
		county: { type: DataTypes.STRING, comment:'区县' },
		address: { type: DataTypes.STRING, comment:'详细地址' },
		contact: { type: DataTypes.STRING, comment:'联系人' },

		employee: { type: DataTypes.INTEGER(4), allowNull: false, defaultValue: 0, comment:'员工数'},
		department: { type: DataTypes.INTEGER(4), allowNull: false, defaultValue: 0, comment:'部门数'},
		createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW ,comment:'更新时间'},
		deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'}
	},
	{
		timestamps: true,
		underscore: false,
		freezeTableName: true,
		paranoid: true,
		schema: 'user',
		tableName: 'enterprise',
		comment: '用户-企业用户扩展信息',
		charset: 'utf8',
		collate: 'utf8_general_ci',
		initialAutoIncrement: 1000
	});
}
