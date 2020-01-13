'use strict'

const Base = require('../base');

module.exports = function (models) {
	let ExaminationPackageItemMapping = models.medical.ExaminationPackageItemMapping;
	let ExaminationPackage = models.medical.ExaminationPackage;

	if(!ExaminationPackageItemMapping.associations.MedicalExaminationPackage)
  {
    ExaminationPackageItemMapping.belongsTo(ExaminationPackage, {foreignKey:'examinationPackageId'});
  }

	// 复制基类上的方法
	Base.copy(ExaminationPackageItemMapping);

	return ExaminationPackageItemMapping;
};
