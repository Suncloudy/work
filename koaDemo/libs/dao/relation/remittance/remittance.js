'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Remittance = models.remittance.Remittance;

	// 复制基类上的方法
	Base.copy(Remittance);

	return Remittance;
};
