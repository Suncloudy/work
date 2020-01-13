'use strict'

const Base = require('../base');

module.exports = function (models) {
	let InvoiceAddress = models.invoice.InvoiceAddress;

	// 复制基类上的方法
	Base.copy(InvoiceAddress);

	return InvoiceAddress;
};
