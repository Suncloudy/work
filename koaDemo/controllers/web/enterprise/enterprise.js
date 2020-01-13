'use strict'
const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');
const excel = require('exceljs');
const send = require('koa-send')

//企业申请
module.exports.enterpriseApply=async (ctx,next)=>{
    ctx.checkBody('enterpriseName').notEmpty("企业名称不能为空");
    ctx.checkBody('province').notEmpty("省不能为空");
    ctx.checkBody('city').notEmpty("市不能为空");
    ctx.checkBody('contact').notEmpty("联系人不能为空");
    ctx.checkBody('phoneNumber').notEmpty("手机号码不能为空");
  
    let body=ctx.request.body;
    let Op = ctx.main.Op;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let account = ctx.dao.main.user.Account;
    let entApplyDa=ctx.dao.main.user.EntApply;
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    //判断手机号和企业名 
    //企业表是否已经存在这个企业和手机号,不需要判断以及存在个人
    //企业申请表中是否已经存在了且审核状态未未审核
    let resultEntByName=await enterpriseDa.findOne({
        where:{name: body.enterpriseName}});
    let resultEntByPhoneNumber=await account.findOne({where:
        {phoneNumber: body.phoneNumber}});

    let resultApply=await entApplyDa.findOne({where:{
        status:'pending',
        [Op.or]: [{ phoneNumber: body.phoneNumber}, {name: body.enterpriseName}]
    }});
    if(resultEntByName || resultEntByPhoneNumber){
        let errors='您申请的用户已存在!';
        ctx.body = {code: Code.OK.code, msg: errors};
        return;
    }else if(resultApply){
        let errors='企业正在审核中!';
        ctx.body = {code: Code.OK.code, msg: errors};
        return;
    }else{
        await entApplyDa.create(
            {
                name:body.enterpriseName,
                province:body.province,
                city: body.city,
                contact:body.contact,
                phoneNumber:body.phoneNumber,
            }
        ).then(()=>{
            let errors='企业申请成功!';
            ctx.body={code:Code.OK.code,msg:errors};
        }).catch((error)=>{
            ctx.body={code:Code.InternalServerError.code,msg:errors};
        });
    }
}


//企业部门获取(筛选条件，或者添加企业部门选择使用)
module.exports.entDepartmentsSearch=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    let result=await entDepartmentDa.findAll({
        where:{enterpriseId:params.enterpriseId},
        attributes:['name','id']
    });
    if (result) {
    let items = [];
    result.forEach(function (item) {
        items.push({
            departmentName: item.name,
            departmentId:item.id
        })
    }); 
    return ctx.body={code:Code.OK.code,msg:'成功',data:{
        items: items}
    };
    } else{
        return ctx.body={code:Code.OK.code,msg:'成功',data:{
            items: []}
        };
    }
}

//企业员工列表获取  （没有部门的员工或者部门删除的也应该查出来）
module.exports.entEmployeeList=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let query=ctx.request.query;
    let Op = ctx.main.Op
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.ms};
        return;
    }
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    let entEmployeeDa=ctx.dao.main.user.EntEmployee;
    let personalDa=ctx.dao.main.user.Personal;
    let accountDa=ctx.dao.main.user.Account;

    let perPage = query.perPage || 10;
    let page = query.page || 1;
    let includePersonal={};

    if (query.optName) {
        includePersonal = {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: `%${query.optName}%`
                    }
                },
                {
                    phoneNumber: {
                        [Op.like]: `%${query.optName}%`
                    }
                },
            ],
        }
    }
    let include=[
        {
            //belongsTo 外键在源文件上 hasOne外键存在于目标文件上
            association:entEmployeeDa.belongsTo(personalDa, {foreignKey: 'accountId',targetKey: 'accountId'}),
            required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            attributes:[ 'name','accountId'],
            where:includePersonal,
            include:{
                association:personalDa.belongsTo(accountDa,{foreignKey: 'accountId', targetKey: 'id'}),
                required: false,
                attributes: ['active','phoneNumber'], //企业名称
            }
        },
        {
           association:entEmployeeDa.belongsTo(entDepartmentDa, {foreignKey: 'departmentId',
           targetKey: 'id'}),
           required: false,
           attributes:[ 'name','id'],
        },
    ];
    let option={
        page: page,
        perPage: perPage,
        where:{
            enterpriseId:params.enterpriseId,
            deletedAt: {
                '$eq': null              // deletedAt IS NOT NULL  $ne
                //deletedAt IS NULL $eq
            }
        },
        order: [ ['id', 'asc'] ],
        raw: true, // 设置为 true，即可返回源数据
        distinct: true,
        options:{ include:include },
        attributes:[ 'id' ]       
    };
    //搜索传入的部门id
    if(query.departmentId){
        option.where.departmentId=query.departmentId;
    }
    if(query.status){
        option.where.status=query.status;
    }
    let paginate=await entEmployeeDa.paginate(option)
    let items = [];
    if (paginate.items && paginate.items.length > 0) {
        paginate.items.forEach(function (item) {
            items.push({
                entEmployeeId:item.id,//员工关系表中的id值
                employeeName: item['Personal.name'],
                phoneNumber: item['Personal.Account.phoneNumber'],
                employeeAccountId:item['Personal.accountId'],//员工用户id，
                departmentName: item['EntDepartment.name'],
                departmentId:item['EntDepartment.id'],//部门id
                active:item['Personal.Account.active'],
            })
        });
        ctx.body= {
            code:Code.OK.code,msg:'成功',data:{page: paginate.page, pages: paginate.pages, total: paginate.total, items: items}};
        return;
    }else{
        ctx.body= {
            code:Code.OK.code,msg:'成功',data:{page: paginate.page, pages: paginate.pages, total: paginate.total, items: items}};
        return;
    }
}

