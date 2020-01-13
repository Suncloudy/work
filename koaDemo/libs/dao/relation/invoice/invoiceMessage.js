'use strict'

const Base = require('../base');

module.exports = function (models) {
	let InvoiceMessage = models.invoice.InvoiceMessage;
	let InvoiceAddress = models.invoice.InvoiceAddress;
	let Account = models.user.Account;
	let File = models.common.File;
	if(!InvoiceMessage.associations.InvoiceAddress){
		InvoiceMessage.belongsTo(InvoiceAddress, {foreignKey: 'invoiceAddressId'});
	}
	if(!InvoiceMessage.associations.Account){
		InvoiceMessage.belongsTo(Account, {foreignKey: 'accountId'});
	}

	if(!InvoiceMessage.associations.File)
  {
    InvoiceMessage.belongsTo(File, {foreignKey:'invoiceFile'});  
  }
	// 复制基类上的方法
	Base.copy(InvoiceMessage);

	return InvoiceMessage;
};
