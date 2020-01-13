
/** 文章相关  */
'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');

/**获取文章 */
module.exports.getArticleItems=async(ctx,next) =>{
    let Op = ctx.main.Op;
    let article= ctx.dao.main.content.Article;
    let tag=ctx.dao.main.content.Tag;
    let articleTagMapping = ctx.dao.main.content.ArticleTagMapping;
    let file = ctx.dao.main.common.File;
    let include=[ 
        {
            association:article.hasMany(articleTagMapping,{
                foreignKey:'articleId',targetKey:'id'
            }),
            where:{},
            required: false,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            include: {
                association:articleTagMapping.belongsTo(tag,{
                    foreignKey:'tagId',targetKey:'id'
                }),
                required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
                attributes:[ 'id','name','displayOrder'],
            },
        },{
            association:article.belongsTo(file,{
                foreignKey:'coverFileId',targetKey:'id'
            }),
            require:true,
            attributes:['url']
        }
    ];
    if(ctx.request.query.tagId){
        include[0].where.tagId={
            [Op.eq]:ctx.request.query.tagId
        }
    }
    //按照浏览量降序排序 （热门文章）
    let option = {
        page:ctx.request.query.page||1,
        perPage:ctx.request.query.perPage||10,
        where:{
            deletedAt:{
                [Op.eq]: null,    
            }
        },
        order:[['id','desc']],
        options:{
            include:include
        }
    };
    let result = await article.paginate(option).catch(error=>{
        ctx.body={ code:Code.InternalServerError.code, msg:Code.InternalServerError.msg, data:null };
    });
    ctx.body={ code:Code.OK.code, msg:Code.OK.msg, data:result };
}

/**获取热门文章 */
module.exports.getHotArticleItems=async(ctx,next) =>{
    let Op = ctx.main.Op;
    let article= ctx.dao.main.content.Article;
    let tag=ctx.dao.main.content.Tag;
    let articleTagMapping = ctx.dao.main.content.ArticleTagMapping;
    let file = ctx.dao.main.common.File;
    let include=[ 
        {
            association:article.hasMany(articleTagMapping,{
                foreignKey:'articleId',targetKey:'id'
            }),
            where:{},
            required: false,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
            include: {
                association:articleTagMapping.belongsTo(tag,{
                    foreignKey:'tagId',targetKey:'id'
                }),
                required: true,//true 内连接全部查出来 false外连接，关联后的左边的或者右边的查出来
                attributes:[ 'id','name','displayOrder'],
            },
        },{
            association:article.belongsTo(file,{
                foreignKey:'coverFileId',targetKey:'id'
            }),
            require:true,
            attributes:['url']
        }
    ];
    if(ctx.request.query.tagId){
        include[0].where.tagId={
            [Op.eq]:ctx.request.query.tagId
        }
    }
    //按照浏览量降序排序 （热门文章）
    let option = {
        page:ctx.request.query.page||1,
        perPage:ctx.request.query.perPage||10,
        where:{
            deletedAt:{
                [Op.eq]: null,    
            }
        },
        order:[['pageviews','desc']],
        options:{
            include:include
        }
    };
    let result = await article.paginate(option).catch(error=>{
        ctx.body={ code:Code.InternalServerError.code, msg:Code.InternalServerError.msg, data:null };
    });
    ctx.body={ code:Code.OK.code, msg:Code.OK.msg, data:result };
}


//获取文章信息
module.exports.articleInfo=async(ctx,next)=>{
    if(!ctx.params.id){
        ctx.body={code:Code.BadRequest.code,msg:Code.BadRequest.msg,data:null};
    }
    let article = ctx.dao.main.content.Article,
    articleTagMapping=ctx.dao.main.content.ArticleTagMapping,
    tag=ctx.dao.main.content.Tag;
    let file = ctx.dao.main.common.File;
    //更新浏览数
    let resourArticle = await article.findOne({
        where:{
            id:ctx.params.id
        }
    });
    resourArticle.pageviews+=1;
    await resourArticle.save();
    let include = [
        {
            association:article.hasMany(articleTagMapping,{
                foreignKey:'articleId',targetKey:'id'
            }),
            required:true,
            include:{
                association:articleTagMapping.belongsTo(tag,{
                    foreignKey:'tagId',targetKey:'id'
                }),
                require:true,
                attributes:['id','name','displayOrder']
            }
        },{
            association:article.belongsTo(file,{
                foreignKey:'coverFileId',targetKey:'id'
            }),
            require:true,
            attributes:['url']
        }
    ];
    let option = {
        where:{
            id:ctx.params.id
        },
        include:include
    };
    await article.findOne(option).then(res=>{
        ctx.body={ code:Code.OK.code, msg:Code.OK.msg,data:res };
    }).catch(error=>{
        ctx.body={ code:Code.InternalServerError.code, msg:Code.InternalServerError.msg, data:null };
    });
}