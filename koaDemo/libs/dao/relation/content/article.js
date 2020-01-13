'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Article = models.content.Article;

	// 复制基类上的方法
	Base.copy(Article);

	return Article;
};
