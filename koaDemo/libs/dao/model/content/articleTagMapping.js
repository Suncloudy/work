/**
 * 文章-标签关系表 
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ArticleTagMapping', {
    articleId: { type:DataTypes.BIGINT(20), field: 'article_id', comment:'文章Id'},
    tagId: { type:DataTypes.BIGINT(20), field: 'tag_id', comment:'标签Id'}
  },
  {
    underscore: false,
    freezeTableName: true,
    schema: 'content',
    tableName: 'article_tag_mapping',
    comment: '体检套餐-检查项目关系表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
