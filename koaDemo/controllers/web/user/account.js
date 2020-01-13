/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 08:12:02
 * @LastEditTime: 2019-08-13 08:56:24
 * @LastEditors: Please set LastEditors
 */
'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');
/**
 * 获取基本用户账户基本信息
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.accountBasic=async (ctx,next)=>{
    ctx.checkParams('userId').notEmpty("用户id不能为空");
    //未定义字段也会接受到，问题
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let accountDa=ctx.dao.main.user.Account;
    let result=await accountDa.findById(params.userId);
    if(result){
        ctx.body={code:Code.OK.code,msg:'获取成功',data:{
            account:result.account,//账号
            balance:result.balance,//帐户余额
            income:result.income,//总收入
            payout:result.payout,//总支出
            active:result.active,//用户状态
            coin:result.coin//账户金币
        }};
        return;
    }
}
 
/**
 * 获取企业用户账户基本信息
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.accountBasicEnterprise=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业用户id不能为空");
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    //查询账户余额
    let accountDa=ctx.dao.main.user.Account;
    let orderDa=ctx.dao.main.order.Order;

    let accountBasic={};
    let resultAccountBasic=await accountDa.findById(params.enterpriseId);
    
    if(resultAccountBasic){
        accountBasic.account=resultAccountBasic.account,//账号
        accountBasic.balance=resultAccountBasic.balance,//帐户余额
        accountBasic.income=resultAccountBasic.income,//总收入
        accountBasic.payout=resultAccountBasic.payout,//总支出
        accountBasic.active=resultAccountBasic.active,//用户状态
        accountBasic.coin=resultAccountBasic.coin//账户金币
    }
    //待支付订单
    let orderBasic={};
    let resultOrder=await orderDa.count({where:{
        deletedAt: {
            '$eq': null              // deletedAt IS NULL
        },
        accountId:params.enterpriseId,
        paymentStatus:10,
    }})
    orderBasic.waitPayNumber=0;
    if(resultOrder){
        orderBasic.waitPayNumber=resultOrder
    }
    //可开具发票总钱数
    let invoiceBasic={};
    let resultInvoice=await orderDa.findAll({
        where:{
            accountId:params.enterpriseId,
            deletedAt: {
                '$eq': null              // deletedAt IS NULL
            },
            paymentStatus:30,
        }
    });
    if(resultInvoice){
        invoiceBasic.money=0;
        resultInvoice.forEach(async item=>{
            invoiceBasic.money=await invoiceBasic.money+item.orderTotal
        })
    }
    ctx.body={code:Code.OK.code,msg:'获取成功',data:{
        accountBasic,orderBasic,invoiceBasic
    }};
    return;
}

/**
 * 获取可用的 优惠券
 */
module.exports.getUserDiscount=async(ctx,next)=>{
    let user =ctx.state._user; 
    console.log('获取用户优惠券方法 用户信息：'+JSON.stringify(user));
    let account = await ctx.dao.main.user.Account.findOne({
        where:{
            id:user.id
        },
        attributes:['discountId']
    });
    console.log('获取优惠券'+account.discountId);
    let enterprise =null;
    if(!account.discountId){enterprise =null;}else{
        enterprise = await ctx.dao.main.discount.Discount.findOne({
            where:{ id:account.discountId }
        });
    }
    ctx.state._user.discount={
        enterprise:enterprise,
        coupon:[],
        shippingFee:null,
    }
    await next();
}