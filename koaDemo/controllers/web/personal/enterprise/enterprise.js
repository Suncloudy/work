
'use strict'

const {Code} = require('../../../../libs/consts');
const {tool} = require('../../../../libs/utils');

//我的企业基本信息---员工只会出现一个申请信息，一个未同意或者拒绝，其他企业不允许添加
module.exports.employeeEntProfile=async(ctx,next)=>{
    ctx.checkParams('id').notEmpty("用户id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    //查询员工所有企业添加员工申请
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    let entEmployeeDa=ctx.dao.main.user.EntEmployee;
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    let account = ctx.dao.main.user.Account;
    let include=[
        {
            //belongsTo 外键在源文件上 hasOne外键存在于目标文件上
            association:entEmployeeDa.belongsTo(enterpriseDa, {foreignKey: 'enterpriseId',  targetKey: 'accountId'}),
            required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            attributes:[ 'name','accountId'],
            where:{  deletedAt:{  '$eq': null  }  },
            include:[
                {
                    association:enterpriseDa.belongsTo(account,{foreignKey:'accountId',targetKey:'id'}),
                    required:true,
                    attributes:['phoneNumber']
                }
            ]
        },
        {
            association:entEmployeeDa.belongsTo(entDepartmentDa, {foreignKey: 'departmentId',
            targetKey: 'id'}),
            required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            attributes:[ 'name','id'], //部门名称和id
         },
    ];
    let option={
        where:{
            accountId:params.id,
            deletedAt: {
                '$eq': null              // deletedAt IS NOT NULL  $ne
                //deletedAt IS NULL $eq
            }, 
            status:{
                '$ne':2, //不等于2
            }
        },
       
        include:include,
        attributes:[
            'id','status','createdAt'
        ]       
    };
    let employeeEntProfile={};
    let result =await entEmployeeDa.findOne(option)
    if(result){
        employeeEntProfile={
            entEmployeeId:result.id,
            enterpriseName:result.Enterprise.name,
            departmentName:result.EntDepartment.name,
            employeeStatus:result.status,//根据状态判断 0默认员工待确认待处理 1员工已确认正常状态
            createdAt:result.createdAt
        }
        let items = [];
        if(employeeEntProfile.employeeStatus==1){
         //查询员工的所有体检计划 
        let phyEmployeePlanDa=ctx.dao.main.enterprise.PhyEmployeePlan;
        let phyExamiantionPlanDa=ctx.dao.main.enterprise.PhyExamiantionPlan;
        let includePlan=[{
            //belongsTo 外键在源文件上 hasOne外键存在于目标文件上
            association:phyEmployeePlanDa.belongsTo(phyExamiantionPlanDa, {foreignKey: 'phyPlanId',
            targetKey: 'id'}),
            required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            attributes:['name'],
            where:{
               deletedAt:{
                   '$eq': null              // deletedAt IS NULL 
               } 
            }
        }]
        let option={
            where:{
                employeeId:employeeEntProfile.entEmployeeId,
                deletedAt: {
                    '$eq': null              // deletedAt IS NOT NULL  $ne
                    //deletedAt IS NULL $eq
                }
            },
            include:includePlan,
            attributes:[
                'money','status','createdAt'
            ]       
        };
        let resultPlan=await phyEmployeePlanDa.findAll(option);
        if(resultPlan){
            resultPlan.forEach(function (item) {
                items.push({
                    money: item.money,
                    status:item.status,
                    createdAt:item.createdAt,
                    palnName:item.PhyExamiantionPlan.name
                })
            }); 
            ctx.body={code:Code.OK.code,msg:'成功',data:{
                employeeEntProfile:employeeEntProfile,
                examiantionPlans:items
            }};
            return;
        }else{
            ctx.body={code:Code.OK.code,msg:'成功',data:{
                employeeEntProfile:employeeEntProfile,
                examiantionPlans:items
            }};
            return;
        }
        }else{
            ctx.body={code:Code.OK.code,msg:'企业获取成功',data:{
                employeeEntProfile:employeeEntProfile,
                examiantionPlans:items
            }};
            return;
        }
    }else{
        ctx.body={code:Code.OK.code,msg:'用户暂无企业信息'};
        return;
    }
}

//企业申请添加员工-同意/拒绝 1同意 2拒绝
module.exports.employeeEntRelationChange=async(ctx,next)=>{
    ctx.checkParams('id').notEmpty("用户id不能为空");
    ctx.checkParams('status').notEmpty("状态不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let entEmployeeDa=ctx.dao.main.user.EntEmployee;
    //同意
    if(params.status==1){
       await entEmployeeDa.update({
            status:1
        },{
            where:{accountId:params.id}
        })
        ctx.body={code:Code.OK.code,msg:Code.OK.msg};
        return;
    }
    //拒绝
    else if(params.status==2){
        await entEmployeeDa.update({
            status:2
        },{
            where:{accountId:params.id}
        })
        ctx.body={code:Code.OK.code,msg:Code.BadRequest.msg};
        return;
    }
    else{
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
}

//企业员工关系解绑---员工关系存在，状态不变，deleteAt只修改
module.exports.employeeEntRelationRemove=async(ctx,next)=>{
    ctx.checkParams('id').notEmpty("用户id不能为空");
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let entEmployeeDa=ctx.dao.main.user.EntEmployee;
    await entEmployeeDa.update({ deletedAt:new Date() },
    {
        where:{accountId:ctx.params.id}
    })
    ctx.body={code:Code.OK.code,msg:Code.OK.msg};
}