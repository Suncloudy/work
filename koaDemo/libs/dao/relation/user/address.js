'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Address = models.user.Address;

	// 复制基类上的方法
	Base.copy(Address);

	return Address;
};


