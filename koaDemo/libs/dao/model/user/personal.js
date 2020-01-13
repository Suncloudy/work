/**
* 个人扩展信息表
*/
'use strict'

module.exports = (sequelize, DataTypes) => { 
	return sequelize.define('Personal', {
		accountId: { type:DataTypes.BIGINT(20), field: 'account_id', primaryKey : true, unique : true},
		enterpriseId: { type: DataTypes.BIGINT(20), field: 'enterprise_id', allowNull: true, comment:'所属企业' },
		name: { type: DataTypes.STRING, comment:'姓名'},
		nickname: { type: DataTypes.STRING, comment:'昵称' },
		avatarFileId: { type: DataTypes.BIGINT(20), field:'avatar_file_id', comment:'用户头像' },
		gender: { type: DataTypes.INTEGER(4), allowNull: false, defaultValue: 0, comment:'性别',comment:"0 男 ，1 女"},
		birthday: { type: DataTypes.DATE, comment:'生日' },
		qq: { type: DataTypes.STRING(32), comment:'QQ' },
		wechat: { type: DataTypes.STRING(32), comment:'微信' },
		identity: { type: DataTypes.STRING(32), comment:'身份证号' },
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
		tableName: 'personal',
		comment: '用户-个人用户扩展信息',
		charset: 'utf8',
		collate: 'utf8_general_ci',
	});
}
