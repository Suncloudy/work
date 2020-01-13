/**
 * 用户邀请表 企业员工才可以使用邀请功能 ，可以邀请基础用户
 * 表针对企业员工 用户只有在企业中才可以推荐其它用户
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Invite', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    inviteeId: { type:DataTypes.BIGINT(20), field: 'invitee_id' ,comment:'受邀人id'},
    inviterId: { type:DataTypes.BIGINT(20), field: 'inviter_id',comment:'邀请人id' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'user',
    tableName: 'invite',
    comment: '用户邀请表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