//企业员工添加
module.exports.entEmployeeAdd=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('name').notEmpty("员工姓名不能为空");
    ctx.checkBody('phoneNumber').notEmpty("员工手机号不能为空");
    //ctx.checkBody('departmentId').notEmpty("部门id不能为空");//部门id可以为空
    let body = ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let entEmployeeDa=ctx.dao.main.user.EntEmployee;
    let personalDa=ctx.dao.main.user.Personal;
    let accountDa=ctx.dao.main.user.Account;
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    //先判断员工手机号是否已经存在了
    let resultAccount=await accountDa.findOne({where:{phoneNumber:body.phoneNumber}});
    if(resultAccount){
        //判断员工在该企业中是否已经添加过了
        let resultEmployeeExist=await entEmployeeDa.findOne({
            where:{
                accountId:resultAccount.id,
                enterpriseId:body.enterpriseId,
            }
        })
        if(resultEmployeeExist){
            if(resultEmployeeExist.status==0){
                errors="等待员工同意";
                ctx.body = {code: Code.BadRequest.code, msg: errors};
                return;
            }
            if(resultEmployeeExist.status==1){
                errors="该员工已被我们企业添加过";
                ctx.body = {code: Code.BadRequest.code, msg: errors};
                return;
            }
            if(resultEmployeeExist.status==2){
                await entEmployeeDa.update({
                    status:0,
                },{
                    accountId:resultEmployeeExist.accountId,
                    enterpriseId:resultEmployeeExist.enterpriseId,
                })
                errors="员工曾拒绝，再次添加";
                ctx.body = {code: Code.BadRequest.code, msg: errors};
                return;
            }
        }else{
        //员工已注册 判断是否绑定其他企业
        //未绑定企业，创建绑定企业关系，由员工确认登陆关联当前企业
        //绑定企业，提示员工绑定失败，由员工解绑，企业管理员再次添加
        let resultEmployee=await entEmployeeDa.findOne({
            where:{
                accountId:resultAccount.id,
                deletedAt:{
                    '$eq': null              // deletedAt IS NOT NULL  $ne
                    //deletedAt IS NULL $eq
                }
            }
        })
        if(resultEmployee){
            if(resultEmployee.status==1){
                errors="员工已存在,且绑定其他企业，请员工自行解除绑，再次添加";
                ctx.body = {code: Code.BadRequest.code, msg: errors};
                return;
            }else if(resultEmployee.status==0){
                errors="员工已收到其他企业添加，请员工自行登录处理";
                ctx.body = {code: Code.BadRequest.code, msg: errors};
                return;
            }else if(resultEmployee.status==2){
                await entEmployeeDa.create({
                    accountId:resultAccount.id,
                    enterpriseId:params.enterpriseId,
                    departmentId:body.departmentId,
                    status:0,
                })
                ctx.body= {
                    code:Code.OK.code,msg:'员工添加成功'
                };
                return;
            }
        }
        //resultEmployee.status==2 或者没有值
        else{
            //添加员工已注册、未绑定企业：创建绑定关系，但由员工登录确认后才能正式关联到当前企业下
            await entEmployeeDa.create({
                accountId:resultAccount.id,
                enterpriseId:params.enterpriseId,
                departmentId:body.departmentId,
                status:0,
            })
            ctx.body= {
                code:Code.OK.code,msg:'员工添加成功'
            };
            return;
        }
        }
       
    }else{
        let resultEnt=await enterpriseDa.findOne({where:{
            accountId:params.enterpriseId
        }})
        if(!resultEnt){
            errors="企业不存在";
            ctx.body = {code: Code.BadRequest.code, msg: errors};
            return;
        }
        let employeeNum=await ++resultEnt.employee;

        //企业员工添加后，可以直接登录，登录初始密码666666
        let passwordSalt = tool.makeRandomStr(4, 0)
        let password = tool.getMd5(tool.getMd5('666666') + passwordSalt)
        ctx.main.transaction(async function(t){
        let newAccountRes=await accountDa.create({
            username:body.phoneNumber,
            password:password,
            passwordSalt:passwordSalt,
            phoneNumber:body.phoneNumber,
            from:'web',
            type:'personal',
            createdAt:new Date(),
        },{transaction:t});
        await personalDa.create({
            accountId:newAccountRes.id,
            name:body.name,
            createdAt:new Date(),
        },{transaction:t});
        //员工添加后需要在企业表中也更新员工数加一
        await enterpriseDa.update({
          employee:employeeNum
        },{where:{
          accountId:params.enterpriseId,
        }},{transaction:t});
        //员工 企业 部门关系表添加
        await entEmployeeDa.create({
            accountId:newAccountRes.id,
            enterpriseId:params.enterpriseId,
            departmentId:body.departmentId,
        },{transaction:t});
        return Promise.resolve(newAccountRes);
        }).then(function(result){
            //Transaction会自动提交
            ctx.body= { code:Code.OK.code,msg:'添加成功' };
        }).catch(function(err){
            console.log(JSON.stringify(err));
            //err 是事务回调中使用promise链中的异常结果
            errors="添加失败，事务回滚";
            ctx.body = {code: Code.BadRequest.code, msg: errors+err};
        });
        ctx.body= { code:Code.OK.code,msg:Code.OK.msg };
    }
}

