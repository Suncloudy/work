'use strict'

const Base = require('../base');

module.exports = function (models) {
  let Model = models.medical.Center;
  let Manufacturer = models.catalog.Manufacturer;
  let File = models.common.File;
  let Organization = models.medical.Organization;
  // 复制基类上的方法
  Base.copy(Model);
  if(!Model.associations.CatalogManufacturer)
  {
    Model.belongsTo(Manufacturer, {foreignKey:'manufacturerId'});  
  }
  if(!Model.associations.LocationFile)
  {
    Model.belongsTo(File, {foreignKey:'locationFileId', as:'LocationFile'});  
  }
  if(!Model.associations.MedicalOrganization)
  {
    Model.belongsTo(Organization, {foreignKey:'organizationId'});  
  }
  /**
  * 格式化返回数据
  * @params {Array} [attributes] 需要返回的字段，不传则返回全部
  * @params {Array} [manufacturerAttributes] 需要所属厂商返回的字段，不传则返回全部
  * @params {Array} [organizationAttributes] 
  */ 
  Model.prototype.format = function (attributes, manufacturerAttributes, organizationAttributes) {
    let data={};
    if(Array.isArray(attributes)) {
      attributes.map((key) => {data[key]=this[key]});
    } else {
      data = this;
    }
    if(this.CatalogManufacturer){
      if(Array.isArray(manufacturerAttributes)) {
        data.CatalogManufacturer = this.CatalogManufacturer.format(manufacturerAttributes)
      } else {
        data.CatalogManufacturer = this.CatalogManufacturer.format()
      }
    }
    if(this.MedicalOrganization) {
      if(Array.isArray(organizationAttributes)) {
        data.MedicalOrganization = this.MedicalOrganization.format(organizationAttributes)
      } else {
        data.MedicalOrganization = this.MedicalOrganization.format()
      }
    }
    if(this.LocationFile) {
      data.locationUrl = this.LocationFile.url;
    }
    return data;
  };
  return Model;
};
