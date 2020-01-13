'use strict'

const Base = require('../base');

module.exports = function (models) {
	let ArticleTagMapping = models.content.ArticleTagMapping;

	// 复制基类上的方法
	Base.copy(ArticleTagMapping);

	return ArticleTagMapping; 
};     
