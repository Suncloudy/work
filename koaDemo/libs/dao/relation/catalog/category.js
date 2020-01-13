'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Category = models.catalog.Category;

	// 复制基类上的方法
	Base.copy(Category);

	return Category;
};
