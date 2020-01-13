'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');


//企业发票信息基本设置接口
module.exports.invoiceBasicEntSetting=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('invoiceHead').notEmpty("发票抬头不能为空");
    ctx.checkBody('invoiceType').notEmpty("发票类型不能为空");
    ctx.checkBody('accountType').notEmpty("开票类型不能为空");
    ctx.checkBody('taxpayerId').notEmpty("纳税人识别码不能为空");
    //产品id 产品类型
    let body = ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(body.invoiceType==1){
        ctx.checkBody('bankAccount').notEmpty("开户银行账户不能为空");
        ctx.checkBody('bankName').notEmpty("开会银行名称不能为空");
        ctx.checkBody('address').notEmpty("企业注册地址不能为空");
        ctx.checkBody('phoneNumber').notEmpty("有效联系电话不能为空");
    }
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    
    let invoiceProfileDa=ctx.dao.main.invoice.InvoiceProfile;
    
    //先判断是否有该企业发票基础信息
    let resultInvoiceProfile=await invoiceProfileDa.findOne({where:{accountId:params.enterpriseId}})
    if(resultInvoiceProfile){
        await invoiceProfileDa.update({
            invoiceHead:body.invoiceHead,
            invoiceType:body.invoiceType,
            accountType:body.accountType,
            taxpayerId:body.taxpayerId,
            bankAccount:body.bankAccount,
            bankName:body.bankName,
            address:body.address,
            phoneNumber:body.phoneNumber,
        },{where:{
            accountId:params.enterpriseId
        }})
        ctx.body={code:Code.OK.code,msg:'发票基础信息修改成功'};
        return;
    }
    else{
        await invoiceProfileDa.create({
            accountId:params.enterpriseId,
            invoiceHead:body.invoiceHead,
            invoiceType:body.invoiceType,
            accountType:body.accountType,
            taxpayerId:body.taxpayerId,
            bankAccount:body.bankAccount,
            bankName:body.bankName,
            address:body.address,
            phoneNumber:body.phoneNumber,
        })
        ctx.body={code:Code.OK.code,msg:'发票基础信息添加成功'};
        return;
    }
    
}

//开通发票基本信息获取
module.exports.invoiceBasicEnt=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let invoiceProfileRes=await ctx.dao.main.invoice.InvoiceProfile.
        findOne({  
            include:[{
                model:ctx.dao.main.user.Account,
                required:true,
                attributes:['username']
            }],
            where:{accountId:params.enterpriseId||ctx.state._user.id}
        });
    // let invoiceMessageRes = await ctx.dao.main.invoice.InvoiceMessage.findOne({
    //     include:[  { model:ctx.dao.main.invoice.invoiceAddress, required:true } ]
    // });
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:invoiceProfileRes};
}

//可开具发票订单列表（发票管理界面主页）
module.exports.orderListEntInvoice=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let query = ctx.request.query
    let page = query.page || 1
    let perPage = query.perPage || 20
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let include=[
        {
            model:ctx.dao.main.order.Item,
            required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            attributes:[ 'id','name']
        }
    ]
    let option={
        page: page||1,
        perPage: perPage||20,
        order: [ ['id', 'asc'] ],
        options:{ 
            include:include
        },
        where:{
            accountId:ctx.params.enterpriseId||ctx.state._user.id,
            invoiceId:{ '$eq': null }
        },
        attributes:[ 'id','orderNumber','createdAt','orderStatus','paymentAmount','total']    
    }
    let res=await ctx.dao.main.order.Order.paginate(option);

    let invoice=0;
    for(let item of res.items){
        invoice+=item.total;
    }
    let invoiceProFileRes = await ctx.dao.main.invoice.InvoiceProfile.findOne({
        where:{accountId:ctx.state._user.id}
    });
    ctx.body= { code:Code.OK.code,msg:Code.OK.msg,data:{data:res,invoice:invoice,invoiceProFileRes:invoiceProFileRes} };
}


