'use strict'

const Base = require('../base');

module.exports = function (models) {
  let Ad = models.common.Ad;
	let Product = models.catalog.Product;

  if(!Ad.associations.CatalogProduct)
  {
    Ad.belongsTo(Product, {foreignKey:'relationId'});
  }

	// 复制基类上的方法
	Base.copy(Ad);

	/**
  * 格式化返回数据
  * @params {Array} [attributes] 需要返回的字段，不传则返回全部
  */ 
  Ad.prototype.format = function (attributes) {
    let data = null
    if(Array.isArray(attributes)&&attributes.length>0) {
      let self = this;
      data = {};
      attributes.map((key) => {data[key]=this[key]});
    } else {
      data = JSON.parse(JSON.stringify(this.dataValues));
    }
    if(this.CatalogProduct) {
      data.CatalogProduct = this.CatalogProduct.format();
    }

    return data;
  };

	return Ad;
};
