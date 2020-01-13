'use strict'

const Base = require('../base');

module.exports = function (models) {
	let SetMeal = models.enterprise.SetMeal;

	// 复制基类上的方法
	Base.copy(SetMeal);

	return SetMeal;
};