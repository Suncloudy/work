/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 08:12:02
 * @LastEditTime: 2019-08-14 13:31:01
 * @LastEditors: Please set LastEditors
 */
'use strict'

const {Code,receiverInfo} = require('../../../libs/consts'); 

//获取个人订单
module.exports.orders=async (ctx,next)=>{
    let orderDa=ctx.dao.main.order.Order; 
    let option={
        page:ctx.request.query.page||1,
        perPage:ctx.request.perPage||20,
        options:{
            include:[
                {
                    model:ctx.dao.main.order.Item,
                    required:true, 
                    include:[
                        {
                            model:ctx.dao.main.common.File, 
                            attributes:['url']
                        }, {
                            model:ctx.dao.main.catalog.Manufacturer, 
                            attributes:['name']
                        },
                    ],
                    attributes:['id','name','productType','quantity','salePrice','price','total','imageFileId','discountAmount','productId'],
                }
            ]
        },
        where:{
            accountId:ctx.params.id
        },
        order:[
            ['updatedAt','desc']
        ]
    };
    if(ctx.request.query.status=="COMPLETE"){
        option.where.paymentStatus=30;
    }else if(ctx.request.query.status=="UNPAID"){
        option.where.paymentStatus=10;
    }else if(ctx.request.query.status=="PAID"){
        option.where.paymentStatus=20;
    }else if(ctx.request.query.status=="REFUNDED"){
        option.where.paymentStatus=40;
    }else if(ctx.request.query.status=="CANCELLED"){
        option.where.paymentStatus=50;
    }

    if(ctx.request.query.orderStatus){
        option.where.orderStatus=ctx.request.query.orderStatus;
    }
    let result = await orderDa.paginate(option);
    //由于主子表关联查询  总记录数有出入 
    let countOption = {
        where:{  accountId:ctx.params.id }
    };
    //支付状态
    if(ctx.request.query.status){
        countOption.where.paymentStatus= option.where.paymentStatus;
    }
    //订单状态
    if(ctx.request.query.orderStatus){
        countOption.where.orderStatus=ctx.request.query.orderStatus;
    }
    result.total=await orderDa.count(countOption); 
    result.receiverInfo=receiverInfo;
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:result};
}

//取消订单
module.exports.deleteOrder=async(ctx,next)=>{
    let orderDa=ctx.dao.main.order.Order; 
    await orderDa.update({
        orderStatus:40 
    },{where:{
        id:ctx.params.id
    }});
    ctx.body= {code:Code.OK.code,msg:Code.OK.msg};
}


//获取企业订单
module.exports.ordersOfEnt=async (ctx,next)=>{
    let Op = ctx.main.Op;
    let orderDa=ctx.dao.main.order.Order; 
    let option={
        page:ctx.request.query.page||1,
        perPage:ctx.request.perPage||20,
        options:{include:[
            {
                model:ctx.dao.main.order.Item,
                required:true, 
                include:[
                    {
                        model:ctx.dao.main.common.File, 
                        attributes:['url']
                    }, {
                        model:ctx.dao.main.catalog.Manufacturer, 
                        attributes:['name']
                    },
                ],
                attributes:['id','name','productType','quantity','salePrice','price','total','imageFileId','discountAmount','productId'],
            }
        ]},
        where:{
            accountId:ctx.params.id
        },
        order:[
            ['updatedAt','desc']
        ]
    };
    if(ctx.request.query.status=="COMPLETE"){
        option.where.paymentStatus=30;
    }else if(ctx.request.query.status=="UNPAID"){
        option.where.paymentStatus=10;
    }else if(ctx.request.query.status=="PAID"){
        option.where.paymentStatus=20;
    }else if(ctx.request.query.status=="REFUNDED"){
        option.where.paymentStatus=40;
    }else if(ctx.request.query.status=="CANCELLED"){
        option.where.paymentStatus=50;
    }
    if(ctx.request.query.startDate && ctx.request.query.endDate){
        option.where.createdAt={
            [Op.and]: [
                {[Op.gte]: ctx.request.query.startDate}, 
                {[Op.lte]: ctx.request.query.endDate}
            ]
        };
    }
    let result = await orderDa.paginate(option);
    //由于主子表关联查询  总记录数有出入 
    let countOption = {
        where:{  accountId:ctx.params.id }
    };

    //支付状态
    if(ctx.request.query.status){
        countOption.where.paymentStatus= option.where.paymentStatus;
    }
    //订单状态
    if(ctx.request.query.orderStatus){
        countOption.where.orderStatus=ctx.request.query.orderStatus;
    }
    
    result.total=await orderDa.count(countOption); 
    result.receiverInfo=receiverInfo;
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:result};
}
//获取订单明细
module.exports.order=async (ctx,next)=>{ 
    ctx.checkParams('id').notEmpty("id不能为空");
    let order=await ctx.dao.main.order.Order.findOne({
        include:[
            {
                model:ctx.dao.main.order.Item,
                required:true, 
                include:[
                    {
                        model:ctx.dao.main.common.File, 
                        attributes:['url']
                    }, 
                ],
                attributes:['id','manufacturerId','name','productType','quantity','salePrice','price','total','imageFileId','discountAmount','productId'],
            },{
                model:ctx.dao.main.user.Account,
                required:true, 
                attributes:['id','username','phoneNumber']
            }
        ],
        where:{
            id:ctx.params.id
        }
    }); 
    
    ctx.body= {code:Code.OK.code,msg:Code.OK.msg,data:{
        order:order,
        shipping:ctx.state.shipping,
        transactionHistory:ctx.state.transactionHistory,
        transferReceipt:ctx.state.transferReceipt,
        history:ctx.state.history,
        receiverInfo:receiverInfo
    }};
}

//获取订单运费信息
module.exports.shipping=async(ctx,next)=>{
    ctx.checkQuery('id').notEmpty("id不能为空");
    let shipping = await ctx.dao.main.order.Shipping.findOne({
        where:{
            orderId:ctx.params.id
        }
    });
    ctx.state.shipping=shipping;
    await next(); 
}

//获取支付记录
module.exports.transactionHistory=async(ctx,next)=>{
    ctx.checkQuery('id').notEmpty("id不能为空");
    let transactionHistory = await ctx.dao.main.order.TransactionHistory.findAll({
        where:{
            orderId:ctx.params.id
        },
        order:[['createdAt','desc']]
    });
    ctx.state.transactionHistory=transactionHistory; 
    await next();
}

//获取汇款记录
module.exports.transferReceipt=async(ctx,next)=>{
    ctx.checkQuery('id').notEmpty("id不能为空");
    let transferReceipt = await ctx.dao.main.order.TransferReceipt.findAll({
        where:{
            orderId:ctx.params.id
        },
        order:[['createdAt','desc']]
    });
    ctx.state.transferReceipt=transferReceipt; 
    await next();
}

//获取订单历史记录
module.exports.history=async(ctx,next)=>{
    ctx.checkQuery('id').notEmpty("id不能为空");
    let history = await ctx.dao.main.order.History.findAll({
        where:{
            orderId:ctx.params.id
        },
        order:[['createdAt','desc']]
    });
    ctx.state.history=history; 
    await next();
}