'use strict'
const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');


//企业基本信息(企业资料)
module.exports.entGetProfile=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    //员工个数
    let depatmentNum=await ctx.dao.main.user.EntDepartment.count({
        where:{enterpriseId:params.enterpriseId}
    });
    //部门个数
    let employeeNum=await ctx.dao.main.user.EntEmployee.count({
        where:{enterpriseId:params.enterpriseId}
    });
    //体检计划相关
    let phyExamiantionPlanRes =await ctx.dao.main.enterprise.PhyExamiantionPlan.findAll({
        attributes:['id',"payout",'name','employeeNumber','planDate'],
        where:{enterpriseId:params.enterpriseId}
    });
    //获取企业体检周期
    let cycleRemindRes = await ctx.dao.main.enterprise.CycleRemind.findAll({
        where:{enterpriseId:params.enterpriseId||ctx.state._user.id}
    });
    //拿到企业基本信息
    let resultEnt=await ctx.dao.main.user.Enterprise.findOne({
        include:[{
            model:ctx.dao.main.common.File,
            require:require,
            attributes:[ ['url','logo']]
        },{
            model:ctx.dao.main.common.File,
            as:'LicenseFile',
            require:require,
            attributes:[ ['url','LicenseFile']]
        },{
            model:ctx.dao.main.user.Account,
            required:true,
            attributes:['balance']
        }],
        where:{
            accountId:params.enterpriseId
        }
    });
    resultEnt = JSON.parse(JSON.stringify(resultEnt));

    let res=await ctx.dao.main.order.Order.findAll({
        include:[{
            model:ctx.dao.main.order.Item,
            required:true,
        }],
        where:{
            accountId:ctx.params.enterpriseId||ctx.state._user.id,
            invoiceId:{ '$eq': null }
        },
    });

    //可开 发票的总数
    let invoice=0 ;
     
    for(let item of res){
        invoice+=item.total;
    } 
    ctx.body={code:Code.OK.code,msg:'成功',data:{
        enterpriseName:resultEnt.name,
        identity:resultEnt.identity,//企业注册码
        licenseUrl:resultEnt.LicenseFile.LicenseFile,//营业执照
        logoUrl:resultEnt.File.logo,//logo
        contact:resultEnt.contact,
        phoneNumber:resultEnt.Account.phoneNumber,
        telephone:resultEnt.telephone,
        province:resultEnt.province,
        city:resultEnt.city,
        county:resultEnt.county,
        address:resultEnt.address,
        employee:resultEnt.employee,
        department:resultEnt.department,
        balance:resultEnt.Account.balance,
        invoice:invoice,  //可开发票的总额
        depatmentNum:depatmentNum,
        employeeNum:employeeNum,
        phyExamiantionPlanRes:phyExamiantionPlanRes,
        cycleRemindRes:cycleRemindRes
    }};
}
//企业资料修改
module.exports.entProfileEdit=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    
    //判断该企业注册码是否已经存在
    let res=await enterpriseDa.findOne({
        where:{identity:body.identity}
    })
    if(res){
        //企业注册码已存在，判断是不是本身就是或者注册码
        let resultEnterprise=await enterpriseDa.findOne({
            where:{
                identity:body.identity,
                accountId:params.enterpriseId,
            }
        })
        if(resultEnterprise){
            await enterpriseDa.update({
                contact:body.contact,
                province:body.province,
                city:body.city,
                county:body.county,
                address:body.address,
                telephone:body.telephone,
                logoFileId:body.logoFileId,
                licenseFileId:body.licenseFileId,
            },
            {
                where:{accountId:params.enterpriseId}
            });
            ctx.body= {
                code:Code.OK.code,msg:'企业资料修改成功'
            };
            return;
        }else{
            errors='企业注册码已被使用!';
            ctx.body = {code: Code.BadRequest.Code, msg: errors};
            return; 
        }
        
    }
    await enterpriseDa.update({
        identity:body.identity,
        contact:body.contact,
        province:body.province,
        city:body.city,
        county:body.county,
        address:body.address,
        telephone:body.telephone,
        logoFileId:body.logoFileId,
        licenseFileId:body.licenseFileId,
    },
    {
        where:{accountId:params.enterpriseId}
    });
    ctx.body= {
        code:Code.OK.code,msg:'企业资料修改成功'
    };
}
//修改企业注册码
module.exports.entIdentityEdit=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('identity').notEmpty('企业注册码不能为空')
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    //判断该企业注册码是否已经存在
    let res=await enterpriseDa.findOne({
        where:{identity:body.identity}
    })
    if(res){
        errors='企业注册码已被使用!';
        ctx.body = {code: Code.OK.code, msg: errors};
        return; 
    }
    await enterpriseDa.update({
        identity:body.identity
    },
    {
        where:{accountId:params.enterpriseId}
    });
    ctx.body= {
        code:Code.OK.code,msg:'修改成功'
    };
    return;
}
//修改企业联系人
module.exports.entContactEdit=async(ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('contact').notEmpty('企业联系人不能为空')
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg,error:errors};
        return;
    }
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    //企业联系人不需要判断已经存在
    await enterpriseDa.update({
        contact:body.contact
    },
    {
        where:{accountId:params.enterpriseId}
    });
    ctx.body= {
        code:Code.OK.code,msg:'修改成功'
    };
    return;
}
//修改企业联系地址
module.exports.entAddressEdit=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('address').notEmpty('企业联系地址不能为空');
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg,error:errors};
        return;
    }
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    //企业联系地址不需判断已存在
    await enterpriseDa.update({
        province:body.province,
        city:body.city,
        county:body.county,
        address:body.address
    },
    {
        where:{accountId:params.enterpriseId}
    });
    ctx.body= {
        code:Code.OK.code,msg:'修改成功'
    };
    return;
}

