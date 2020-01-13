/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 08:35:01
 * @LastEditTime: 2019-08-14 11:34:42
 * @LastEditors: Please set LastEditors
 */
'use strict'

const Base = require('../base');

module.exports = function (models) {
  let Item = models.order.Item;
  let File = models.common.File;
  let Product = models.catalog.Product;
  let Manufacturer = models.catalog.Manufacturer;
  if(!Item.associations.File)
  {
    Item.belongsTo(File, {foreignKey:'imageFileId'});
  }
  if(!Item.associations.Product)
  {
    Item.belongsTo(Product, {foreignKey:'productId'});
  }
  if(!Item.associations.Manufacturer)
  {
    Item.belongsTo(Manufacturer, {foreignKey:'manufacturerId'});
  }

  // 复制基类上的方法
  Base.copy(Item);

  Item.prototype.format=function(attributes){
    let data=null;
    if(Array.isArray(attributes)&&attributes.length>0){
      let self=this;
      data={};
      attributes.map((item)=>{data[item]=this[item]});
    }else{
      data = this;
    }
    if(this.File) {
      data.imageUrl = this.File.url;
      data.File = this.File;
    }
    if(this.Product) {
      data.Product = this.Product.format();
    }
    

    return data;
  }

  return Item;
};
