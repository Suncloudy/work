'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Repair = models.service.Repair; 
	let RepairFile = models.service.RepairFile; 
	let Account = models.user.Account;
	let Item = models.order.Item;
	let Order = models.order.Order;
	let File = models.common.File;
	let Shipping = models.order.Shipping;
	let RepairProcessingHistory= models.service.RepairProcessingHistory;
	if(!Repair.associations.Order){
		Repair.belongsTo(Order, {foreignKey:'orderId'});
	}
	  
	if(!Repair.associations.Account){
		Repair.belongsTo(Account, {foreignKey:'accountId'});
	}

	if(!Repair.associations.Shipping){
		Repair.belongsTo(Shipping, {foreignKey:'shippingId'});
	}
	
	if(!Repair.associations.RepairFile){
		Repair.belongsToMany(File, {through: RepairFile, foreignKey:'repairId', 
		otherKey:'fileId' });
	}
	
	if(!Repair.associations.Item){
		Repair.belongsTo(Item,{ foreignKey:'itemId'});
	}
	// 复制基类上的方法
	Base.copy(Repair);

	return Repair;
};
