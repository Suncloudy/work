'use strict'

const Base = require('../base');

module.exports = function (models) {
  let ExaminationPackage = models.medical.ExaminationPackage;
  let ExaminationPackageType = models.medical.ExaminationPackageType;
  let ExaminationPackageTypeMapping = models.medical.ExaminationPackageTypeMapping;
  let ExaminationItem = models.medical.ExaminationItem;
  let ExaminationPackageItemMapping = models.medical.ExaminationPackageItemMapping;
  let Center = models.medical.Center;
  let Card = models.medical.Card;
  let Product = models.catalog.Product;

  // 复制基类上的方法
  Base.copy(ExaminationPackage);
  if(!ExaminationPackage.associations.ExaminationPackageTypes)
  {
    ExaminationPackage.belongsToMany(ExaminationPackageType, {through: ExaminationPackageTypeMapping, foreignKey:'examinationPackageId', otherKey:'examinationPackageTypeId', as:'ExaminationPackageTypes'});
  }
  if(!ExaminationPackage.associations.ExaminationPackageItems)
  {
    ExaminationPackage.belongsToMany(ExaminationItem, {through: ExaminationPackageItemMapping, foreignKey:'examinationPackageId', otherKey:'examinationItemId', as:'ExaminationPackageItems'});
  }
  if(!ExaminationPackage.associations.MedicalCenter) {
    ExaminationPackage.belongsTo(Center, {foreignKey:'manufacturerMedicalCenterId', targetKey:'manufacturerId'});
  }
  if(!ExaminationPackage.associations.MedicalCard) {
    ExaminationPackage.hasMany(Card, {foreignKey:'examinationPackageId'});
  }
  if(!ExaminationPackage.associations.Product) {
    ExaminationPackage.belongsTo(Product, {foreignKey:'productId'});
  }
  
  /**
  * 格式化返回数据
  * @params {Array} [attributes] 需要返回的字段，不传则返回全部
  */ 
  ExaminationPackage.prototype.format = function (attributes) {
    let data = null
    if(Array.isArray(attributes)&&attributes.length>0) {
      let self = this;
      data = {};
      attributes.map((key) => {
        if(key==='ExaminationPackageTypes') {
          data[key]=this.ExaminationPackageTypes.map((Type) => {
            return Type.format();
          })
        } else {
          data[key]=this[key]
        }
      });
    } else {
      data = JSON.parse(JSON.stringify(this.dataValues))

      if(this.ExaminationPackageTypes) {
        data.ExaminationPackageTypes = this.ExaminationPackageTypes.map((Type) => {
          return Type.format();
        })
      }
    }

    return data;
  };

  return ExaminationPackage;
};
