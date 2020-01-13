'use strict'

const Base = require('../base');
const sequelize = require('sequelize')
const Op = sequelize.Op;
const {Catalog, Medical} = require('../../../consts');

module.exports = function (models) {
  let Product = models.catalog.Product;
  let File = models.common.File;
  let ExaminationPackage = models.medical.ExaminationPackage;
  let Card = models.medical.Card;

  if(!Product.associations.File)
  {
    Product.belongsTo(File, {foreignKey:'imageFileId'});
  }
  if(!Product.associations.ParentGroupProduct)
  {
    Product.belongsTo(Product, {foreignKey:'parentGroupProductId', as:'ParentGroupProduct'});
  }
  if(!Product.associations.MedicalExaminationPackage)
  {
    Product.hasOne(ExaminationPackage, {foreignKey:'productId'});
  }
  if(!Product.associations.Childs)
  {
    Product.hasMany(Product, {foreignKey:'parentGroupProductId', as: 'Childs'});
  }
  if(!Product.associations.Groups)
  {
    Product.hasMany(Product, {foreignKey:'parentGroupProductId', targetKey:'parentGroupProductId', as: 'Groups'});
  }  
  
  // 复制基类上的方法
  Base.copy(Product);

  /**
  * 格式化返回数据
  * @params {Array} [attributes] 需要返回的字段，不传则返回全部
  */ 
  Product.prototype.format = function (attributes) {
    let data = null
    if(Array.isArray(attributes)&&attributes.length>0) {
      data = {};
      attributes.map((key) => {data[key]=this[key]});
    } else {
      data = this;
    }
    if(this.File) {
      data.imageUrl = this.File.url;
    }
    if(this.MedicalExaminationPackage) {
      data.MedicalExaminationPackage = this.MedicalExaminationPackage.format();
    }
    if(this.Childs) {
      data.Childs = this.Childs.map((product) => { return product.format() });
    }
    if(this.Groups) {
      data.Groups = this.Groups.map((product) => { return product.format() });
    }

    return data;
  };

  /**
  * 获取库存
  */ 
  Product.prototype.getStock = async function(attributes, cardAttributes) {
    if(this.productType === Catalog.productType.medicalCard) {
      let opts = {
        include: [{
          model: Card,
          where: {status: Medical.cardStatus.unused}
        }]
      };
      if(attributes) opts.attributes = attributes;
      if(cardAttributes) opts.include[0].attributes = cardAttributes;

      this.MedicalExaminationPackage = await this.getMedicalExaminationPackage(opts);

      if(this.MedicalExaminationPackage&&this.MedicalExaminationPackage.MedicalCards.length>0) {
        this.set('stockQuantity', this.MedicalExaminationPackage.MedicalCards.length);
      } else {
        this.set('stockQuantity', 0);
      }
    }
    return Promise.resolve(this);
  }

  return Product;
};
