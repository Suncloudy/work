'use strict'

const {Code} = require('../../../../libs/consts');
const {tool} = require('../../../../libs/utils');

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
    let messageIds  =ctx.params.messageIds.split(',');
    if(!messageIds  && messageIds.length<=0){
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg};
    }else{
        return ctx.main.transaction(t => {
            let message= ctx.dao.main.user.Message;
            let messageIds  =ctx.params.messageIds.split(',');
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
