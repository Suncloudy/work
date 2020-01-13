'use strict'

const Base = require('../base');

module.exports = function (models) {
	let PhyExamiantionPlan = models.enterprise.PhyExamiantionPlan;

	// 复制基类上的方法
	Base.copy(PhyExamiantionPlan);

	return PhyExamiantionPlan;
};
