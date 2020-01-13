'use strict'

const Base = require('../base');

module.exports = function (models) {
	let EntDepartment = models.user.EntDepartment;

	// 复制基类上的方法
	Base.copy(EntDepartment);

	return EntDepartment;
};
