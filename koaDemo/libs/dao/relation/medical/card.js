'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Card = models.medical.Card;
	let Order = models.order.Order;
	let ExaminationPackage = models.medical.ExaminationPackage;

	// 复制基类上的方法
	Base.copy(Card);
	if(!Card.associations.Order)
  {
    Card.belongsTo(Order, {foreignKey:'purchasedOrderId'});  
  }
  if(!Card.associations.MedicalExaminationPackage)
  {
    Card.belongsTo(ExaminationPackage, {foreignKey:'purchasedOrderId'});  
  }


	/**
  * 格式化返回数据
  * @params {Array} [attributes] 需要返回的字段，不传则返回全部
  */ 
  Card.prototype.format = function (attributes) {
    let data = null
    if(Array.isArray(attributes)&&attributes.length>0) {
      let self = this;
      data = {};
      attributes.map((key) => {data[key]=this[key]});
    } else {
      data = this
    }

    return data;
  };

	return Card;
};
