'use strict'
const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');

//添加部门接口
module.exports.entDepartmentAdd=async(ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('ennDepartmentName').notEmpty('部门名称不能为空');
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    //判断部门名称是否存在
    let resultDepartment=await entDepartmentDa.findOne(
        {where:{
            name:body.ennDepartmentName
        }}
    )
    if(resultDepartment){
        errors='该部门已存在'
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }
    //判断企业存在
    let resultEnt=await enterpriseDa.findOne({accountId:params.enterpriseId})
    if(!resultEnt){
        errors='企业不存在'
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }
    //部门表添加
    await entDepartmentDa.create({
        name:body.ennDepartmentName,
        enterpriseId:params.enterpriseId,
        numberEmps:body.numberEmps||0,
    })
    //企业表中更新部门数
    let departmentNum=await ++resultEnt.department
    await enterpriseDa.update({
        department:departmentNum
    },{
        where:{accountId:params.enterpriseId}
    })
    //添加时候默认该部门人数就是0
    ctx.body= {
        code:Code.OK.code,msg:'添加成功'
    };
    return;
}

//获取部门列表
module.exports.entDepartmentList=async(ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let query=ctx.request.query;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    let perPage = query.perPage || 10;
    let page = query.page || 1;

    let include=[{
         //belongsTo 外键在源文件上 hasOne外键存在于目标文件上
         association:entDepartmentDa.belongsTo(enterpriseDa, {foreignKey: 'enterpriseId',
         targetKey: 'accountId'}),
         required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
         attributes:[ 'employee'],
    }]
    let option={
        page: page,
        perPage: perPage,
        where:{enterpriseId:params.enterpriseId},
        order: [
            ['id', 'asc']
        ],
        options:{ 
            include:include
        }, 
    }
    let paginate=await entDepartmentDa.paginate(option)
    let items = [];
    if (paginate.items && paginate.items.length > 0) {
        paginate.items.forEach(function (item) {
            console.log("获取的部门列表"+JSON.stringify(item));
            items.push({
                entDepartmentId:item.id,
                entDepartmentName: item.name,
                order: item.order,//排序
                empNumber:item.numberEmps,//部门的总人数
                entEmpNumber:item['Enterprise'].employee,//员工数
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

//部门修改
module.exports.entDepartmentEdit=async(ctx,next)=>{
    ctx.checkParams('departmentId').notEmpty("部门id不能为空");
    ctx.checkBody('entDepartmentName').notEmpty('部门名称不能为空');
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    let enterpriseDa=ctx.dao.main.user.Enterprise;
    //判断部门是否存在
    let resultDepartMent=await entDepartmentDa.findOne({where:{id:params.departmentId}});
    if(!resultDepartMent){
        errors='部门不存在'
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }
    await entDepartmentDa.update({
        name:body.entDepartmentName,
        money:body.money||resultDepartMent.money,
        numberEmps:body.numberEmps||resultDepartMent.numberEmps
    },
    {
        where:{id:parseInt(params.departmentId)}
    });
    ctx.body= {
        code:Code.OK.code,msg:'修改成功'
    };
    return;
}

//部门删除
module.exports.entDepartmentDelete=async(ctx,next)=>{
    ctx.checkParams('departmentId').notEmpty("部门id不能为空");
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    
    await entDepartmentDa.destroy({where:{id:params.departmentId}});
    ctx.body= {
        code:Code.OK.code,msg:'删除成功'
    };
    return;
}