//企业员工excel模板下载
module.exports.employeeExcelModelDownload=async (ctx,next)=>{
    await send(ctx, __dirname+'../../../public/downloads/employee_import_model.xlsx')
}

//企业员工添加excel导入
module.exports.entEmployeeExcelAdd=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let body = ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let entEmployeeDa=ctx.dao.main.user.EntEmployee;
    let personalDa=ctx.dao.main.user.Personal;
    let accountDa=ctx.dao.main.user.Account;
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    //上传之后的文件存储信息再files中
        let workbook = new excel.Workbook(); 
        //问题员工不能插入
        let employeeIssue=[];
        //同步读取
        workbook.xlsx.readFileSync(__dirname+'/'+ctx.req.file.destination) 
        .then(function(){
            let worksheet = workbook.getWorksheet(1); 
            worksheet.eachRow( async function(row, rowNumber) {
                console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                //["员工姓名","手机号","所属部门"]
                //先判断员工手机号是否已经存在了
                let resultPersonal=await personalDa.findOne({where:{phoneNumber:row.values[1]}});
                if(resultPersonal){
                    //判断员工在该企业中是否已经添加过了
                    let resultEmployeeExist=await entEmployeeDa.findOne({
                        where:{
                            accountId:resultPersonal.accountId,
                            enterpriseId:body.enterpriseId,
                        }
                    })
                    if(resultEmployeeExist){
                        if(resultEmployeeExist.status==0){
                            employeeIssue.push({
                                name:row.values[0],
                                phoneNumber:row.values[1],
                                department:row.values[2],
                                issue:'员工已添加过，等待员工同意',
                            })
                            //continue;
                        }
                        if(resultEmployeeExist.status==1){
                            employeeIssue.push({
                                name:row.values[0],
                                phoneNumber:row.values[1],
                                department:row.values[2],
                                issue:'该员工已被我们企业添加过',
                            })
                            //continue;
                        }
                        if(resultEmployeeExist.status==2){
                            await entEmployeeDa.update({
                                status:0,
                            },{
                                accountId:resultEmployeeExist.accountId,
                                enterpriseId:resultEmployeeExist.enterpriseId,
                            });
                            employeeIssue.push({
                                name:row.values[0],
                                phoneNumber:row.values[1],
                                department:row.values[2],
                                issue:'员工曾拒绝我们企业，再次添加',
                            })
                            //continue;
                        }
                    }else{
                    //员工已注册 判断是否绑定其他企业
                    //未绑定企业，创建绑定企业关系，由员工确认登陆关联当前企业
                    //绑定企业，提示员工绑定失败，由员工解绑，企业管理员再次添加
                    let resultEmployee=await entEmployeeDa.findOne({
                        where:{
                            accountId:resultPersonal.accountId,
                            deletedAt:{
                                '$eq': null              // deletedAt IS NOT NULL  $ne
                                //deletedAt IS NULL $eq
                            }
                        }
                    })
                    if(resultEmployee.status==1){
                        employeeIssue.push({
                            name:row.values[0],
                            phoneNumber:row.values[1],
                            department:row.values[2],
                            issue:'员工曾拒绝我们企业，再次添加',
                        })
                        //continue;
                    }else if(resultEmployee.status==0){
                        employeeIssue.push({
                            name:row.values[0],
                            phoneNumber:row.values[1],
                            department:row.values[2],
                            issue:'员工已收到其他企业添加，请员工自行登录处理',
                        })
                        //continue;
                    }
                    //resultEmployee.status==2 或者没有值
                    else{
                        //添加员工已注册、未绑定企业：创建绑定关系，但由员工登录确认后才能正式关联到当前企业下
                        await entEmployeeDa.create({
                            accountId:resultPersonal.id,
                            enterpriseId:params.enterpriseId,
                            departmentId:body.departmentId,
                            status:0,
                        })
                        employeeIssue.push({
                            name:row.values[0],
                            phoneNumber:row.values[1],
                            department:row.values[2],
                            issue:'员工已存在,未绑定企业，请员工确认登陆自行绑定',
                        })
                        //continue;
                    }
                    }
                   
                }else{
                    //企业员工添加后，可以直接登录，登录初始密码666666
                    let passwordSalt = tool.makeRandomStr(4, 0)
                    let password = tool.getMd5(tool.getMd5('666666') + passwordSalt)
                    let newAccountRes=await accountDa.create({
                            username:body.phoneNumber,
                            password:password,
                            passwordSalt:passwordSalt,
                            from:'web',
                            type:'personal',
                            createdAt:new Date(),
                    });
                    await personalDa.create({
                        accountId:newAccountRes.id,
                        name:body.name,
                        phoneNumber:body.phoneNumber,
                        createdAt:new Date(),
                    })
                    let resultEnt=await enterpriseDa.findOne({where:{
                        accountId:params.enterpriseId
                    }})
                    if(!resultEnt){
                        errors="企业不存在";
                        ctx.body = {code: Code.BadRequest.code, msg: errors};
                        return;
                    }
                    let employeeNum=await ++resultEnt.employee;
                    //员工添加后需要在企业表中也更新员工数加一
                    await enterpriseDa.update({
                      employee:employeeNum
                    },{where:{
                      accountId:params.enterpriseId,
                    }})
                    //员工 企业 部门关系表添加
                    await entEmployeeDa.create({
                        accountId:newAccountRes.id,
                        enterpriseId:params.enterpriseId,
                        departmentId:body.departmentId,
                    })
                   
                }
            });
        });
    ctx.body= {
        code:Code.OK.code,msg:'添加成功',data:{
            employeeIssueItems:employeeIssue
        }
    };
    return;
}

