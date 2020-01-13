'use strict'

const Base = require('../base');

module.exports = function (models) {
  let TransactionHistory = models.order.TransactionHistory;
  let Order = models.order.Order; 


  if(!TransactionHistory.associations.Order){
    TransactionHistory.belongsTo(Order,{foreignKey:'orderId'});
  }
  
  // 复制基类上的方法
  Base.copy(TransactionHistory);

  TransactionHistory.prototype.format=function(attributes){
    let data=null;
    if(Array.isArray(attributes)&&attributes.length>0){
      let self=this;
      data={};
      attributes.map((item)=>{data[item]=this[item]});
    }else{
      data = this;
    }
    return data;
  }
  return TransactionHistory;
};
