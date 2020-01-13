'use strict'

const Base = require('../base');

module.exports = function (models) {
	let RepairFile = models.service.RepairFile;

	// 复制基类上的方法
	Base.copy(RepairFile);

	return RepairFile;
};
