'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Tag = models.content.Tag;

	// 复制基类上的方法
	Base.copy(Tag);

	return Tag; 
};
