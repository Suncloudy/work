'use strict'

const Base = require('../base');

module.exports = function (models) {
	let Manufacturer = models.catalog.Manufacturer;
    let File=models.common.File;
	// 复制基类上的方法
	Base.copy(Manufacturer);
	
	if(!Manufacturer.associations.File){
		Manufacturer.belongsTo(File, {foreignKey: 'imageFileId',targetKey: 'id'});
	}
	Manufacturer.prototype.format=function(attributes){
		let data=null;
		if(Array.isArray(attributes)&&attributes.length>0){
			let self=this;
			data={};
			attributes.map((item)=>{data[item]=this[item]});
		}else{
			data=JSON.parse(JSON.stringify(this.dataValues));
		}
		if(this.File){
			data.imageUrl=this.File.url;
		}
		return data;
	}
	return Manufacturer;
};
