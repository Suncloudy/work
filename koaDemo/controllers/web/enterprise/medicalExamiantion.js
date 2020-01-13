'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');


//体检额度套餐添加
module.exports.setMealAdd=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('setMealMoney').notEmpty("套餐名称不能为空");
    let body = ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let setMealDa=ctx.dao.main.enterprise.SetMeal;
    //这里需要对前端输入数据进行校验，查看是否是钱的格式
    let resultSetMeal=await setMealDa.findOne({
        where:{ oney:body.setMealMoney}
    }).catch(error=>{
        ctx.body={code:Code.InternalServerError.code,msg:Code.InternalServerError.msg,data:error};
        return ;
    });
    if(resultSetMeal){
        errors='套餐已存在',
        ctx.body={code:Code.OK.code,msg:errors};
        return;
    }
    await setMealDa.create( { name:body.name, money:body.setMealMoney, enterpriseId:params.enterpriseId } ).then(()=>{
        ctx.body={code:Code.OK.code,msg:'套餐添加成功'};
    }).catch((error)=>{
        ctx.body={code:Code.InternalServerError.code,msg:'套餐添加失败',data:error};
    });
}

//体检额度套餐列表
module.exports.setMealList=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
    return;
    }
    let setMealDa=ctx.dao.main.enterprise.SetMeal;
    let option={
        where:{enterpriseId:params.enterpriseId},
        order: [
            ['money', 'asc']
        ],
        attributes:['id','money']       
    };
    let result=await setMealDa.findAll(option);
    if (result) {
        let items = [];
        result.forEach(function (item) {
            items.push({
                //money:"￥"+item.money+"元套餐",
                money:item.money,
                setMealId:item.id
            })
        }); 
        return ctx.body={code:Code.OK.code,msg:'获取成功',data:{
            items: items}
        };
    } 
    else{
        return ctx.body={code:Code.OK.code,msg:'获取成功，空数据',data:{
            items: []}
        };
    }
}

//体检额度套餐编辑
module.exports.setMealEdit=async (ctx,next)=>{
    ctx.checkParams('setMealId').notEmpty("体检额度套餐Id不能为空");
    ctx.checkBody('setMealMoney').notEmpty("体检额度名称不能为空");
    let body = ctx.request.body
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let setMealDa=ctx.dao.main.enterprise.SetMeal;
    await setMealDa.update(
        {
           money:body.setMealMoney
        },
        {
            where:{id:params.setMealId}
        }
    );
    ctx.body={code:Code.OK.code,msg:'编辑成功'};
    return;
}

//体检额度套餐删除
module.exports.setMealDelete=async (ctx,next)=>{
    ctx.checkParams('setMealId').notEmpty("体检额度id不能为空");
    let params = ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let setMealDa=ctx.dao.main.enterprise.SetMeal;
    await setMealDa.destroy({where:{id:params.setMealId}});
    ctx.body={code:Code.OK.code,msg:'删除成功'};
    return;
}

//部门额度套餐获取
module.exports.setMealDepartmentList=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    let resultEntDepartment=await entDepartmentDa.findAll({
        where:{
            enterpriseId:params.enterpriseId,
        },
        attributes:['name','id','money']
    });
    let items = [];
    if(resultEntDepartment){
        resultEntDepartment.forEach(function (item) {
            items.push({
                money: item.money,
                name:item.name,
                id:item.id,
            })
        }); 
        ctx.body={code:Code.OK.code,msg:'成功',items:items}
        return;
    }  
    else{
        ctx.body={code:Code.OK.code,msg:'成功',items:items};
        return;
    }
}

