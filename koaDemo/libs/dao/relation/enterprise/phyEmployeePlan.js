'use strict'

const Base = require('../base');

module.exports = function (models) {
	let PhyEmployeePlan = models.enterprise.PhyEmployeePlan;

	// 复制基类上的方法
	Base.copy(PhyEmployeePlan);

	return PhyEmployeePlan;
};
