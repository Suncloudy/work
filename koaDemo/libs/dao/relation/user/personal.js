'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Personal = models.user.Personal;
	let File=models.common.File;
	let Account = models.user.Account;
	// 复制基类上的方法
	Base.copy(Personal);
	if(!Personal.associations.File){
		Personal.belongsTo(File, {foreignKey:'avatarFileId'})
	}
	if(!Personal.associations.Account){
		Personal.belongsTo(Account, {foreignKey:'accountId'})
	}
	let Coupon = models.discount.Coupon;
	if(!Personal.associations.Coupon) {
		Personal.hasMany(Coupon, {foreignKey:'accountId',targetKey:'accountId'});
	}
	/**
	* 格式化返回数据
	* @params {Array}  [attributes] 需要返回的字段，不传则返回全部
	*/ 
	Personal.prototype.format = function (attributes) {
		let data = null
		if(Array.isArray(attributes)&&attributes.length>0) {
			let self = this;
			data = {id:this.id};
			attributes.map((key) => {data[key]=this[key]});
		} else {
			data = JSON.parse(JSON.stringify(this.dataValues))
			delete data.password;
			delete data.passwordSalt;
		}
		if(this.File) {
			data.avatar = this.File.url;
		}

		return data;
	};
	return Personal;
};
