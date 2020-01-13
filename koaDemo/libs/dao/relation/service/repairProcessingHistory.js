'use strict'

const Base = require('../base');

module.exports = function (models) {
	let RepairProcessingHistory = models.service.RepairProcessingHistory; 
	// 复制基类上的方法
	Base.copy(RepairProcessingHistory);

	return RepairProcessingHistory;
};
