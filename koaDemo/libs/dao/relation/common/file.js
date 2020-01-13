'use strict'

const Base = require('../base');

module.exports = function (models) {
	let File = models.common.File;

	// 复制基类上的方法
	Base.copy(File);

	return File;
};
