'use strict'

const Base = require('../base');

module.exports = function (models) {
	let InvoiceProfile = models.invoice.InvoiceProfile;
	let Account = models.user.Account;

	if(!InvoiceProfile.associations.Account){
		InvoiceProfile.belongsTo(Account, {foreignKey: 'accountId'});
	}
	// 复制基类上的方法
	Base.copy(InvoiceProfile);

	return InvoiceProfile;
};