//申请发票
module.exports.invoiceAdd=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('invoiceMaterial').notEmpty("发票性值材质不能为空");
    ctx.checkBody('invoiceAddressId').notEmpty("发票邮寄地址id不能为空");
    ctx.checkBody('invoiceMoney').notEmpty("开票金额不能为空");
    //还有批量的订单id  订单id数量也决定开票订单数量 
    ctx.checkBody('orderIds').notEmpty("单数组不能为空");//['1','2','3']
    ctx.checkBody
    let params=ctx.params;
    let body=ctx.request.body;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    //发票信息表中添加数据 更新订单表对应的发票id
    let orderDa=ctx.dao.main.order.Order;
    let invoiceMessage=ctx.dao.main.invoice.InvoiceMessage;
    
    let resultInvoiceMessage=await invoiceMessage.create({
        invoiceMaterial:body.invoiceMaterial,
        invoiceAddressId:body.invoiceAddressId,
        invoiceMoney:body.invoiceMoney,
        orderNumber:body.orderIds.length,
        invoiceDate:new Date(),
        accountId:params.enterpriseId
    })
    if(resultInvoiceMessage){
        body.orderIds.forEach(async item=>{
            await orderDa.update({
                invoiceId:resultInvoiceMessage.id
            },{where:{ id:item }})
        })
        ctx.body= {
            code:Code.OK.code,msg:'开票成功'
        };
    }
    else{
        ctx.body= {
            code:Code.BadRequest.code,msg:'开票失败'
        };
    }
    
}

//发票列表
module.exports.invoiceList=async (ctx,next)=>{
    ctx.checkParams('accountId').notEmpty("用户id不能为空");
    let query = ctx.request.query
    let params=ctx.params;
    let page = query.page || 1
    let perPage = query.perPage || 20
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let invoiceMessageDa=ctx.dao.main.invoice.InvoiceMessage;
    let invoiceProfileDa=ctx.dao.main.invoice.InvoiceProfile;
    let include=[
        {
        //belongsTo 外键在源文件上 hasOne外键存在于目标文件上
        association:invoiceMessageDa.belongsTo(invoiceProfileDa, {foreignKey: 'accountId',
        targetKey: 'accountId'}),
        required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
        attributes:[ 'invoiceHead'],
        },
    ]
    let option={
        page: page,
        perPage: perPage,
        where:{
            deletedAt: {
                 '$eq': null              // deletedAt IS NULL
            },
        accountId:params.accountId
        },
        order: [
            ['id', 'asc']
        ],
        options:{ 
            include:include
        },
        attributes:[
            'id',
            'invoiceMaterial',
            'invoiceAddressId',
            'invoiceMoney',
            'invoiceDate',
            'status',
        ]    
    }
    let paginate=await invoiceMessageDa.paginate(option)
    let items = [];
    if (paginate.items && paginate.items.length > 0) {
        paginate.items.forEach(function (item) {
            console.log('发票item',JSON.stringify(item));
            items.push({
                invoiceId:item.id,
                invoiceMaterial:item.invoiceMaterial,
                invoiceAddressId: item.invoiceAddressId,
                invoiceMoney: item.invoiceMoney,
                invoiceDate:item.invoiceDate,
                status:item.status,
                invoiceHead:item.InvoiceProfile.invoiceHead,
            })
        });
    }
    ctx.body= {
        code:Code.OK.code,msg:'成功',data:{
            items:items
        }
    };
    return;
}

//发票详情
module.exports.invoiceDetail=async (ctx,next)=>{
    ctx.checkParams('invoiceId').notEmpty("发票id不能为空");
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }

    //根据发票id获取发票信息，拿到accountId 获取发票基本信息  
    let resultInvoiceDetail=await ctx.dao.main.invoice.InvoiceMessage.findOne({
        where:{ id:params.invoiceId } 
    });

    if(!resultInvoiceDetail){
        ctx.body= { code:Code.BadRequest.code,msg:'该发票不存在' };
        return;
    }


    //根据发票id获取发票对应的订单
    let InvoiceProfile=await ctx.dao.main.invoice.InvoiceProfile.findOne({
        where:{ accountId:ctx.state._user.id }
    });


    //订单
    let paginate=await ctx.dao.main.order.Order.paginate({
        page: 1,
        perPage:100,
        options:{  include:[
            {
                model:ctx.dao.main.order.Item,
                required:true,
                attributes:['name']
            }
        ]},
        where:{ invoiceId:params.invoiceId }
    });
    ctx.body= { code:Code.OK.code,msg:Code.OK.msg,data:{ resultInvoiceDetail ,InvoiceProfile, paginate} };
}

//发票取消
module.exports.delete=async(ctx,next)=>{
    await ctx.dao.main.invoice.InvoiceMessage.destroy({where:{id:ctx.params.invoiceId}});
    ctx.body={code:Code.OK.code,msg:Code.OK.msg};
}

//获取发票实例
module.exports.get=async(ctx,next)=>{
    ctx.checkParams('invoiceId').notEmpty("发票id不能为空");
    let res = await ctx.dao.main.invoice.InvoiceMessage.findOne({
        where:{id:ctx.params.invoiceId}
    });
    if (res){
        ctx.state._invoice = res;
        await next();
    }else{
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg}
    }
}