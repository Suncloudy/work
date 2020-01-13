'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');


//商品加入购物车
module.exports.shopCarAdd=async (ctx,next)=>{
    ctx.checkParams('userId').notEmpty("用户id不能为空");
    ctx.checkBody('productIds').notEmpty("商品id数组不能为空");//例如商品id 1，2，3
    let body = ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
    let productArray=body.productIds.split(",");
    let shopCarDa=ctx.dao.main.order.ShopCar;
    let personalDa=ctx.dao.main.user.Personal;
    //判断用户id是否存在
    let resultPersonal=personalDa.findOne({
        accountId:params.userId
    });
    if(resultPersonal){
        //购物车添加逻辑，判断该用户购物车中是否有该商品 
        //有该商品 数量加1  无该商品表中添加数据 商品数量有一个最大值 200
        productArray.forEach(async item => {
            let resultShopCar=await shopCarDa.findOne({
                where:{
                    userId:params.userId,
                    productId:item,
                }
            });
            if(resultShopCar){
                let number=await resultShopCar.number+1;
                await shopCarDa.update({
                    number:number,
                    updatedOn:new Date(),
                },{where:{
                    userId:params.userId,
                    productId:item,
                }})
                ctx.body={code:Code.OK.code,msg:'添加购物车成功'};
                return;
            }else{
                await shopCarDa.create({
                    userId:params.userId,
                    productId:item,
                    number:1,
                })
                ctx.body={code:Code.OK.code,msg:'添加购物车成功'};
                return;
            }
        });
    }else{
        ctx.body={code:BadRequest.codee,msg:'用户不存在'};
        return;
    }
}


//商品购物车列表获取
module.exports.shopCarList=async (ctx,next)=>{
    ctx.checkParams('userId').notEmpty("用户id不能为空");
    let query = ctx.request.query
    let params=ctx.params;
    let page = query.page || 1
    let perPage = query.perPage || 20
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }
  
    let shopCarDa=ctx.dao.main.order.ShopCar;
    let productDa=ctx.dao.main.product.Product;

    let include=[
        {
            //belongsTo 外键在源文件上 hasOne外键存在于目标文件上
            association:shopCarDa.belongsTo(productDa, {foreignKey: 'productId',
            targetKey: 'id'}),//套餐与机构关联 查询套餐的所有机构
            required: false,//true 内连接全部查出来 false外连接，关联后的左边
            attributes:[ 'name','marketPrice','discountPrice','image'],
        },
    ];

    let option={
        page: page,
        perPage: perPage,
          //注意deleted不要查询出来
        where:{
            userId:params.userId,
            deletedAt: {
                 '$eq': null              // deletedAt IS NULL
            },
        },
        order: [
            ['id', 'asc']
        ],
        options:{ 
            include:include
        },
        attributes:[
            'number'
        ]    
    }
    let paginate=await shopCarDa.paginate(option)
    let items = [];
    if (paginate.items && paginate.items.length > 0) {
        paginate.items.forEach(async function (item) {
            console.log('购物车列表',item);
            items.push({
                name:item.Product.name,
                marketPrice:item.Product.marketPrice,
                discountPrice:item.Product.discountPrice,
                image:item.Product.image,
                number:item.number,
            })
        });
    }
    ctx.body= {
        code:Code.OK.code,msg:'购物车列表获取成功',data:{
            items:items
        }
    };
    return;
}


//商品购物车清除
module.exports.shopCarDrop=async (ctx,next)=>{
    ctx.checkParams('userId').notEmpty("用户id不能为空");
    ctx.checkBody('productIds').notEmpty("商品id数组不能为空");//例如商品id 1，2，3
    let body = ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
        return;
    }

    let productArray=body.productIds.split(",");
    let shopCarDa=ctx.dao.main.order.ShopCar;
    let personalDa=ctx.dao.main.user.Personal;
    
     //判断用户id是否存在
     let resultPersonal=personalDa.findOne({
        accountId:params.userId
    });
    if(resultPersonal){
        //购物车添加逻辑，判断该用户购物车中是否有该商品 
        //有该商品 数量加1  无该商品表中添加数据 商品数量有一个最大值 200
        productArray.forEach(async item => {
            let resultShopCar=await shopCarDa.findOne({
                where:{
                    userId:params.userId,
                    productId:item,
                }
            });
            if(resultShopCar){
                await shopCarDa.update({
                    deletedAt:new Date(),
                    updatedOn:new Date(),
                },{where:{
                    userId:params.userId,
                    productId:item,
                }})
                ctx.body={code:Code.OK.code,msg:'购物车移除成功'};
                return;
            }else{
              
            }
        });
    }else{
        ctx.body={code:BadRequest.codee,msg:'用户不存在'};
        return;
    }
}
