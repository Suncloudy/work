/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 08:12:02
 * @LastEditTime: 2019-08-13 09:51:17
 * @LastEditors: Please set LastEditors
 */
/**
 * 帐号基本信息
 * 帐号基本信息存储：个人、企业公用部分都存储在这个表中。个人再单独一个 personal 表，企业再单独存一个 enterprise 来存储企业相关信息
 * 用户自带一个折扣 企业可以谈下来固定的折扣值，员工也就得到固定折扣，基础用户无折扣，但是可以接受企业员工的赠送
 */
'use strict'
const {Money} = require('../../../utils');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Account', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    username: { type: DataTypes.STRING(50), allowNull: false, comment:'用户名' , unique: true},
    password: { type: DataTypes.STRING, comment:'用户密码' },
    passwordSalt: { type: DataTypes.CHAR(16), field: 'password_salt', comment:'密码salt' },

    phoneNumber: { type: DataTypes.STRING, field: 'phone_number', comment:'手机号码', unique: true },
    email: { type: DataTypes.STRING, comment:'邮箱' },
    emailStatus: { type: DataTypes.BOOLEAN, field: 'email_status', allowNull: false, defaultValue: false, comment:'邮箱验证状态' },

    from: { type: DataTypes.ENUM, allowNull: false, values: ['web', 'wxapp', 'admin'], default:'web', comment:'注册来源' },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, comment:'是否正常状态 1 true 0 false' },
    type: { type: DataTypes.ENUM, allowNull: false, values:['personal', 'enterprise'], comment:'用户类型' },
    
    account: { type: DataTypes.STRING(32), allowNull: true, comment:'帐号' },
    balance: {type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, default: 0, comment:'帐户余额' },
    income: {type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, default: 0, comment:'总收入'},
    payout: {type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, default: 0, comment:'总支出'},
    coin: {type: DataTypes.INTEGER,default: 0,  allowNull: false,comment:'帐户金币' },
     
    discountId: { type: DataTypes.BIGINT(20), field: 'discount_id', comment:'会员、企业折扣' },

    ownerId: { type: DataTypes.BIGINT(20), field: 'owner_id', allowNull: false, defaultValue: 0, comment:'所属销售(adminId)' },
    comment: { type: DataTypes.STRING(1024), comment:'备注信息'},

    creatorId: { type: DataTypes.BIGINT(20), field: 'creator_id', allowNull: false, defaultValue: 0, comment:'创建用户(创建用户的adminId)' },
    createdIp: { type: DataTypes.STRING, field: 'created_ip', comment:'注册IP'},
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    loginCount: { type: DataTypes.INTEGER(6), field: 'login_count', allowNull: false, defaultValue: 0, comment:'登录次数' },
    loginFailTimes: { type: DataTypes.INTEGER, field: 'login_fail_times', allowNull: false, defaultValue: 0, comment:'登录失败次数，超过5次锁定24小时' },
    lastLoginIp: { type: DataTypes.STRING, field: 'last_login_ip', comment:'最后登录IP'},
    lastLoginAt: { type: DataTypes.DATE, field: 'last_login_at', allowNull: true, defaultValue: DataTypes.NOW, comment:'最后登录时间'},
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'},
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'user',
    tableName: 'account',
    comment: '用户-帐号基本信息',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
