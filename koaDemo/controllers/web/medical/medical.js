'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');

//获取体检中心列表
module.exports.centers=async (ctx,next)=>{
    ctx.checkQuery('province').notEmpty("省份不能为空");
    // ctx.checkQuery('city').notEmpty("市不能为空");
    // ctx.checkQuery('county').notEmpty("区县不能为空");
    // ctx.checkQuery('overAll').notEmpty("综合不能为空"); //true  或者false
    // ctx.checkQuery('distance').notEmpty("距离排序不能位空");//desc 或者 asc
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let ops={ 
        page: ctx.request.query.page || 1,
        perPage: ctx.request.query.perPage || 10,
        options:{
            include:[
                {
                    model:ctx.dao.main.catalog.Manufacturer,
                    required:true,
                    include:[
                        {
                            model:ctx.dao.main.common.File,
                            required:true,
                            attributes:[['url','manufacturer']], 
                        }
                    ],
                    attributes:[ "id", "name","description"],
                    where:{}
                },
                {
                    model:ctx.dao.main.common.File,
                    as:"LocationFile",
                    required:true,
                    attributes:['url']
                },
                {
                    model:ctx.dao.main.medical.Organization,
                    required:true,
                    attributes:['id','name'],
                }
            ]
        }, 

        attributes:['latitude','longitude','distance','products','county','productLowerPrice','packages','city','province','type'], 
        where:{
            province:{$eq:decodeURIComponent(ctx.request.query.province)},
            // city:{$eq:decodeURIComponent(ctx.request.query.city)},
            // county:{$eq:decodeURIComponent(ctx.request.query.county)},
        },
        order:[]
    };
    if(ctx.request.query.name){
        ops.options.include[0].where.name={[Op.like]:`%${encodeURIComponent(ctx.request.query.name)}%`}
    }
    if(ctx.request.query.overAll){
        ops.order.push(['products',`${ctx.request.query.overAll==true?'desc':'asc'}`]);
    }else{
        ops.order.push(['products','desc']);
    }
    if(ctx.request.query.distance){
        ops.order.push(['distance',`${ctx.request.query.distance}`]);
    }else{
        ops.order.push(['distance',`asc`]);
    }

    if(ctx.request.query.city){
        ops.where.city={$eq:ctx.request.query.city};
    }
    if(ctx.request.query.county){
        ops.where.county={$eq:ctx.request.query.county};
    }
    if(ctx.request.query.type){
        ops.where.type={$eq:ctx.request.query.type};
    }
    let result=await ctx.dao.main.medical.Center.paginate(ops);
    //计算距离
    if(ctx.request.query.latitude && ctx.request.query.longitude){
        result.items.forEach(element => {
            element.distance=tool.getDistance(ctx.request.query.latitude,ctx.request.query.longitude,element.latitude,element.longitude);
        });
    }
    ctx.body = {code: Code.OK.code, msg: Code.OK.msg,data: result};
}

//获取体检信息明细
module.exports.centersInfo=async(ctx,next)=>{
    ctx.checkParams('manufacturerId').notEmpty("manufacturerId不能为空");
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    } 
    let ops={ 
        include:[
            {
                model:ctx.dao.main.catalog.Manufacturer,
                required:true,
                include:[
                    {
                        model:ctx.dao.main.common.File,
                        required:true,
                        attributes:[['url','manufacturer']], 
                    }
                ],
            },
            {
                model:ctx.dao.main.common.File,
                as:"LocationFile",
                required:true,
                attributes:['url']
            },
            {
                model:ctx.dao.main.medical.Organization,
                required:true,
            }
        ],
        where:{
            manufacturerId:{$eq:ctx.params.manufacturerId}
        }
    };
    let result=await ctx.dao.main.medical.Center.findOne(ops);
    //获取所有的套餐
    let exaPacProList = await ctx.dao.main.medical.ExaminationPackage.paginate({
        options:{
            include: [
                {
                    association:ctx.dao.main.medical.ExaminationPackage.belongsTo(ctx.dao.main.catalog.Product,{
                        foreignKey:"productId",targetKey:"id"
                    }), 
                    required:true,
                    attributes:['marketPrice','salePrice'],
                    include:[
                        {
                            model:ctx.dao.main.common.File,
                            required:true,
                            attributes:[['url','productImg']], 
                        },
                    ],
                }, 
                {
                    model:ctx.dao.main.medical.ExaminationItem, 
                    through:ctx.dao.main.medical.ExaminationPackageItemMapping,
                    as:"ExaminationPackageItems",
                }
            ]
        },
        where:{
            manufacturerMedicalCenterId:{$eq:ctx.params.manufacturerId}
        },
        attributes:['gender','description','name','id','productId']
    });
    result.dataValues.examinationPackages = exaPacProList;
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:result};
}