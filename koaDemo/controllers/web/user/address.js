'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');



module.exports.addressAdd=async (ctx,next)=>{
    ctx.checkBody('receiver').notEmpty("收货地址不能为空");
    ctx.checkBody('phoneNumber').notEmpty("手机号码不能为空");
    ctx.checkBody('province').notEmpty("地址不能为空");
    ctx.checkBody('city').notEmpty("地址不能为空");
    ctx.checkBody('county').notEmpty("地址不能为空");
    //一个不需要判断参数 address 一个是否默认状态default
    ctx.checkBody('addressName').notEmpty("地址名称不能为空-如家,公司等");
    ctx.checkBody('default').notEmpty("地址状态不能为空");
    ctx.checkParams('userId').notEmpty("用户id不能为空");
    let body = ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let addressDa=ctx.dao.main.user.Address;
    await addressDa.create(
        {
            phoneNumber:body.phoneNumber,
            receiver:body.address,
            province: body.province,
            city:body.city,
            county:body.county,
            address:body.address,
            name:body.addressName,
            accountId: params.userId,
            default:body.default,
        }
    );
    ctx.body={code:Code.OK.code,msg:'成功'};
    return;
}

module.exports.addressList=async (ctx,next)=>{
    ctx.checkParams('userId').notEmpty("用户id不能为空");
    
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
    return;
    }
    let query = ctx.request.query
    let params=ctx.params;
    let page = query.page || 1
    let perPage = query.perPage || 20

    let addressDa=ctx.dao.main.user.Address;
    
    let option={
        page: page,
        perPage: perPage,
        where:{accountId:params.userId},
        order: [
            ['id', 'asc']
        ],
        /*raw: true, // 设置为 true，即可返回源数据
        distinct: true,*/
        attributes:['id','name','receiver','phoneNumber','province','city','county','address','default']       
    };
    let paginate=await addressDa.paginate(option);
    let items = [];
    if (paginate.items && paginate.items.length > 0) {
        paginate.items.forEach(function (item) {
            items.push({
                addressId: item.id,
                name: item.name,
                receiver: item.receiver,
                phoneNumber:item.phoneNumber,
                province: item.province,
                city: item.city,
                county: item.county,
                address: item.address,
                default: item.default,
            })
        });
        ctx.body = {code: Code.OK.code, msg: '成功',data:{
            page: paginate.page, pages: paginate.pages, total: paginate.total, items: items
        }};
        return;
    }else{
        ctx.body = {code: Code.OK.code, msg: '成功',data:{
            page: paginate.page, pages: paginate.pages, total: paginate.total, items: items
        }};
        return;
    }
}


module.exports.addressEdit=async (ctx,next)=>{
    ctx.checkBody('receiver').notEmpty("收货地址不能为空");
    ctx.checkBody('phoneNumber').notEmpty("手机号码不能为空");
    ctx.checkBody('province').notEmpty("地址不能为空");
    ctx.checkBody('city').notEmpty("地址不能为空");
    ctx.checkBody('county').notEmpty("地址不能为空");
    //一个不需要判断参数 address
    ctx.checkBody('addressName').notEmpty("地址名称不能为空");
    ctx.checkBody('default').notEmpty("地址状态不能为空");
    ctx.checkParams('addressId').notEmpty("地址id不能为空");
    let body = ctx.request.body
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let addressDa=ctx.dao.main.user.Address;
    await addressDa.update(
        {
            phoneNumber:body.phoneNumber,
            receiver:body.receiver,
            province: body.province,
            city:body.city,
            county:body.county,
            address:body.address,
            name:body.addressName,
            default:body.default,
        },
        {
            where:{id:params.addressId}
        }
    );
    ctx.body={code:Code.OK.code,msg:'成功'};
    return;
}


module.exports.addressDefault=async (ctx,next)=>{
    ctx.checkParams('addressId').notEmpty("地址id不能为空");
    ctx.checkBody('default').notEmpty("地址状态不能为空");
    let body = ctx.request.body
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let addressDa=ctx.dao.main.user.Address;
    await addressDa.update(
        {
            default:body.default,
        },
        {
            where:{id:params.addressId}
        }
    );
    ctx.body={code:Code.OK.code,msg:'成功'};
    return;
}



module.exports.addressDelete=async (ctx,next)=>{
    ctx.checkParams('addressId').notEmpty("地址id不能为空");
    let params = ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let addressDa=ctx.dao.main.user.Address;
    await addressDa.destroy({where:{id:params.addressId}});
    ctx.body={code:Code.OK.code,msg:'成功'};
    return;
}