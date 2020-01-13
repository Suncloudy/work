'use strict'

const Base = require('../base');

module.exports = function (models) {
  let Coupon = models.discount.Coupon;
  let Discount = models.discount.Discount;
  let DiscountUsageHistory = models.discount.UsageHistory;
  let Order = models.order.Order;
  
  if(!DiscountUsageHistory.associations.Discount)
  {
    DiscountUsageHistory.belongsTo(Discount, {foreignKey:'discountId'});
  }
  if(!DiscountUsageHistory.associations.Coupon)
  {
    DiscountUsageHistory.belongsTo(Coupon, {foreignKey:'couponId'});
  }
  if(!DiscountUsageHistory.associations.Order)
  {
    DiscountUsageHistory.belongsTo(Order, {foreignKey:'orderId'});
  }
  
  // 复制基类上的方法
  Base.copy(DiscountUsageHistory);

  DiscountUsageHistory.prototype.format=function(attributes){
    let data=null;
    if(Array.isArray(attributes)&&attributes.length>0){
      data = {};
      attributes.map((item) => {data[item]=this[item]});
    }else{
      data = this ;
    }
    return data;
  }
  return DiscountUsageHistory;
};
