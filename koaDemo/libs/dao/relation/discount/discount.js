'use strict'

const Base = require('../base');

module.exports = function (models) {
  let Discount = models.discount.Discount;
  let Coupon = models.discount.Coupon;
  let UsageHistory = models.discount.UsageHistory; 

  if(!Discount.associations.Coupon)
  {
    Discount.hasMany(Coupon, {foreignKey:'discountId'});
  }
  if(!Discount.associations.DiscountUsageHistory)
  {
    Discount.hasMany(UsageHistory, {foreignKey:'discountId'});
  }
  
  // 复制基类上的方法
  Base.copy(Discount);

  Discount.prototype.format=function(attributes){
    let data=null;
    if(Array.isArray(attributes)&&attributes.length>0){
      data = {};
      attributes.map((item) => {data[item]=this[item]});
    }else{
      data = this ;
    }
    return data;
  }
  return Discount;
};
