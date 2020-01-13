/**
 * 文章管理
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Article', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    title: { type: DataTypes.STRING(1024), field: 'article_title', allowNull: false, comment:'文章标题' },
    summary:{ type: DataTypes.TEXT, allowNull: false,  comment:'文章简介' },
    content: { type: DataTypes.TEXT, field: 'content', comment:'文章内容'},
    coverFileId: { type: DataTypes.BIGINT(20), field: 'cover_file_id', comment:'封面图' },
    status: { type: DataTypes.ENUM, allowNull: false, values:['draft', 'online', 'offline'], defaultValue: 'draft', comment:'文章状态'},
    publishedAt: { type: DataTypes.DATE, field: 'published_at', comment:'发布时间'},
    pageviews: { type: DataTypes.INTEGER, allowNull:false, defaultValue:0, comment:'浏览量' }, 
    displayOrder: { type:DataTypes.BIGINT(20), field:'display_order', comment:'序号'},
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW ,comment:'更新时间'},
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'}
  },
  {
    underscore: false, 
    freezeTableName: true,
    schema: 'content',
    tableName: 'article',
    comment: '文章表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
