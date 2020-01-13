/**
 * 帐号基本信息
 * 帐号基本信息存储：个人、企业公用部分都存储在这个表中。个人再单独一个 personal 表，企业再单独存一个 enterprise 来存储企业相关信息
 * 用户自带一个折扣 企业可以谈下来固定的折扣值，员工也就得到固定折扣，基础用户无折扣，但是可以接受企业员工的赠送
 */
'use strict'
const {Money} = require('../../../utils');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('WxInfo', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    accountId: { type:DataTypes.BIGINT(20), field: 'account_id',allowNull: true, unique : true, comment:'绑定用户'},
    nickName: { type: DataTypes.STRING(50), field: 'nick_name', allowNull: true, comment:'微信昵称'},
    openId: { type: DataTypes.STRING(255), field: 'open_id', allowNull: true, comment:'open_id'},
    sessionKey: { type: DataTypes.STRING(255), field: 'session_key', allowNull: true, comment:'session_key'},
    headPhoto:{ type: DataTypes.STRING(1024), field: 'head_photo', allowNull: true, comment:'微信头像'},
    phoneNumber:{ type: DataTypes.STRING(1024), field: 'phone_number', allowNull: true, comment:'微信绑定电话'},
    lastLoginAt: { type: DataTypes.DATE, field: 'last_login_at', allowNull: true, defaultValue: DataTypes.NOW, comment:'最后登录时间'},
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'},
  },
  {
    timestamps: true,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'user',
    tableName: 'wx_info',
    comment: '用户-微信用户信息',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
