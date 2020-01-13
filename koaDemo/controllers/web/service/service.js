'use strict'

const {Code,applyReason} = require('../../../libs/consts'); 
const Decimal = require('decimal.js');
//查找订单项目
module.exports.item = (ctx,next)=>{
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:ctx.state._item}
}

//申请售后
module.exports.repair = async(ctx,next)=>{ 
    ctx.checkBody('quantity').notEmpty('提交数量不能为空');
    ctx.checkBody('reason').notEmpty('原因不能为空');
    ctx.checkBody('description').notEmpty('问题描述不能为空');
    ctx.checkBody('type').empty().in(['refund', 'repair']);
    ctx.checkBody('refundWays').empty().in(['original', 'balance']);
    ctx.checkBody('fileIds').notEmpty('相关图片不能为空');  
    ctx.checkBody('orderId').notEmpty('订单id不能为空');  
    ctx.checkBody('itemId').notEmpty('产品id不能为空'); 
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    //计算商品价格
    let refundedAmount=new Decimal(ctx.state._item.total).div(ctx.state._item.quantity).mul(ctx.request.body.quantity).toFixed(2);
    let result;
    await ctx.main.transaction( async  (t) => {
        let repair =await  ctx.dao.main.service.Repair.create({
            number:ctx.state.serviceNumber,
            accountId:ctx.state._user.id,
            orderId:ctx.state._item.orderId,
            itemId:ctx.request.body.itemId,
            type:ctx.request.body.type,
            refundWays:ctx.request.body.refundWays,
            reason:applyReason[ctx.request.body.reason],
            description:ctx.request.body.description,
            quantity:ctx.request.body.quantity, 
            refundedAmount:refundedAmount,
            returnShippingMethod:null,
            returnShippingNumber:null,
            returnShippingAddress:'神州四达',
            shippingId:ctx.state._item.shipping.id,
            refundAt:null,
            reviewedAt:null,
            
        },{transaction: t});
        let items = [],item = {};
        for(let id of ctx.request.body.fileIds){
            item = {};
            item.repairId=repair.id;
            item.fileId=id;
            items.push(item);
        }
        await ctx.dao.main.service.RepairFile.bulkCreate(items,{transaction: t});
        //插入历史纪录
        let repairProcessingHistory={
            repairId:repair.id, 
            description:'申请售后服务',
            lastStatus:'pending',
            status:'pending',
            createdAt:new Date()
        };
        await ctx.dao.main.service.RepairProcessingHistory.create(repairProcessingHistory,{transaction: t});
        return Promise.resolve(repair)
    }).then(repair=>{
        result = repair;
    });
    ctx.body = {code: Code.OK.code, msg: Code.OK.msg, data: result};

}

//获取申请的明细
module.exports.repairDetail=async(ctx,next)=>{ 
    ctx.checkQuery('id').notEmpty('id不能为空');
    console.log(JSON.stringify(ctx.state._user));
    let repair = await ctx.dao.main.service.Repair.findOne({
        include:[
            {
                model:ctx.dao.main.order.Order,
                required:true,
            },
            {
                model:ctx.dao.main.user.Account,
                required:true,
                attributes: ['id','username','phoneNumber']
            },
            {
                model:ctx.dao.main.order.Shipping,
                required:true,
            },
            {
                model:ctx.dao.main.common.File,
                through:ctx.dao.main.service.RepairFile, 
                required:true, 
            },
            {
                model:ctx.dao.main.order.Item,
                required:true, 
                include:[
                    {
                        model:ctx.dao.main.catalog.Product,
                        required:true
                    },
                    {
                        model:ctx.dao.main.common.File,
                        required:true,
                        attributes:['url']
                    }
                ]
            },
        ],
        where:{
            id:ctx.request.query.id,
            accountId:ctx.state._user.id
        }
    });
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:repair};
}

//获取 item 明细
module.exports.itemBean = async (ctx,next)=>{
    let id ;
    if(ctx.request.method!=='GET') {
        id = ctx.request.body.itemId;
    }else{
        id = ctx.request.query.itemId;
    }
    let item = await ctx.dao.main.order.Item.findOne({
        include:[
            {
                model:ctx.dao.main.catalog.Product, 
                required:true, 
            },{
                model:ctx.dao.main.common.File, 
                required:true, 
                attributes:['url']
            }
        ],
        where:{
            id:id
        }
    });
    if(item){
        ctx.state._item = item;
        await next();
    }else{
        return ;
    }
}

//用户地址
module.exports.shipping = async (ctx,next)=>{ 
    let shipping = await ctx.dao.main.order.Shipping.findOne({
        where:{
            orderId:ctx.state._item.orderId
        }
    });
    if(shipping){
        ctx.state._item.shipping = shipping;
        await next();
    }else{
        return ;
    }
}

/**
* 生成一个服务单号
* 服务单号规则：YYYYMMDD+三位随机整数+('00000'+流水).substr(-6)
*/
exports.getServiceNumber = async (ctx, next) => {
	let snKey = 'serviceSN';
	let serviceSN = await ctx.redis.get(snKey);
	if(!serviceSN) {
		serviceSN = 1;
		let expireAt = Math.floor((moment().endOf('day').valueOf()-Date.now())/1000);
		await ctx.redis.set(snKey, 1, 'EX', expireAt);
	} else {
		await ctx.redis.incr(snKey);
	}

	ctx.state.serviceNumber = moment().format('YYYYMMDD')+Math.floor(Math.random() * 1000)+('000'+serviceSN).substr(-6);
	await next();
}

//获取售后申请的记录
module.exports.repairProcessingHistorys=async (ctx,next)=>{
    let history = await ctx.dao.main.service.RepairProcessingHistory.findAll({
        where:{
            repairId:ctx.request.query.id
        }
    });
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:history}
}
