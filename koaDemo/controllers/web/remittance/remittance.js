'use strict'

const {Code} = require('../../../libs/consts');
const {remittance}=require('../../../libs/consts')
const {tool} = require('../../../libs/utils');

//添加汇款记录
module.exports.remittanceAdd=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('commitWay').notEmpty("提交方式不能为空");
    ctx.checkBody('contact').notEmpty("联系人不能为空");
    ctx.checkBody('phoneNumber').notEmpty("联系人手机号码不能为空");
    let body = ctx.request.body;
    let params=ctx.params;
    if(body.commitWay==remittance.commitWay.scanningFile.value){
        ctx.checkBody('image').notEmpty("汇款底单扫描件不能为空");
    }
    if(body.commitWay==remittance.commitWay.sheetMessage.value){
        ctx.checkBody('bankAccount').notEmpty("汇款账户不能为空");
        ctx.checkBody('money').notEmpty("汇款金额不能为空");
        ctx.checkBody('name').notEmpty("汇款人姓名不能为空");
    }
    //不需要判断参数 note 备注
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    
    let remittanceDa=ctx.dao.main.remittance.Remittance;
    await remittanceDa.create(
        {
            accountId:params.enterpriseId,
            commitWay:body.commitWay,
            contact: body.contact,
            phoneNumber:body.phoneNumber,
            image:body.image,
            bankAccount:body.bankAccount,
            name:body.name,
            money: body.money,
            note:body.note,
        }
    );
    ctx.body={code:Code.OK.code,msg:'成功'};
    return;
}

//获取汇款列表
module.exports.remittanceList=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let query = ctx.request.query
    let params=ctx.params;
    let page = query.page || 1
    let perPage = query.perPage || 10

    let remittanceDa=ctx.dao.main.remittance.Remittance;

    let option={
        page: page,
        perPage: perPage,
        where:{
            accountId:params.enterpriseId,
            deletedAt:{
                '$eq': null              // deletedAt IS NULL 
            }
        },
        order: [
            ['id', 'asc']
        ],
        /*raw: true, // 设置为 true，即可返回源数据
        distinct: true,*/
        attributes:['id','money','name','commitWay','image','bankAccount','phoneNumber','status','note','deletedAt','createdAt','contact']       
    };
    let paginate=await remittanceDa.paginate(option);
    let items = [];
    if (paginate.items && paginate.items.length > 0) {
        paginate.items.forEach(function (item) {
            items.push({
                remittanceId: item.id,
                commitWay: item.commitWay,
                contact: item.contact,
                phoneNumber:item.phoneNumber,
                image: item.image,
                bankAccount: item.bankAccount,
                name: item.name,
                money: item.money,
                note: item.note,
                status:item.status,
                createdAt:item.createdAt,
                contact:item.contact,//联系人
            })
        });
        ctx.body = {code: Code.OK.code, msg: '汇款列表获取成功',data:{
            page: paginate.page, pages: paginate.pages, total: paginate.total, items: items
        }};
        return;
    }else{
        ctx.body = {code: Code.OK.code, msg: '汇款列表获取成功',data:{
            page: paginate.page, pages: paginate.pages, total: paginate.total, items: items
        }};
        return;
    }
}
