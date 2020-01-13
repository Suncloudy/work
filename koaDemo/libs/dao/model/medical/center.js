/**
* 体检中心扩展表(与 manufacturer 关系：1:1, 与 medicalOrganization 1:n) 
* “体检中心”相当于一个体检门店
*/
'use strict'
const {Money} = require('../../../utils');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MedicalCenter', {
    manufacturerId: { type:DataTypes.BIGINT(20), field: 'manufacturer_id', primaryKey : true, unique : true, comment:'厂商Id'},
    organizationId: { type:DataTypes.BIGINT(20), field: 'organization_id', allowNull:false, defaultValue:0, comment:'所属体检组织'},
    type: { type: DataTypes.ENUM, allowNull: false, values:['center', 'publicHospital', 'privateHospital'], comment:'类型' },
    
    province: { type: DataTypes.STRING, comment:'省份' },
    city: { type: DataTypes.STRING, comment:'市' },
    county: { type: DataTypes.STRING, comment:'区县' },
    address: { type: DataTypes.STRING, comment:'详细地址' },

    businessHours: { type: DataTypes.STRING, allowNull:false, field: 'business_hours', comment:'营业时间说明' },
    note: { type: DataTypes.STRING, comment:'体检提示（如：空腹项目需上午检查）' },
    telephone: { type: DataTypes.STRING, allowNull:false, comment:'服务电话' },

    contact: { type: DataTypes.STRING, comment:'联系人' },
    phoneNumber: { type: DataTypes.STRING, field: 'phone_number', comment:'手机号码' },
    cooperated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, comment:'合作状态' },
    introduce: { type: DataTypes.TEXT, comment:'机构简介' },

    locationFileId: { type:DataTypes.BIGINT(20), field: 'location_file_id', comment:'位置图片文件'},
    latitude: { type: DataTypes.DOUBLE(10, 6), allowNull: false, comment: '纬度' },
    longitude: { type: DataTypes.DOUBLE(10, 6), allowNull: false, comment: '经度' },
    distance: {type: DataTypes.FLOAT, comment: '距离，为空，做计算和排序用'},

    packages: { type: DataTypes.INTEGER, allowNull:false, defaultValue:0, comment:'套餐数' }, 
    products: { type: DataTypes.INTEGER, allowNull:false, defaultValue:0, comment:'产品数' }, 
    productLowerPrice: { type: DataTypes.DECIMAL(10, 2), get: Money.get, set: Money.set, field: 'product_lower_price', allowNull: true, comment:'商品最低售价' },

    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW ,comment:'更新时间'},
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    schema: 'medical',
    tableName: 'center',
    comment: '体检中心表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
