'use strict'
/***
 * =========================
 * create 2018/11/26 xiaogangzai
 * 版权所有 请勿抄袭！！！
 * =========================
 */


 //数据库 快速创建表
const devConfig = require('../config/development');
const testConfig = require(`../config/test`);
global.config = process.env.NODE_ENV == "development" ? devConfig : testConfig;
const sequelize = require("./mysql")(config.get('mysql').database, config.get('mysql').username, config.get('mysql').password, {
	host: config.get('mysql').host,
	port: config.get('mysql').port
})

/*const glob = require('glob')
let path = __dirname;
path = path.replace('update', '')
glob.sync(path + 'lib/db/model/*.js').forEach(file_ => {
    file_ = file_.replace(path, '')
    let Model = require(file_)
   // let Model = require('../' + file_)
    Model.model.sync().then(() => {
        console.log('创建成功')
    })
})*/
/**
 * 公共
 */
sequelize.import('../lib/dao/model/common/file');

/**
 * 用户
 */
sequelize.import('../lib/dao/model/user/account'),
sequelize.import('../lib/dao/model/user/address'),
sequelize.import('../lib/dao/model/user/entApply'),
sequelize.import('../lib/dao/model/user/entDepartment'),
sequelize.import('../lib/dao/model/user/entEmployee'),
sequelize.import('../lib/dao/model/user/enterprise'),
sequelize.import('../lib/dao/model/user/personal'),

/**
 * 企业体检计划
 */
sequelize.import('../lib/dao/model/enterprise/cycleRemind'),
sequelize.import('../lib/dao/model/enterprise/phyEmployeePlan'),
sequelize.import('../lib/dao/model/enterprise/phyExamiantionPlan'),
sequelize.import('../lib/dao/model/enterprise/setMeal'),

/**
 * 订单
 */
sequelize.import('../lib/dao/model/order/order'),
sequelize.import('../lib/dao/model/order/orderHistory'),
sequelize.import('../lib/dao/model/order/orderProduct'),
sequelize.import('../lib/dao/model/order/transactionHistory'),

/**
 * 发票
 */
sequelize.import('../lib/dao/model/invoice/invoiceAddress'),
sequelize.import('../lib/dao/model/invoice/invoiceMessage'),
sequelize.import('../lib/dao/model/invoice/invoiceProfile'),

/**
 * 商品相关
 */
sequelize.import('../lib/dao/model/invoice/invoiceAddress'),
sequelize.import('../lib/dao/model/invoice/invoiceMessage'),
sequelize.import('../lib/dao/model/invoice/invoiceProfile'),

sequelize.sync().then(function (result) {
    console.log('success');
    process.exit();
}).catch(function (err) {
    console.log('error:', err);
    process.exit();
});
   