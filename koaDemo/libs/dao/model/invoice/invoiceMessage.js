/**
 * 已开发票信息表 
 * 与订单表是一对多 一开具发票可对应多订单
 */
'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('InvoiceMessage', {
    id: { type:DataTypes.BIGINT(20), autoIncrement:true, primaryKey : true, unique : true},
    accountId: { type: DataTypes.BIGINT(20), field: 'account_id', comment:'所属账户 企业或者个人' },
    invoiceMaterial:{type: DataTypes.INTEGER(4), field: 'invoice_material',comment:'发票性值材质 0是电子 1是纸质'},
    invoiceSn:{type: DataTypes.STRING, field: 'invoice_sn',comment:'发票号'},
    invoiceAddressId: { type: DataTypes.INTEGER(4), field: 'invoice_address_id',comment:'发票邮寄地址id'},
    invoiceNumber:{ type: DataTypes.STRING, field: 'invoice_number',allowNull: true, comment:'发票号'},
    returnShippingMethod: { type: DataTypes.STRING, field: 'return_shipping_method', comment:'回运物流方式' },
    returnShippingNumber: { type: DataTypes.STRING, field: 'return_shipping_number', comment:'回运快递单号' },
    invoiceFile:{ type: DataTypes.BIGINT, field: 'invoice_file',allowNull: true, comment:'发票文件'},
    invoiceMoney:{type: DataTypes.DECIMAL(10, 2), field: 'invoice_money',comment:'开票金额'},
    orderNumber: { type: DataTypes.INTEGER(4), field: 'order_number',allowNull: false, defaultValue: 1, comment:'开票订单数量'},
    invoiceDate:{ type: DataTypes.DATE, field: 'invoice_date', allowNull: false,  comment:'开票申请时间' },
    status:{ type: DataTypes.INTEGER(2), field: 'status', allowNull: false,  defaultValue:0, comment:'开票状态 0开票中 1已开票 ' },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at', allowNull: true, comment:'删除时间'},
  },
  {
    timestamps: false,
    underscore: false,
    freezeTableName: true,
    paranoid: true,
    schema: 'invoice',
    tableName: 'Message',
    comment: '已开发票信息表',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
}
