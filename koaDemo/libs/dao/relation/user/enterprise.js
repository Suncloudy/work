'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Enterprise = models.user.Enterprise;
	let Account = models.user.Account;
	let File=models.common.File;
	
	// 复制基类上的方法
	Base.copy(Enterprise);

	if(!Enterprise.associations.File)
	{
		Enterprise.belongsTo(File, {foreignKey:'logoFileId', targetKey:'id'});	
	}
	if(!Enterprise.associations.LicenseFile){
		Enterprise.belongsTo(File, {foreignKey:'licenseFileId', targetKey:'id', as:'LicenseFile'});
	}
	if(!Enterprise.associations.Account) {
		Enterprise.belongsTo(Account, {foreignKey:'accountId'});
	}

	/**
	* 格式化返回数据
	* @params {Array} [attributes] 需要返回的字段，不传则返回全部
	*/ 
	Enterprise.prototype.format = function (attributes) {
		let data = null
		if(Array.isArray(attributes)&&attributes.length>0) {
			let self = this;
			data = {};
			attributes.map((key) => {data[key]=this[key]});
		} else {
			data = JSON.parse(JSON.stringify(this.dataValues))
		}
		if(this.File) {
			data.logoUrl = this.File.url;
		}
		if(this.LicenseFile) {
			data.licenseUrl = this.LicenseFile.url;
		}

		return data;
	};

	return Enterprise;
};
