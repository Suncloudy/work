'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Message = models.user.Message;

	// 复制基类上的方法
	Base.copy(Message);

	return Message;
};


