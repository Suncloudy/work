'use strict'

const Base = require('../base');

module.exports = function (models) {
	let ExaminationPackageTypeMapping = models.medical.ExaminationPackageTypeMapping;
	let ExaminationPackage = models.medical.ExaminationPackage;

	// 复制基类上的方法
	Base.copy(ExaminationPackage);
	if(!ExaminationPackageTypeMapping.associations.MedicalExaminationPackage)
  {
    ExaminationPackageTypeMapping.belongsTo(ExaminationPackage, {foreignKey:'examinationPackageId'});
  }

	// 复制基类上的方法
	Base.copy(ExaminationPackageTypeMapping);

	return ExaminationPackageTypeMapping;
};
