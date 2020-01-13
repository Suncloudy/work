'use strict'

const Base = require('../base');

module.exports = function (models) {
  let TransferReceipt = models.order.TransferReceipt;

  // 复制基类上的方法
  Base.copy(TransferReceipt);

  TransferReceipt.prototype.format=function(attributes){
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
  return TransferReceipt;
};
