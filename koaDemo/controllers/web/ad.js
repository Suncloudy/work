const Op = require('sequelize').Op;
const {Code, User, Catalog} = require('../../libs/consts');

/**
* 商品广告位
*/
exports.products = async (ctx, next) => {
  
  let limit = ctx.query.quantity?parseInt(ctx.query.quantity):config.limit;

  let where = {placement: ctx.params.placement};
  let attributes = ['id', 'productType', 'isGroupProduct','sales', 'parentGroupProductId', 'name', 'simpleDescription', 'marketPrice', 'salePrice', 'createdAt'];
  let include = [{
    model: ctx.dao.main.catalog.Product,
    required: true,
    attributes,
    where: {visibleIndividually:true, published:true},
    include: [{
      model: ctx.dao.main.common.File,
      attributes: ['id', 'url', 'name', 'size']
    }]
  }]

  let items = await ctx.dao.main.common.Ad.findAll({where, include, order:[['displayOrder', 'ASC']]});

  items = items.map((item) => {
    return item.format(); 
  });
  ctx.body = {
    code: Code.OK.code, 
    msg: Code.OK.msg,
    data: items
  }
}

