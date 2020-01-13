'use strict'

const Base = require('../base');

module.exports = function (models) {
	let FindPassword = models.user.FindPassword;

	// 复制基类上的方法
	Base.copy(FindPassword);

	return FindPassword;
};
