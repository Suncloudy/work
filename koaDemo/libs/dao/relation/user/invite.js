'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Invite = models.user.Invite;

	// 复制基类上的方法
	Base.copy(Invite);

	return Invite;
};
