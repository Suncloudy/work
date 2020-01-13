'use strict'

const Base = require('../base');

module.exports = function (models) {
	let EntApply = models.user.EntApply;

	// 复制基类上的方法
	Base.copy(EntApply);

	return EntApply;
};
