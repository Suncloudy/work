'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');

//获取所有周期
module.exports.cycleRemindList=async(ctx,next)=>{
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
    return;
    }
    let setMealDa=ctx.dao.main.enterprise.SetMeal;

}
//企业体检周期提醒设置-批量插入  //单位一个字段，cycles 都好分隔一个字段
module.exports.cycleRemindSetting=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    ctx.checkBody('cyclePeriod').notEmpty("周期类型不能为空");
    ctx.checkBody('cycles').notEmpty("周期倍数不能为空");
    let body = ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let transCycles = body.cycles.split(",");// 在每个逗号(,)处进行分解  ["abc", "abcd", "aaa"]
    /*console.log('体检周期参数',body.cycles);
    console.log('体检周期参数类型',typeof(body.cycles))
    if(body.employees.length<=0){
        errors='体检周期提醒数组不能为空',
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }
    if(typeof(body.employees)!='object'){
        errors='cycles类型不对',
        ctx.body={code:Code.BadRequest.code,msg:errors};
        return;
    }*/
    let cycleRemindDa=ctx.dao.main.enterprise.CycleRemind;
   //在周期表中插入选择的周期list
    let authArrays = [];
    if(transCycles.length){
        transCycles.forEach(item => {
            console.log('哈哈item',item)
            let obj = {
                cycle:item,
                cyclePeriod:body.cyclePeriod,
                enterpriseId:params.enterpriseId,
        }
    authArrays.push(obj);
    });
  
    /*(async function () {
    for(var i=0;i<authArrays.length;i++){
        //打印数组中的情况，便于跟踪数组中数据的变化
        console.log(i+"="+authArrays[i]);
        let result=await cycleRemindDa.findOne(
            {where:{
                enterpriseId:params.enterpriseId,
                cycle:authArrays[i].cycle,
                cyclePeriod:authArrays[i].cyclePeriod
            }
        });
        //如果已经有了，删除arrays里面对应的这条
        if(result){
            authArrays.splice(i--,1)
        }
    }
    //这个方法与下面的区别
    })();*/  
    for(var i=0;i<authArrays.length;i++){
        //打印数组中的情况，便于跟踪数组中数据的变化
        console.log(i+"="+authArrays[i]);
        let result=await cycleRemindDa.findOne(
            {where:{
                enterpriseId:params.enterpriseId,
                cycle:authArrays[i].cycle,
                cyclePeriod:authArrays[i].cyclePeriod
            }
        });
        //如果已经有了，删除arrays里面对应的这条
        if(result){
            authArrays.splice(i--,1)
        }
    }
    await cycleRemindDa.bulkCreate(authArrays);
    ctx.body={code:Code.OK.code,msg:'周期设置成功'
    };
    return;
}
}
//企业体检周期提醒获取
module.exports.cycleRemindGet=async (ctx,next)=>{
    ctx.checkParams('enterpriseId').notEmpty("企业id不能为空");
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
    return;
    }
    let cycleRemindDa=ctx.dao.main.enterprise.CycleRemind;
    let option={
        where:{enterpriseId:params.enterpriseId},
        order: [
            ['id', 'asc']
        ],
        attributes:['cycle','cyclePeriod']       
    };
    let result=await cycleRemindDa.findAll(option);
    if (result) {
        let items = [];
        result.forEach(function (item) {
            items.push({
                cycle:item.cycle,//周期倍数
                cyclePeriod:item.cyclePeriod,//周期类型
            })
        }); 
        return ctx.body={code:Code.OK.code,msg:'获取成功',data:{
            items: items}
        };
    } 
    else{
        return ctx.body={code:Code.OK.code,msg:'获取成功，暂未设置周期提醒',data:{
            items: []}
        };
    }
}
