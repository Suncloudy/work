'use strict'
/**
 * 交易记录的控制器
 */
const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');

//创建交易记录
module.exports.transactionHistoryAdd=async (ctx,next)=>{
    ctx.checkBody('orderNumber').notEmpty("订单编号不能为空");
    ctx.checkBody('paymentStatus').notEmpty("支付状态不能为空");
    ctx.checkBody('paymentMethod').notEmpty("支付方式不能为空");
    ctx.checkBody('result').notEmpty("支付接口返回结果（JSON）不能为空");
    ctx.checkBody('raw').notEmpty("支付接口原始数据不能为空");
    ctx.checkBody('tradeNo').notEmpty("交易单号不能为空");
    ctx.checkBody('category').notEmpty("交易类型不能为空");
    let transactionHistory = ctx.dao.main.order.TransactionHistory;
    let body = ctx.request.body;
    await transactionHistory.create({
        orderNumber:body.orderNumber,
        paymentStatus:body.paymentStatus,
        paymentMethod:body.paymentMethod,
        result:body.result,
        raw:body.raw,
        tradeNo:body.tradeNo,
        note:body.note||'',
        createdAt:new Date(),
        category:body.category
    }).then(()=>{
        ctx.body={code:Code.OK.code,msg:Code.OK.msg}
    }).catch(error=>{
        ctx.body={code:Code.InternalServerError.code,msg:Code.InternalServerError.msg,data:error}
    });
}

//获取交易历史记录
module.exports.transactionHistoryList=async (ctx,next)=>{
    ctx.checkBody('orderNumber').notEmpty("订单编号不能为空");
    ctx.checkBody('paymentStatus').notEmpty("支付状态不能为空");
    ctx.checkBody('paymentMethod').notEmpty("支付方式不能为空");
    ctx.checkBody('result').notEmpty("支付接口返回结果（JSON）");
    ctx.checkBody('raw').notEmpty("支付接口原始数据");
    ctx.checkBody('tradeNo').notEmpty("交易单号");
    let transactionHistory = ctx.dao.main.order.TransactionHistory;
    let Op = ctx.main.Op;
    let option={
        options:{include:[
            {
                model:ctx.dao.main.order.Order,
                required:true,
                include:[
                    {
                        model:ctx.dao.main.order.Items,
                        required:true,
                        attributes:['name']
                    },{
                        model:ctx.dao.main.user.Account,
                        required:true,
                        attributes:['balance']
                    }
                ]
            }
        ]},
        page:ctx.request.query.page||1,
        perPage: ctx.request.query.perPage||20,
        where:{},
        order: [ ['id', 'asc'] ],
    };
    if(ctx.request.query.category){
        option.where.category=ctx.request.query.category;
    }
    if(ctx.request.query.timeRange && ctx.request.query.timeRange.lenght==2){
        option.where.timeRange={
            [Op.and]: {
                [Op.gte]: ctx.request.query.timeRange[0],
                [Op.lte]: ctx.request.query.timeRange[1],    
            } 
        };
    }
    let paginate=await transactionHistory.paginate(option);
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:paginate};
}


//获取交易历史记录
module.exports.transactionHistoryLists=async (ctx,next)=>{ 
    ctx.checkQuery('enterpriseId').notEmpty("企业账号不能为空");
    let Op = ctx.main.Op;
    let option={
        options:{include:[
            {
                model:ctx.dao.main.order.Order,
                required:true,
                include:[
                    {
                        model:ctx.dao.main.order.Item,
                        required:true,
                        attributes:['name']
                    },
                    {
                        model:ctx.dao.main.user.Account,
                        required:true,
                        attributes:['balance']
                    }
                ],
                where:{
                    accountId:ctx.request.query.enterpriseId||ctx.state._user.id,
                }
            }
        ]},
        where:{},
        page:parseInt(ctx.request.query.page)||1,
        perPage: ctx.request.query.perPage||10
    };
    if(ctx.request.query.start && ctx.request.query.end){
        option.where.createdAt={
            [Op.and]: {
                [Op.gte]: ctx.request.query.start,
                [Op.lte]: ctx.request.query.end,    
            } 
        };
    }
    if(ctx.request.query.type){
        option.where.type=ctx.request.query.type;
    }
    let paginate=await ctx.dao.main.user.AccountTransaction.paginate(option);
    let total;
    await ctx.dao.main.user.AccountTransaction
        .count({ where: {'accountId':ctx.request.query.enterpriseId||ctx.state._user.id }}).then(res=>{
            total=res;
    });
    paginate.total=total;
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:paginate};
}