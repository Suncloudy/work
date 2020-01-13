'use strict'

const Base = require('../base');
const {Discount} = require('../../../consts');

module.exports = function (models) {
	let Account = models.user.Account;
	let Enterprise = models.user.Enterprise;
	let Personal = models.user.Personal;
	let WxInfo = models.user.WxInfo;
	// let DiscountModel = models.discount.Discount;
	let CounponModel = models.discount.Coupon;
	// 复制基类上的方法
	Base.copy(Account);
	if(!Account.associations.Enterprise) {
		Account.hasOne(Enterprise, {foreignKey:'accountId'});
	}
	if(!Account.associations.Personal) {
		Account.hasOne(Personal, {foreignKey:'accountId'});
	}
	// if(!Account.associations.Discount) {
	// 	Account.belongsTo(DiscountModel, {foreignKey:'discountId', scopes:{discountType:Discount.type.enterprise}});
	// }
	if(!Account.associations.CounponModel) {
		Account.hasMany(CounponModel, {foreignKey:'accountId'});
	}
	if(!Account.associations.WxInfo) {
		Account.hasOne(WxInfo, {foreignKey:'accountId'});
	}
	Account.prototype.format = function (attributes, child={}) {
		let data = null
		if(Array.isArray(attributes)&&attributes.length>0) {
			let self = this;
			data = {id:this.id};
			attributes.map((key) => {data[key]=this[key]});
		} else {
			data = this;
			delete data.password;
			delete data.passwordSalt;
		}
		if(this.Enterprise) {
			data.Enterprise = this.Enterprise.format(child.enterpriseAttributes);
		}
		if(this.Personal) {
			data.Personal = this.Personal.format(child.personalAttributes);
		}

		return data;
	};

	
	return Account;
};