//部门额度套餐修改保存
module.exports.setMealDepartmentEdit=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('setMeals').notEmpty("套餐数组不能为空");//[{id:i,money:2}]
    let body = ctx.request.body
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let setMealArray=eval('(' + body.setMeals + ')'); 
    if(setMealArray.length<=0){
        errors='员工不能为空',
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }
    if(typeof(setMealArray)!='object'){
        errors='参数类型错误',
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    //批量修改
    if(setMealArray.length){
        setMealArray.forEach(async item => {
            await entDepartmentDa.update({
                money:item.money
            },{
               where:{id:item.id} 
            });
    });
    ctx.body={code:Code.OK.code,msg:'保存修改成功'};
    return;
    }
}
//添加计划之前的员工列表获取
module.exports.employeeListPhyPlan=async (ctx,next)=>{
    console.log("enter.........");
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let query=ctx.request.query;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
        return;
    }
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    let entEmployeeDa=ctx.dao.main.user.EntEmployee;
    let personalDa=ctx.dao.main.user.Personal;
    let accountDa=ctx.dao.main.user.Account;
    let perPage = query.perPage || 20;
    let page = query.page || 1;
    let include=[
        {
            //belongsTo 外键在源文件上 hasOne外键存在于目标文件上
            association:entEmployeeDa.belongsTo(personalDa, {foreignKey: 'accountId',
            targetKey: 'accountId'}),
            required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            attributes:[ 'name' ,'accountId'],
            include:{
                association:personalDa.belongsTo(accountDa,{foreignKey: 'accountId',
                targetKey: 'id'}),
                required: false,
                attributes: ['active','phoneNumber','email'], //企业名称
            }
        },
        {
           association:entEmployeeDa.belongsTo(entDepartmentDa, {foreignKey: 'departmentId',
           targetKey: 'id'}),
           required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
           attributes:[ 'name','money'],
        },
    ];
    let option={
        page: page,
        perPage: perPage,
        where:{
            enterpriseId:params.enterpriseId,
            deletedAt: {
                '$eq': null              // deletedAt IS NULL
            }
        },
        order: [
            ['id', 'asc']
        ],
        raw: true, // 设置为 true，即可返回源数据
        distinct: true,
        options:{ 
            include:include
        },
        attributes:[
            'id'
        ]       
    };
    //搜索传入的部门id
    if(query.departmentId){
        option.where.departmentId=query.departmentId;
    }
    
    //option.where.deletedAt = { [Op.not] : 1}
    let paginate=await entEmployeeDa.paginate(option)
    let items = [];
    if (paginate.items && paginate.items.length > 0) {
        paginate.items.forEach(function (item) {
            console.log(JSON.stringify(item));
            items.push({
                entEmployeeId:item.id,//员工关系表中的id值
                employeeName: item['Personal.name'],
                // phoneNumber: item['Personal.phoneNumber'],
                phoneNumber: item['Personal.Account.phoneNumber'],
                email: item['Personal.Account.email'],
                employeeAccountId:item['Personal.accountId'],//员工用户id，
                //money: "￥"+item['EntDepartment.money']+" 元套餐",//套餐名称
                money:item['EntDepartment.money'],//套餐名称
                departmentName: item['EntDepartment.name'],
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

//确认创建计划
module.exports.phyPlanCreate=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('phyPlanName').notEmpty("体检计划名称不能为空");
    ctx.checkBody('employees').notEmpty("员工数组不能为空");
    //ctx.checkBody('planDate').notEmpty("体检计划时间不能为空");
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg,errors:errors};
        return;
    }
    let employeeArray=eval('(' + body.employees + ')'); 
    if(employeeArray.length<=0){
        errors='员工不能为空',
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }
    if(typeof(employeeArray)!='object'){
        errors='参数类型错误',
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }
    let physicalExamiantionPlanDa=ctx.dao.main.enterprise.PhyExamiantionPlan;
    let physicalEmployeePlanDa=ctx.dao.main.enterprise.PhyEmployeePlan;
    //判断该计划名称是否已经存在了
    let resultPhyPlanCheck=await physicalExamiantionPlanDa.findOne({where:{
        name:body.phyPlanName
    }})
    if(resultPhyPlanCheck){
        errors='同名体检计划已存在',
        ctx.body={code:Code.OK.code,msg:errors};
        return;
    }
    //ctx.main 等同于在中间件中赋值的sequelize
    ctx.main.transaction(async function(t){
        //创建计划逻辑 首先在计划表中插入计划    
        let resultPhyPlan= await physicalExamiantionPlanDa.create({ 
            enterpriseId:params.enterpriseId,
            name:body.phyPlanName,
            planDate:body.planDate,
            employeeNumber:employeeArray.length,
        }, {transaction: t} );
        //然后在计划员工中间表中批量插入中间值
        let authArrays = [];
        if(employeeArray.length){
            employeeArray.forEach(item => {
                let obj = {
                    money:item.money,
                    employeeId:item.employeeId,
                    phyPlanId: resultPhyPlan.id
                };
                authArrays.push(obj);
            });
            let result= await physicalEmployeePlanDa.bulkCreate(authArrays,{transaction:t});
            return Promise.resolve(result);
        }    
    }).catch(function(err){
        console.log('还是到达了这'+JSON.stringify(err));
    });
    ctx.body={code:Code.OK.code,msg:'体检计划创建成功'};
}

//获取体检计划(历史)列表
module.exports.phyPlanList=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let query=ctx.request.query;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg,errors:errors};
        return;
    }

    let physicalExamiantionPlanDa=ctx.dao.main.enterprise.PhyExamiantionPlan;
    let perPage = query.perPage || 20;
    let page = query.page || 1;
    let option={
        page: page,
        perPage: perPage,
        where:{
            enterpriseId:params.enterpriseId,
            deletedAt: {
                '$eq': null              // deletedAt IS NULL
            }
        },
        order: [
            ['id', 'asc']
        ],
        /*raw: true, // 设置为 true，即可返回源数据
        distinct: true,*/
        attributes:[
            'id','name','payout','status','createdAt','employeeNumber'
        ]     
    }
    let paginate= await physicalExamiantionPlanDa.paginate(option);
    let items = [];
    if (paginate.items && paginate.items.length > 0) {
        paginate.items.forEach(function (item) {
            console.log(JSON.stringify(item));
            items.push({
                id:item.id,//员工关系表中的id值
                name: item.name,
                payout: item.payout,//体检支出
                status:item.status,//员工用户id，
                createdAt: item.createdAt,//时间
                employeeNumber: item.employeeNumber,//体检人数
                //保留两位小数且不四舍五入
                averageLimit:(item.payout/item.employeeNumber).toFixed(2), //人均额度
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

//已创建计划对应的成员列表获取 用于修改已创建计划中的成员
module.exports.employeeListPhyPlanEdit=async (ctx,next)=>{
    ctx.checkParams('phyPlanId').notEmpty("体检计划id不能为空");
    ctx.checkBody('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg,errors:errors};
        return;
    }
    let physicalExamiantionPlanDa=ctx.dao.main.enterprise.PhyExamiantionPlan;
    let physicalEmployeePlanDa=ctx.dao.main.enterprise.PhyEmployeePlan;
    let entDepartmentDa=ctx.dao.main.user.EntDepartment;
    let entEmployeeDa=ctx.dao.main.user.EntEmployee;
    let personalDa=ctx.dao.main.user.Personal;
    let accountDa=ctx.dao.main.user.Account;
    
    let perPage = query.perPage || 20;
    let page = query.page || 1;
    let include=[
        {
            //belongsTo 外键在源文件上 hasOne外键存在于目标文件上
            association:entEmployeeDa.belongsTo(personalDa, {foreignKey: 'accountId',
            targetKey: 'accountId'}),
            required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            attributes:[ 'name','phoneNumber','accountId'],
            include:{
                association:personalDa.belongsTo(accountDa,{foreignKey: 'accountId',
                targetKey: 'id'}),
                required: false,
                attributes: ['active'], //企业名称
            }
        },
        {
           association:entEmployeeDa.belongsTo(entDepartmentDa, {foreignKey: 'departmentId',
           targetKey: 'id'}),
           required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
           attributes:[ 'name','money'],//这里查出的套餐金额是部门金额
        },
        {
            //外键在目标文件中
            association:entEmployeeDa.hasOne(physicalEmployeePlanDa,{foreignKey: 'departmentId',
            targetKey: 'id'}),
            required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            attributes:['money'],//这里查出的是对应的员工目前的金额
            where:{
                phyPlanId:params.phyPlanId
            }
        }
    ];
    let option={
        page: page,
        perPage: perPage,
        where:{
            enterpriseId:body.enterpriseId,
            deletedAt: {
                '$eq': null              // deletedAt IS NULL
            }
        },
        order: [
            ['id', 'asc']
        ],
        raw: true, // 设置为 true，即可返回源数据
        distinct: true,
        options:{ 
            include:include
        },
        attributes:[
            'id'
        ]       
    };    
    let paginate=await entEmployeeDa.paginate(option)
    let items = [];
    if (paginate.items && paginate.items.length > 0) {
        paginate.items.forEach(function (item) {
            items.push({
                entEmployeeId:item.id,//员工关系表中的id值
                employeeName: item['Personal.name'],
                phoneNumber: item['Personal.phoneNumber'],
                employeeAccountId:item['Personal.accountId'],//员工用户id，
                departmentMoney: "￥"+item['EntDepartment.money']+" 元套餐",//部门套餐名称
                //employeeMoney:"￥"+item['PhysicalEmployeePlan.money']+" 元套餐",//员工个人套餐名称
                employeeMoney:item['PhysicalEmployeePlan.money'],//员工个人套餐名称
                epartmentName: item['EntDepartment.name'],
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

//体检计划修改--未创建订单前均可修改
module.exports.phyPlanEdit=async (ctx,next)=>{
    ctx.checkParams('phyPlanId').notEmpty("体检计划id不能为空");
    ctx.checkBody('phyPlanName').notEmpty("体检计划名称不能为空");
    ctx.checkBody('employees').notEmpty("员工数组不能为空");
    //ctx.checkBody('planDate').notEmpty("体检计划时间不能为空");
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg,errors:errors};
        return;
    }
    let employeeArray=eval('(' + body.employees + ')'); 
    if(employeeArray.length<=0){
        errors='员工不能为空',
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }
    if(typeof(employeeArray)!='object'){
        errors='参数类型错误',
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }
    let physicalExamiantionPlanDa=ctx.dao.main.enterprise.PhyExamiantionPlan;
    let physicalEmployeePlanDa=ctx.dao.main.enterprise.PhyEmployeePlan;
    
    //在计划员工中间表中批量插入中间值
    let authArrays = [];
    if(employeeArray.length){
        employeeArray.forEach(item => {
            let obj = {
               money:item.money,
               employeeId:item.employeeId,
               phyPlanId: params.phyPlanId
        }
    authArrays.push(obj);
    });
    (async function () {
    for(var i=0;i<authArrays.length;i++){
        //打印数组中的情况，便于跟踪数组中数据的变化
        console.log(i+"="+authArrays[i]);
        //判断有的员工有相同的计划，相同的套餐，不插入了，直接从authArrays中删除掉
        let resultMoney=await physicalEmployeePlanDa.findOne(
            {where:{
                employeeId:item.employeeId,
                phyPlanId:item.phyPlanId,
                money:item.money
            }
        });
        if(resultMoney){
             //注意对比这行代码：删除元素后调整i的值
            await authArrays.splice(i--,1);
        }
        //判断如果有的员工有相同的计划，但是不同的套餐，则直接更新套餐
        let result=await physicalEmployeePlanDa.findOne(
            {where:{
                employeeId:item.employeeId,
                phyPlanId:item.phyPlanId,
            }
        });
        if(result){
            await physicalEmployeePlanDa.update({
                money:item.money
            },{
                where:{employeeId:item.employeeId,phyPlanId:item.phyPlanId,}
            })
        }
    }
    })();
    await physicalEmployeePlanDa.bulkCreate(authArrays);
    //判断更新的计划名称是否已经存在了
    let resultPhyPlanCheck=await physicalExamiantionPlanDa.findOne({where:{
        name:body.phyPlanName
    }})
    if(resultPhyPlanCheck){
        errors='同名体检计划已存在,请更换名称',
        ctx.body={code:Code.OK.code,msg:errors};
        return;
    }
    //更新计划表中数据
    await physicalExamiantionPlanDa.update({
        enterpriseId:params.enterpriseId,
        name:body.phyPlanName,
        planDate:body.planDate,
        employeeNumber:employeeArray.length,
    },{where:{
        id:params.phyPlanId
    }})
    ctx.body= {
        code:Code.OK.code,msg:'体检计划修改成功'};
    return;
    }
} 



//体检计划作废
module.exports.phyPlanDelete=async (ctx,next)=>{
    ctx.checkParams('phyPlanId').notEmpty("体检计划id不能为空");
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg,errors:errors};
        return;
    }
    let physicalExamiantionPlanDa=ctx.dao.main.enterprise.PhyExamiantionPlan;
    let physicalEmployeePlanDa=ctx.dao.main.enterprise.PhyEmployeePlan;
    //计划表中计划删除 员工对应的该计划也删除掉
    await physicalExamiantionPlanDa.update({
        deletedAt:new Date()
    },
        {where:{id:params.phyPlanId}
    });
    //删除计划id为这个值的所有数据 查询所有，遍历删 查询员工额度接口时候要查没删除的
    let result=await physicalEmployeePlanDa.findAll({where:{
        phyPlanId:params.phyPlanId
    }})
    if (result) {
        await result.forEach(async function (item) {
            await physicalEmployeePlanDa.update({
                deletedAt:new Date()
            },{
                where:{phyPlanId:item.phyPlanId}
            })
        }); 
    } 
    ctx.body= {
        code:Code.OK.code,msg:'作废成功'
    };
    
    return;
}

//体检计划首页基础数据返回-首页只返回最近创建的五个计划
module.exports.phyPlanHome=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let body=ctx.request.body;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg,errors:errors};
        return;
    }
    let physicalExamiantionPlanDa=ctx.dao.main.enterprise.PhyExamiantionPlan;
    let physicalEmployeePlanDa=ctx.dao.main.enterprise.PhyEmployeePlan;
    let setMealDa=ctx.dao.main.enterprise.SetMeal;
    let cycleRemindDa=ctx.dao.main.enterprise.CycleRemind;
    //查询最近创建的计划  asc升序排列 desc降序
    let resultPhyPlan=await physicalExamiantionPlanDa.findOne({
        where:{
            enterpriseId:params.enterpriseId,
            deletedAt: {
                '$eq': null              // deletedAt IS NULL
            }
        },
        order: [
            ['id', 'desc']//asc升序 desc降序
        ],
    })
    let physicalExamiantionPlan={};
    if(resultPhyPlan){
        physicalExamiantionPlan.name=resultPhyPlan.name;
        //金额 状态 时间 体检名称 体检人数
        physicalExamiantionPlan.sumMoney=resultPhyPlan.payout;
        physicalExamiantionPlan.employeeNumber=resultPhyPlan.employeeNumber;
        physicalExamiantionPlan.createdAt=resultPhyPlan.createdAt;
        physicalExamiantionPlan.status=resultPhyPlan.status;
    }else{
        physicalExamiantionPlan={}
    }
    //查询企业的套餐是否配置
    let setMeal={};
    let resultSetMeal=await setMealDa.findOne({
        where:{
            enterpriseId:params.enterpriseId,
        },
    })
    if(resultSetMeal){
        setMeal.settingStatus='已设置'
    }else{
        setMeal.settingStatus='未设置'
    };
    //查询企业设置的体检周期
    let cycleRemind={};
    let resultCycleRemind=await cycleRemindDa.findAll({
       where:{enterpriseId:params.enterpriseId}
    })
    if(resultCycleRemind){
        let items=[]
        resultCycleRemind.forEach(item=>{
            items.push({
                cycle:item.cycle,//周期倍数
                cyclePeriod:item.cyclePeriod,//周期单位
            })
        });
        cycleRemind.items=items;
    }else{
        cycleRemind={}
    }
    //查询最近的5个体检计划
    let physicalExamiantionPlanList={};
    let option={
        where:{
            enterpriseId:params.enterpriseId,
            deletedAt: {
                '$eq': null              // deletedAt IS NULL
            }
        },
        offset: 1, //跳过前一条数据
        limmit:5,//获取其后的5条数据
        order: [
            ['id', 'asc']
        ],
        attributes:[
            'id','name','payout','status','createdAt','employeeNumber'
        ]     
    }
    let result= await physicalExamiantionPlanDa.findAll(option);
    if(result){
        let items=[];
        result.forEach(async item=>{
            items.push({
                id:item.id,//员工关系表中的id值
                name: item.name,
                payout: item.payout,//体检支出
                status:item.status,//员工用户id，
                createdAt: item.createdAt,//时间
                employeeNumber: item.employeeNumber,//体检人数
                averageLimit:item.payout/item.employeeNumber,//人均额度
            })
        });
        physicalExamiantionPlanList.items=items;
    }else{
        physicalExamiantionPlanList={};
    }
    ctx.body= {
        code:Code.OK.code,msg:'体检计划首页获取成功',data:{
            physicalExamiantionPlan,setMeal,cycleRemind,physicalExamiantionPlanList}
        }
    return;
}