'use strict'

const {Code} = require('../../../../libs/consts');
const {tool} = require('../../../../libs/utils');




//用户体检卡列表 status 0未使用 1全部 2已使用
module.exports.phyCardList=async (ctx,next)=>{
    ctx.checkParams('id').notEmpty("用户id不能为空");
    ctx.checkParams('status').notEmpty("体检卡状态不能为空");
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
    
    let cardDa=ctx.dao.main.medical.Card; 
    let examinationPackageDa=ctx.dao.main.medical.ExaminationPackage;    
    let center = ctx.dao.main.medical.Center;
    let organization = ctx.dao.main.medical.Organization;

    let include=[
        {
            association:cardDa.belongsTo(examinationPackageDa,{foreignKey: 'examinationPackageId', targetKey: 'id'}),
            required: true,
            attributes: ['name'],//套餐名称
        },
        {
            association:cardDa.belongsTo(center,{foreignKey: 'manufacturerMedicalCenterId',
            targetKey: 'manufacturerId'}),
            required: true,
            attributes: ['manufacturerId'], //厂商id
            include:[
                {
                    association:center.belongsTo(organization,{foreignKey: 'organizationId', targetKey: 'id' }),
                    required:true,
                    attributes:[['name','organizationName']]
                }
            ]
        } 
    ]
    let option={
        page: page||1,
        perPage: perPage||10,
        where:{ userId:params.id},
        order: [
            ['id', 'asc']
        ],
        options:{ include:include },
        attributes:[
            'id',
            'cardNumber',//卡号
            'status',//状态 0未使用、2已使用、1锁定
            'amount'//额度
        ]    
    }
    if(params.status==0||params.status==2||params.status==1){
        option.where.status=parseInt(params.status);  
    }
    let paginate=await cardDa.paginate(option)
    let items = [];
    if (paginate.items && paginate.items.length > 0) {
        paginate.items.forEach(function (item) {
            items.push({
                cardId:item.id,
                cardNumber:item.cardNumber,//机构id
                status:item.status,
                amount:item.amount,
                packageName:item.MedicalExaminationPackage.name,
                organizationName:item.MedicalCenter.MedicalOrganization.dataValues.organizationName,
            })
        });
    }
    ctx.body= {
        code:Code.OK.code,msg:'获取体检卡列表成功',data:{
            items:items
        }
    };
    return;
}

//用户赠送体检卡，单张赠送(注，在我的家庭中体检卡可以一次赠送多张)
module.exports.phyCardGive=async (ctx,next)=>{
    ctx.checkParams('id').notEmpty("体检卡id不能为空");
    ctx.checkBody('giveMobile').notEmpty("赠送人手机号不能为空");
    ctx.checkBody('captcha').notEmpty("图片验证码不能为空");
    ctx.checkBody('verifyCode').notEmpty("短信验证码不能为空");
    let params=ctx.params;
    let body=ctx.request.body;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let personalDa=ctx.dao.main.user.Personal;
    let cardDa=ctx.dao.main.medical.Card;
    //判断卡是否使用过
    let resultCard=await cardDa.findOne({
        where:{
            id:params.id
        }
    })
    if(resultCard.status===2){
        ctx.body= {
            code:Code.BadRequest.code,msg:'体检卡已被使用,不能赠送'
        };
        return;
    }
    //判断用户是否已经注册过
    let resultPerson=await personalDa.findOne({
        where:{
            phoneNumber:body.giveMobile,
        }
    });
    if(resultPerson){
        await cardDa.update({
            userId:resultPerson.accountId
        },
        {
            where:{
                id:params.id
            }
        })
    }else{
         //被赠送用户未注册过，注册并送卡
        let resultAccount=await accountDa.create({
            username:body.giveMobile,
            password:'',
            passwordSalt:'',
            from:'web',
            type:'personal',
            discount:body.discount,
            createdAt:new Date(),
        })
        if(resultAccount){
            let resultPersonal=await personalDa.create({
                accountId:resultAccount.id,
                phoneNumber:body.giveMobile
            })
            if(resultPersonal){
                //赠送体检卡
                await cardDa.update({
                    userId:resultPersonal.accountId
                },
                {
                    where:{
                        id:params.id
                    }
                })
                //成功赠送之后给用户发送短信提醒
                ctx.body={code:Code.OK.code,msg:'体检卡赠送成功'};
                return;
            }
        }
    }
    
}

//获取体检卡密码
module.exports.phyCardPassword=async (ctx,next)=>{
    ctx.checkParams('id').notEmpty("体检卡不能为空");
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let cardDa=ctx.dao.main.medical.Card;
    let result=await cardDa.findOne({
        where:{
            id:params.id
        }
    });
    if(result){
        ctx.body= {
            code:Code.OK.code,msg:'获取成功',data:{ cardPassword:result.cardPassword }
        };
    }
}