//企业员工修改
module.exports.entEmployeeEdit=async (ctx,next)=>{
    ctx.checkParams('employeeId').notEmpty("员工id不能为空");
    ctx.checkBody('name').notEmpty("员工姓名不能为空");
    ctx.checkBody('departmentId').notEmpty("员工部门id不能为空");
    let body = ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let entEmployeeDa=ctx.dao.main.user.EntEmployee;
    let personalDa=ctx.dao.main.user.Personal;
    let resultEntEmployee=await entEmployeeDa.findOne({where:{id:params.employeeId}});
    if(resultEntEmployee){
            await personalDa.update({
                name:body.name,
            },
            {
                where:{
                    accountId:resultEntEmployee.accountId
                }
            });
            await entEmployeeDa.update({
                departmentId:body.departmentId,
            },
            {
                where:{
                    accountId:resultEntEmployee.accountId
                }
            });
            ctx.body = {code: Code.OK.code, msg: '员工修改成功'};
            return;
    }else{
        let errors='员工不存在';
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
}

//企业员工删除
module.exports.entEmployeeDelete=async (ctx,next)=>{
    ctx.checkParams('employeeId').notEmpty("员工id不能为空");
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let entEmployeeDa=ctx.dao.main.user.EntEmployee;
    await entEmployeeDa.update({
        deletedAt:new Date(),
    },{
       where:{accountId: params.employeeId}
    })
    ctx.body = {code: Code.OK.code, msg: '删除成功'};
}