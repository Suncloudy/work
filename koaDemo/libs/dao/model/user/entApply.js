/**
* 企业申请表
*/
'use strict'

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('EntApply', {
        id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
        name: { type: DataTypes.STRING, comment:'企业名'},
        province: { type: DataTypes.STRING, comment:'省份' },
        city: { type: DataTypes.STRING, comment:'市' },
        county: { type: DataTypes.STRING, comment:'区县' },
        address: { type: DataTypes.STRING, comment:'详细地址' },
        contact: { type: DataTypes.STRING, comment:'联系人' },
        phoneNumber: { type: DataTypes.STRING, field: 'phone_number', comment:'手机号码' },
        email: { type: DataTypes.STRING, comment:'邮箱' },
        status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'pending', comment:'申请状态'},
        comment: { type: DataTypes.STRING(1024), comment:'处理备注'},
        adminId: { type: DataTypes.BIGINT(20), field: 'admin_id', allowNull: true, comment:'处理人' },
        accountId: { type: DataTypes.BIGINT(20), field: 'account_id', allowNull: true, comment:'帐号Id，处理成功时写入' },
        createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW }
    },
    {
        timestamps: false,
        underscore: false,
        freezeTableName: true,
        schema: 'user',
        tableName: 'ent_apply',
        comment: '企业申请表',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        initialAutoIncrement: 1000
    });
}
