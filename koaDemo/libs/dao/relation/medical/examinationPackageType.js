'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Model = models.medical.ExaminationPackageType;

	// 复制基类上的方法
	Base.copy(Model);

	/**
  * 格式化返回数据
  * @params {Array} [attributes] 需要返回的字段，不传则返回全部
  */ 
  Model.prototype.format = function (attributes) {
    let data = null
    if(Array.isArray(attributes)&&attributes.length>0) {
      let self = this;
      data = {};
      attributes.map((key) => {data[key]=this[key]});
    } else {
      data = JSON.parse(JSON.stringify(this.dataValues))
    }
    
    return data;
  };

	return Model;
};