//企业安全设置接口
module.exports.entSafeSetting=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let accountDa=ctx.dao.main.user.Account;
    let res=await accountDa.findOne({
        where:{id:params.enterpriseId}
    });
    let passwordSetting=false,phoneNumberSetting=false;
    if(res.password){
        passwordSetting=true;
    }
    if(res.phoneNumber){
        phoneNumberSetting=true;
    }
    ctx.body={code:Code.OK.code,msg:'成功',data:{
        username:res.username,
        passwordSetting:passwordSetting,
        phoneNumberSetting:phoneNumberSetting,
        createdAt:res.createdAt,
        enterpriseId:res.id,
        phoneNumber:res.phoneNumber,
        emailStatus:res.emailStatus,
        email:res.email,
    }};
}
//修改企业密码
module.exports.entPasswordEdit=async (ctx,next)=>{
    ctx.checkBody('originalPassword').notEmpty("原始密码不能为空")
    ctx.checkBody('newPassword').notEmpty("新密码不能为空");
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    
    //查询企业获得passwordSalt 判断初始密码是否正确
    //判断新密码符合格式(密码由字母、数字、标点两种以上组成)
    //两次输入新密码是否一致
    
    let accountDa=ctx.dao.main.user.Account;
    //查询用户passwordSalt
    let resultAccount=await accountDa.findById(params.enterpriseId);
    if(!resultAccount){
        error='企业不存在';
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
    //请求过来的原始密码应该是md5加密的
    let originalPassword = tool.getMd5(body.originalPassword + resultAccount.passwordSalt);
    //原始密码输入正确
    if(originalPassword!==resultAccount.password){
        errors='原始密码错误';
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
    await accountDa.update({
        password:tool.getMd5(body.newPassword + resultAccount.passwordSalt)
    },{where:{id:resultAccount.id}})
    ctx.body={code:Code.OK.code,msg:'成功'};
    return;
}

//修改企业密码 根据 电话号
module.exports.entPasswordEditForNumber=async (ctx,next)=>{
    ctx.checkBody('newPassword').notEmpty("新密码不能为空");
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    
    let accountDa=ctx.dao.main.user.Account;
    //查询用户passwordSalt
    let resultAccount=await accountDa.findById(params.enterpriseId);
    if(!resultAccount){
        error='企业不存在';
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
    await accountDa.update({
        password:tool.getMd5(body.newPassword + resultAccount.passwordSalt)
    },{where:{id:resultAccount.id}})
    ctx.body={code:Code.OK.code,msg:Code.OK.msg};
}

//修改企业安全手机号
module.exports.entPhoneEdit=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let accountDa = ctx.dao.main.user.Account;
    //判断手机号是否其他企业被使用过
    let result=await accountDa.findOne({where:{
        phoneNumber:body.mobile
    }});
    if(result){
        errors='该手机号已被其他企业使用';
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
    await accountDa.update({
        phoneNumber:body.mobile,
    },
    {
        where:{id:params.enterpriseId}
    })
    ctx.body={code:Code.OK.code,msg:'修改成功'};
    return;
}
//修改企业邮箱
module.exports.entEmailEdit=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('email').notEmpty('企业邮箱不能为空')
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let accountDa=ctx.dao.main.user.Account;
    //判断该邮箱否已经存在
    let res=await accountDa.findOne({
        where:{email:body.email}
    })
    if(res){
        errors='企业邮箱已被使用!';
        ctx.body = {code: Code.OK.code, msg: errors};
        return; 
    }
    await accountDa.update({
        email:body.email
    },
    {
        where:{accountId:params.enterpriseId}
    });
    //发送企业邮箱验证码

    ctx.body= {
        code:Code.OK.code,msg:'修改成功'
    };
}

//消息相关
/**
 * 添加消息
 * @param {} ctx 
 * @param {*} next 
 */
module.exports.addMessage=async (ctx,next)=>{
    ctx.checkBody('title').notEmpty("消息标题不能为空");
    let message = ctx.dao.main.user.Message;
    await message.build({
        accountId:ctx.params.id,
        title:ctx.request.body.title,
        author:ctx.request.body.author,
        content:ctx.request.body.content,
        type:ctx.request.body.type||"system",
        status:ctx.request.body.status||"unread",
        createdAt:new Date(),
        updateAt:new Date()
    }).save().then(()=>{
        ctx.body={code:Code.OK.code,msg:Code.OK.msg};
    });
}

/**
 * 消息查询
 * @param {} ctx 
 * @param {*} next 
 */
module.exports.messageList=async (ctx,next)=>{
    let query = ctx.request.query,
        params=ctx.params,
        Op = ctx.main.Op;
    let page = query.page || 1,
        perPage = query.perPage || 20,
        addressDa=ctx.dao.main.user.Message,
        option={
            page: page,
            perPage: perPage,
            where:{accountId:params.id,deletedAt:{
                [Op.eq]:null
            }},
            order: [ ['id', 'asc'] ]
        };
    if(query.status=="unread" || query.status=="read"){
        option.where.status = query.status;
    }
    let paginate=await addressDa.paginate(option);
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:paginate}
}

/**
 * 更新消息状态
 * @param {} ctx 
 * @param {*} next 
 */
module.exports.updateMessage=async (ctx,next)=>{
    let idArray = ctx.request.body.messageIds;
    if(idArray && idArray.length>0){
        return ctx.main.transaction(t => {
            let message= ctx.dao.main.user.Message;
            let data={updatedAt:new Date(),status:ctx.request.body.status||"read"};
            for(let i = 0;i<idArray.length;i++){
                 message.update(data,{where:{id:idArray[i]}});
            }
        }).then(result => {
            ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:result}
        }).catch(err => {
            // Transaction has been rolled back
            // err is whatever rejected the promise chain returned to the transaction callback
        });
    }else{
        let message= ctx.dao.main.user.Message;
        let data={updatedAt:new Date(),status:ctx.request.body.status||"read"};
        await message.update(data,{where:{}}).then(()=>{
            ctx.body={code:Code.OK.code,msg:Code.OK.msg}
        });
    }    
}
/**
 * 删除消息
 * @param {} ctx 
 * @param {*} next 
 */
module.exports.deleteMessage=async (ctx,next)=>{
    let messageIds  =ctx.params.messageIds.slice(1,ctx.params.messageIds.length-1).split(',');
    if(!messageIds  && messageIds.length<=0){
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
    }else{
        return ctx.main.transaction(t => {
            let message= ctx.dao.main.user.Message;
            let messageIds  =ctx.params.messageIds.slice(1,ctx.params.messageIds.length-1).split(',');
            for(let i = 0;i<messageIds.length;i++){
                message.update({deletedAt:new Date()},{where:{ id:messageIds[i]}});
            }
        }).then(result => {
            ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:result}
        }).catch(err => {
            // Transaction has been rolled back
            // err is whatever rejected the promise chain returned to the transaction callback
        });
    }
}

