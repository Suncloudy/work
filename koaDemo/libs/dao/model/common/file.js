/* 文件存储 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('File', {
    id: { type: DataTypes.BIGINT(20), autoIncrement: true, primaryKey: true, unique: true, comment:'Id' },
    url: { type: DataTypes.STRING(1024), allowNull: false, comment:'文件Url' },
    name: { type: DataTypes.STRING, comment:'文件名' },
    key: { type: DataTypes.STRING(128), comment:'文件Key' },
    hashEtag: { type: DataTypes.STRING(64), field: 'hash_etag', comment:'文件哈希值' },
    hashMd5: { type: DataTypes.STRING(64), field: 'hash_md5', comment:'文件哈希值(md5)' },
    mimeType: { type: DataTypes.STRING, field: 'mime_type', allowNull: false, comment:'MIMEType' },
    size: { type: DataTypes.INTEGER, field: 'size', allowNull: false, comment:'文件大小' },
    storeType: { type: DataTypes.ENUM('local', 'alioss'), field: 'store_type', allowNull: false, defaultValue:'local', comment:'存储类型：1.本地服务器；2.云存储' },
    createdAt: { type: DataTypes.DATE, allowNull:false, field: 'created_at', defaultValue: DataTypes.NOW }
  },
  {
    underscore: false,
    freezeTableName: true,
    schema: 'common',
    tableName: 'file',
    comment: '文件',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
}
