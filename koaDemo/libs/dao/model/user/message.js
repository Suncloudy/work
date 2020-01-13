/**
 * 用户消息表
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Address', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    accountId: { type: DataTypes.BIGINT(20), field: 'account_id', comment:'所属用户' },
    title: { type: DataTypes.STRING(2048),allowNull:false, comment:'消息标题'},
    author: { type: DataTypes.STRING,allowNull:true, comment:'作者',},
    content: { type: DataTypes.TEXT, comment:'消息内容' },
    type: { type: DataTypes.ENUM, allowNull:false,values:['system','other'],defaultValue:'system',comment:'消息的类型' },
    status: { type: DataTypes.ENUM, allowNull: false, values:['read', 'unread'], defaultValue: 'unread', comment:'消息状态'},
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
    tableName: 'message',
    comment: '用户-消息提醒',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
