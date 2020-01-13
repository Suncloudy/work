'use strict'

const {Code} = require('../../../../libs/consts');
const {tool} = require('../../../../libs/utils');

/**
 * 获取地址列表
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.addressList=async (ctx,next)=>{
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let query = ctx.request.query,
        params=ctx.params;
    let page = query.page || 1,
        perPage = query.perPage || 20,
        addressDa=ctx.dao.main.user.Address,
        option={
            page: page,
            perPage: perPage,
            where:{accountId:params.id},
            order: [ ['id', 'asc'] ],
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
        ctx.body = {code: Code.OK.code, msg: Code.OK.msg,data:{
            page: paginate.page, pages: paginate.pages, total: paginate.total, items: items
        }};
        return;
    }else{
        ctx.body = {code: Code.OK.code, msg: Code.OK.msg,data:{
            page: paginate.page, pages: paginate.pages, total: paginate.total, items: items
        }};
        return;
    }
}

/**
 * 添加地址
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.addressAdd=async (ctx,next)=>{
    ctx.checkBody('receiver').notEmpty("收货地址不能为空");
    ctx.checkBody('phoneNumber').notEmpty("手机号码不能为空");
    ctx.checkBody('province').notEmpty("地址不能为空");
    ctx.checkBody('city').notEmpty("地址不能为空");
    ctx.checkBody('county').notEmpty("地址不能为空");
    //一个不需要判断参数 name 一个是否默认状态default
    ctx.checkBody('address').notEmpty("地址名称不能为空-如家,公司等");
    ctx.checkBody('default').notEmpty("地址状态不能为空");
    ctx.checkParams('id').notEmpty("用户id不能为空");
    let body = ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let addressDa=ctx.dao.main.user.Address;
    let bean_property = {
        phoneNumber:body.phoneNumber,
        receiver:body.receiver,
        province: body.province,
        city:body.city,
        county:body.county,
        address:body.address,
        accountId: params.id,
        default:body.default,
    };
    if(body.name){bean_property.name=body.name;}
    await addressDa.create(bean_property);
    ctx.body={code:Code.OK.code,msg:Code.OK.msg};
}

/**
 * 更新收货地址
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.addressEdit=async (ctx,next)=>{
    ctx.checkBody('receiver').notEmpty("收货地址不能为空");
    ctx.checkBody('phoneNumber').notEmpty("手机号码不能为空");
    ctx.checkBody('province').notEmpty("地址不能为空");
    ctx.checkBody('city').notEmpty("地址不能为空");
    ctx.checkBody('county').notEmpty("地址不能为空");
    ctx.checkBody('address').notEmpty("地址名称不能为空");
    ctx.checkBody('default').notEmpty("地址状态不能为空");
    ctx.checkParams('id').notEmpty("地址id不能为空");
    let body = ctx.request.body
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let addressDa=ctx.dao.main.user.Address,
        bean_property = {
            phoneNumber:body.phoneNumber,
            receiver:body.receiver,
            province: body.province,
            city:body.city,
            county:body.county,
            address:body.address,
            default:body.default,
        };
    if(body.name){
        bean_property.name=body.name;
    }
    await addressDa.update(bean_property,
        { where:{id:params.id} }
    );
    ctx.body={code:Code.OK.code,msg:Code.OK.msg};
}

/**
 * 设置默认的收货地址
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.defaultAddress=async (ctx,next)=>{
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let addressDa=ctx.dao.main.user.Address;
    await addressDa.update( { default:true}, { where:{id:params.id} } );
    ctx.body={code:Code.OK.code,msg:Code.OK.msg};
}

/**
 * 设置非默认的收货地址
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.optionAddress=async (ctx,next)=>{
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let addressDa=ctx.dao.main.user.Address;
    await addressDa.update( { default:false}, { where:{id:params.id} } );
    ctx.body={code:Code.OK.code,msg:Code.OK.msg};
}

/**
 * 删除收货地址
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.addressDelete=async (ctx,next)=>{
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let addressDa=ctx.dao.main.user.Address;
    await addressDa.destroy({where:{id:ctx.params.id}}).then(()=>{
        ctx.body={code:Code.OK.code,msg:Code.OK.msg};
    });
}