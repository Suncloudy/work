'use strict'

const {Code} = require('../../../../libs/consts');
const {tool} = require('../../../../libs/utils');
/**
 * 钱包的余额和账户状态
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.purseInfo=async (ctx,next)=>{
    let account = ctx.dao.main.user.Account;
    let accountInfo = await account.findOne({where:{id:ctx.params.id}});
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:{active:accountInfo.active,
    balance:accountInfo.balance?accountInfo.balance:0}}; 
}

/**
 * 账目日志列表
 * 
 * 1.订单表下查看有哪些订单
 * 2.关联到历史记录表  筛选出 交易已经完成的记录  20或者40
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.transactionHistory=async(ctx,next)=>{ 
    let query = ctx.request.query,Op=ctx.main.Op;
    let page = query.page || 1, perPage = query.perPage || 20;
    let transactionHistorys =await  ctx.dao.main.order.TransactionHistory.paginate({
        page: page,
        perPage: perPage,
        options:{
            include:[
                {
                    model:ctx.dao.main.order.Order, 
                    required:true,
                    where:{accountId:ctx.params.id},
                    attributes:['id','paymentAmount','refundedAmount'] 
                }
            ],
        },
        where:{
            success:{
                [Op.eq]:true,
            },
            paymentStatus:{
                [Op.or]: [20,40],
            },
        },
        order: [ ['createdAt', 'desc'] ],
        attributes:['paymentStatus','note','createdAt']
    }); 
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:transactionHistorys}; 
}
