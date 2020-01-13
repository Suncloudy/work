
'use strict'

const {Code} = require('../../../../libs/consts');

//我的家庭基本信息(包括家人关爱计划))
module.exports.familyProfile=async(ctx,next)=>{ 
    ctx.checkParams('id').notEmpty("用户id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let personalDa=ctx.dao.main.user.Personal;
    let inviteDa=ctx.dao.main.user.Invite;
    let accountDa=ctx.dao.main.user.Account;
    let file =  ctx.dao.main.common.File;
    //inviteeId 受邀人id
    //inviterId 邀请人id
    //用户基本信息
    let userBasic={}

    let resultPersonal=await personalDa.findOne({
        include:[
            {
                model:ctx.dao.main.user.Account,
                require:true,
            },{
                model:file,
                require:true,
                attributes:['url'], 
            },{
                model:ctx.dao.main.discount.Coupon,
                required:true,
                include:[
                    {
                        model:ctx.dao.main.discount.Discount,
                        required:true,
                    }
                ],
                attributes:['id','couponCode','createdAt']
            }
        ],
        where:{
            accountId:params.id
        }
    });
    if(resultPersonal){
        userBasic.name=resultPersonal.name;
        userBasic.discount=resultPersonal.Account.Discount;
        userBasic.createdAt=resultPersonal.Account.createdAt;
        userBasic.avatar=resultPersonal.File==null?null:resultPersonal.File.url;
        userBasic.phoneNumber=resultPersonal.Account.phoneNumber;
    }
    //已邀请人数信息 家人信息
    let include =[
        {
            //belongsTo 外键在源文件上 hasOne外键存在于目标文件上
            association:inviteDa.belongsTo(personalDa, {foreignKey: 'inviteeId', targetKey: 'accountId'}),
            required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            attributes:[ 'name','avatar_file_id','accountId'],//查询受邀人的相关信息
            where:{  deletedAt:{ '$eq': null  }   },
            include:[
                {
                    association:personalDa.belongsTo(accountDa,{foreignKey:'accountId',targetKey:'id'}),
                    require:true,
                    attributes:['phoneNumber']
                }
            ]
        }
    ];
    let option={
        where:{
            inviterId:params.id,
        },
        include:include,
        attributes:[
            'createdAt'
        ]       
    };
    let inviteBasic={}
    let result=await inviteDa.findAll(option);
    if(result){
        inviteBasic.inviteNumber=result.length;
        let items=[];
        result.forEach(async item=>{
            items.push({
                phoneNumber:item.Personal.Account.phoneNumber,
                name:item.Personal.name,
                avatar:item.Personal.avatar,
                familyUserId:item.Personal.accountId,
                createdAt:item.createdAt
            })
        })
        inviteBasic.items=items;
    }else{
        inviteBasic={};
    }
    ctx.body={code:Code.OK.code,msg:'成功',data:{
        userBasic:userBasic,
        inviteBasic:inviteBasic
    }};
}

// wxid_xkz9jbi5p9x122

//立即赠送折扣(家人关爱计划)
module.exports.familyGiveDiscount=async(ctx,next)=>{
    ctx.checkBody('discountId').notEmpty("赠送折扣不能为空");
    ctx.checkBody('invitePhone').notEmpty("被邀请人手机号");
    ctx.checkParams('id').notEmpty("用户id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let personalDa=ctx.dao.main.user.Personal;
    let inviteDa=ctx.dao.main.user.Invite;
    let accountDa=ctx.dao.main.user.Account; 
    //判断用户可邀请人数是否超过5个
    let inviteNum=await inviteDa.count({
        where:{
            inviterId:params.id
        }
    });
    if(inviteNum>5){
        //成功开通之后给用户发送短信提醒
        ctx.body={code:Code.BadRequest.code,msg:'可邀请用户已达上限'};
        return;
    }
    //判断手机号是否注册过
    let result=await accountDa.findOne({
        where:{
            phoneNumber:body.invitePhone,
        }
    })
    if(result){
        //被赠送用户已注册但未被赠送过，开通折扣资格
        //已注册且已是企业会员或被赠送过，给出相关提示
        let resultInvitee =await inviteDa.findOne({
            where:{
                inviteeId:result.id
            }
        });
        if(resultInvitee){
           //用户被邀请过
           ctx.body={code:Code.BadRequest.code,msg:'用户已被邀请过'};
           return;
        }else{
            //判断是否折扣(已经是企业会员)
           let resultAcc=await  accountDa.findOne({
               where:{
                id:result.id
               }
           })
           if(resultAcc.discout){
               //用户被邀请过
               ctx.body={code:Code.BadRequest.code,msg:'企业会员员工不可被邀请'};
               return;
           }else{
               //添加折扣 添加用户邀请关系 发送短信验证码
               await accountDa.update({
                   discountId:body.discountId
               },{
                   where:{
                    id:resultAcc.id
                   }
               })
               await inviteDa.create({
                //inviteeId 受邀人id
                //inviterId 邀请人id
                inviterId:params.id,
                inviteeId:resultAcc.id
               });
               ctx.body={code:Code.OK.code,msg:'折扣邀请短信验证码已发送'};
               return;
           }
        }
    }else{
        //被赠送用户未注册过，注册并开通折扣 
        let resultAccount=await accountDa.create({
            username:body.invitePhone,
            password:'',
            passwordSalt:'',
            from:'web',
            type:'personal',
            discountId:body.discountId,
            createdAt:new Date(),
            phoneNumber:body.invitePhone
        })
        if(resultAccount){
            let resultPersonal=await personalDa.create({
                accountId:resultAccount.id,
            })
            if(resultPersonal){
                //添加邀请关系
                await inviteDa.create({
                    //inviteeId 受邀人id
                    //inviterId 邀请人id
                    inviterId:params.id,
                    inviteeId:resultPersonal.accountId
                })
                //成功开通之后给用户发送短信提醒
                ctx.body={code:Code.OK.code,msg:'折扣邀请短信验证码已发送'};
                return;
            }
        }
    }
}

//赠送体检卡(家人 可以赠送多张)
module.exports.familyGiveCard=async(ctx,next)=>{
    ctx.checkBody('cardIds').notEmpty("体检卡id数组不能为空");
    ctx.checkParams('id').notEmpty("被赠送人用户id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let phyCardDa=ctx.dao.main.product.PhyCard;
    body.cardIds.forEach(async item=>{
        await phyCardDa.update({ userId:params.id },{ where:{ id:item } })
    });
    ctx.body={code:Code.OK.code,msg:'赠送成功'};
}