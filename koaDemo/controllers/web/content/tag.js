
'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');

/**
 * 获取标签列表
 */
module.exports.getTagItems=async (ctx,next)=>{
    let displayOrder=ctx.request.query.displayOrder||'desc',
    Op=ctx.main.Op,
    tag=ctx.dao.main.content.Tag;
    let option={
        where:{
            deletedAt:{
                [Op.eq]:null,
            }
        },
         order:[['displayOrder',`${displayOrder}`]]
    };
    await tag.findAll(option).then(res=>{
        ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:res};
    }).catch(error=>{
        ctx.body={code:Code.InternalServerError.code,msg:Code.InternalServerError.msg,data:null};
    });
    
   
}