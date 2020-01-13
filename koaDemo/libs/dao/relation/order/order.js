'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Order = models.order.Order;
  let Item = models.order.Item;
  let History = models.order.History;
  let Shipping = models.order.Shipping;
  let TransactionHistory = models.order.TransactionHistory;
  let Account = models.user.Account;
  
  if(!Order.associations.Items)
  {
    Order.hasMany(Item, {foreignKey:'orderId'});
  }
  if(!Order.associations.Histories)
  {
    Order.hasMany(History, {foreignKey:'orderId'});
  }
  if(!Order.associations.Shipping)
  {
    Order.hasOne(Shipping, {foreignKey:'orderId'});
  }
  if(!Order.associations.TransactionHistories)
  {
    Order.hasMany(TransactionHistory, {foreignKey:'orderId'});
  }
  if(!Order.associations.Account)
  {
    Order.belongsTo(Account, {foreignKey:'accountId'});
  }
  

	// 复制基类上的方法
	Base.copy(Order);

  Order.prototype.format=function(attributes){
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
	return Order;
};
