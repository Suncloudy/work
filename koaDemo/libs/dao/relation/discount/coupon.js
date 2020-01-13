'use strict'

const Base = require('../base');

module.exports = function (models) {
  let Coupon = models.discount.Coupon;
  let Discount = models.discount.Discount;
  let UsageHistory = models.discount.UsageHistory;
  
  if(!Coupon.associations.Discount)
  {
    Coupon.belongsTo(Discount, {foreignKey:'discountId'});
  }
  if(!Coupon.associations.DiscountUsageHistory)
  {
    Coupon.hasOne(UsageHistory, {foreignKey:'couponId'});
  }
  
  // 复制基类上的方法
  Base.copy(Coupon);

  Coupon.prototype.format=function(attributes){
    let data=null;
    if(Array.isArray(attributes)&&attributes.length>0){
      let self=this;
      data={};
      attributes.map((item)=>{data[item]=this[item]});
    }else{
      data=JSON.parse(JSON.stringify(this.dataValues));
    }
    return data;
  }
  return Coupon;
};
