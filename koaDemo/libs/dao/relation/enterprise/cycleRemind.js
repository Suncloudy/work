'use strict'

const Base = require('../base');

module.exports = function (models) {
	let CycleRemind = models.enterprise.CycleRemind;

	// 复制基类上的方法
	Base.copy(CycleRemind);

	return CycleRemind;
};
