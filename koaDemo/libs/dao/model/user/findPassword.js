/**
 * 找回密码状态记录
 */
'use strict'

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('FindPassword', {
		id:{type:DataTypes.BIGINT(11),autoIncrement:true,primaryKey : true, unique : true},
		taskId: { type: DataTypes.UUID, field: 'task_id', allowNull: false, defaultValue: DataTypes.UUIDV4, comment:'流程Id' },
		userId: {type: DataTypes.BIGINT(11), field: 'user_id', allowNull: false, comment:'申请人Id' },
		phoneNumber: { type: DataTypes.STRING, field: 'phone_number', allowNull: false, comment:'手机号码' },
		verifyCode: { type: DataTypes.STRING, field: 'verify_code', comment:'验证码' },
		status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, comment:'状态：1.创建密码找回任务。2.手机验证完成。0.密码重置完成。-1.找回失败' },
		remark: { type: DataTypes.STRING, allowNull: true, defaultValue: 0, comment:'备注' },
	},
	{
		underscore: false,
		timestamps: false,
        freezeTableName: true,
        schema: 'user',
		tableName: 'findPassword',
		comment: '找回密码',
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});
}
