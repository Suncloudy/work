'use strict'

const Base = require('../base');

module.exports = function (models) {
	let EntEmployee = models.enterprise.EntEmployee;

	// 复制基类上的方法
	Base.copy(EntEmployee);

	return EntEmployee;
};