'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');

//筛选条件-套餐类别获取
module.exports.searchConditionSetMealType=async (ctx,next)=>{
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
    return;
    }
    let examinationPackageTypeDa=ctx.dao.main.medical.ExaminationPackageType;
    
    let option={
        where:{accountId:params.userId},
        order: [
            ['id', 'asc']
        ],
        attributes:['id','name']       
    };
    let result=await examinationPackageTypeDa.findAll(option);
    let items = [];
    if (result) {
        result.forEach(function (item) {
            items.push({
                id: item.id,
                name: item.name,
            })
        });
        ctx.body = {code: Code.OK.code, msg: '成功',data:{
           items: items
        }};
        return;
    }else{
        ctx.body = {code: Code.OK.code, msg: '成功',data:{
           items: items
        }};
        return;
    }
}

//筛选条件-检查项目获取
module.exports.searchConditionCheckItem=async (ctx,next)=>{
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
    return;
    }
    let examinationItemDa=ctx.dao.main.medical.examinationItem;
    
    let option={
        where:{accountId:params.userId},
        order: [
            ['id', 'asc']
        ],
        attributes:['id','name']       
    };
    let result=await examinationItemDa.findAll(option);
    let items = [];
    if (result) {
        result.forEach(function (item) {
            items.push({
                id: item.id,
                name: item.name,
            })
        });
        ctx.body = {code: Code.OK.code, msg: '成功',data:{
           items: items
        }};
        return;
    }else{
        ctx.body = {code: Code.OK.code, msg: '成功',data:{
           items: items
        }};
        return;
    }
}


//筛选条件-所有地区获取
module.exports.searchConditionAddress=async (ctx,next)=>{
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
    return;
    }
    let query = ctx.request.query
    let params=ctx.params;
   
    let suitAgeDa=ctx.dao.main.product.SuitAge;
    
    let option={
        where:{accountId:params.userId},
        order: [
            ['id', 'asc']
        ],
        attributes:['id','suitAge']       
    };
    let result=await suitAgeDa.findAll(option);
    let items = [];
    if (result) {
        result.forEach(function (item) {
            items.push({
                suitAgeId: item.id,
                suitAge: item.suitAge,
            })
        });
        ctx.body = {code: Code.OK.code, msg: '成功',data:{
           items: items
        }};
        return;
    }else{
        ctx.body = {code: Code.OK.code, msg: '成功',data:{
           items: items
        }};
        return;
    }
}