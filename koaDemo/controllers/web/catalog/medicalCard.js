const Op = require('sequelize').Op;
const {Code, User, Catalog} = require('../../../libs/consts');

const attributes = ['id', 'productType', 'isGroupProduct', 'parentGroupProductId', 'name','sales','discount', 'simpleDescription', 'imageFileId', 'marketPrice', 'salePrice', 'displayOrder']
/**
* 分页查询
*/ 
exports.pagination = async (ctx, next) => {
  ctx.checkQuery('sort').empty().in(['price-asc', 'price-desc', 'sales-asc', 'sales-desc']);
  ctx.checkQuery('age').empty().in(['0-18', '18-35', '35-45', '45-60', '60-100']);
  ctx.checkQuery('gender').empty().in(['0','1', '2']);
  ctx.checkQuery('price').empty().in(['0-300', '300-500', '500-800', '800-10000']);
 
  let errors;
  if(ctx.errors) {
  	errors = ctx.errors;
  	ctx.body = {
    	code: Code.BadRequest.code,
    	msg: Code.BadRequest.msg,
    	errors
  	}
  	return;
  }
  
  let perPage = ctx.request.query.quantity?parseInt(ctx.request.query.quantity):config.limit;
  let page = ctx.request.query.page?parseInt(ctx.request.query.page):1;
 	
 	let where = {productType: Catalog.productType.medicalCard, published:true};
  if(ctx.request.query.price) {
    where.salePrice = {[Op.and]:[{[Op.gte]: parseInt(ctx.request.query.price.split('-')[0])}, {[Op.lt]: parseInt(ctx.request.query.price.split('-')[1])}]}
  }
  if(ctx.request.query.type||ctx.request.query.item) {
    let ids = [];
    if(ctx.request.query.type) {
      let typeProducts = await ctx.dao.main.medical.ExaminationPackageTypeMapping.findAll({
        where: {examinationPackageTypeId:ctx.request.query.type}, 
        include: [{
          model: ctx.dao.main.medical.ExaminationPackage,
          required: true,
          attributes: ['productId'],
          where: {productId:{[Op.not]:null}}
        }]
      });
      ids = typeProducts.map((item) => { return item.MedicalExaminationPackage.productId });
    }
    if(ctx.request.query.item) {
      let itemProducts = await ctx.dao.main.medical.ExaminationPackageItemMapping.findAll({
        where: {examinationItemId:ctx.request.query.item}, 
        include: [{
          model: ctx.dao.main.medical.ExaminationPackage,
          required: true,
          attributes: ['productId'],
          where: {productId:{[Op.not]:null}}
        }]
      });
      if(ctx.request.query.type) {
        if(ids.length>0) {
          ids = ids.concat(itemProducts.map((item) => { return item.MedicalExaminationPackage.productId }));
        }
      } else {
        ids = itemProducts.map((item) => { return item.MedicalExaminationPackage.productId });
      }
    }
    where.id = {[Op.in]:[...new Set(ids)]}
  }
  let packageWhere = {};
  if(ctx.request.query.age) {
    let minAge = parseInt(ctx.request.query.age.split('-')[0]);
    let maxAge = parseInt(ctx.request.query.age.split('-')[1]);
    // packageWhere.minAge = [{[Op.gte]: minAge}, {[Op.lt]: maxAge}];
    // packageWhere.maxAge = [{[Op.gt]: minAge}, {[Op.lte]: maxAge}];
    packageWhere.minAge = minAge;
    packageWhere.maxAge = maxAge;
  }
  if(ctx.request.query.gender && (ctx.request.query.gender==1||ctx.request.query.gender ==2)) {
    packageWhere.gender = ctx.request.query.gender=='1'?1:2;
  }
  let include = [{
    model: ctx.dao.main.common.File,
    required: true,
  	attributes: ['url']
  }, {
    model: ctx.dao.main.medical.ExaminationPackage,
    required: true,
    attributes: ['id', 'name', 'description'],
    where: packageWhere,
    include:[{
      model: ctx.dao.main.medical.Center,
      attributes: ['manufacturerId', 'organizationId'],
      include:[
        {
          model: ctx.dao.main.medical.Organization,
          attributes: ['id', 'name', 'description'],
        }
      ]
    }]
  }]
  let opts = {
    where,
    page,
    perPage,
    options:{include:include},
    order: []
  }

  let sort = ctx.request.query.sort||'displayOrder-asc';
  if( sort.split('-')[0]==='displayOrder'){
    opts.order.push(["displayOrder",sort.split('-')[1]]);
  }else if(sort.split('-')[0]==='price'){
    opts.order.push(["salePrice",sort.split('-')[1]]);
  }else if(sort.split('-')[0]==='sales'){
    opts.order.push(["sales",sort.split('-')[1]]);
  }

  let pagination = await ctx.dao.main.catalog.Product.paginate(opts);

  let counts = await ctx.dao.main.catalog.Product.count({
  	attributes: ['parentGroupProductId'],
  	group: 'parentGroupProductId',
    plain: false,
  	where: {
  		parentGroupProductId: {
  			[Op.in]: pagination.items.filter((item) => { return !!item.parentGroupProductId }).map((item) => { return item.parentGroupProductId })
  		}
  	}
  });

  pagination.items = pagination.items.map((item) => { 
    let group = 0;
    for(let count of counts) {
      if(count.parentGroupProductId===item.parentGroupProductId) {
        item.dataValues.group = count.count;
        break;
      }
    }
    return item;
  });

  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: pagination,
    where
  }
}


/**
* 筛选器
*/ 
exports.filter = async(ctx, next) => {
  let results = await Promise.all([
    ctx.dao.main.medical.ExaminationPackageType.findAll({order:[['displayOrder', 'ASC']]}),
    ctx.dao.main.medical.ExaminationItem.findAll({filter:true, published:true})
  ])

  ctx.body = {
    code: Code.OK.code, 
    msg: Code.OK.msg,
    data: {
      packageTypes: results[0].map((item) => { return item.format(); }),
      examinationItems: results[1].map((item) => { return item.format(); })
    }
  }
}

/**
* 查询扩展信息并返回详细
*/
exports.get = async(ctx, next) => {
  let product = ctx.state.product;
  let include=[
    {
      model: ctx.dao.main.medical.ExaminationPackage,
      attributes: ['id', 'name', 'description'],
      include: [
        {
          model: ctx.dao.main.medical.Center,
          attributes: ['manufacturerId','type', 'organizationId','businessHours','contact','phoneNumber','province','city','county','address'],
          include: [{
            model: ctx.dao.main.medical.Organization,
            attributes: ['id', 'name']
          }, {
            model: ctx.dao.main.catalog.Manufacturer,
            attributes: ['id', 'name'],
            include:[{
              model: ctx.dao.main.common.File,
              attributes: ['url']
            }]
          }]
        },{
          model: ctx.dao.main.medical.ExaminationItem,
          through:ctx.dao.main.medical.ExaminationPackageItemMapping,
          as:"ExaminationPackageItems"
        }
      ]
    },{
      model: ctx.dao.main.common.File,
      required: true,
      attributes: ['url']
    }
  ]
  if(product.parentGroupProductId){
    product.dataValues.Groups = await ctx.dao.main.catalog.Product
    .findAll({where:{parentGroupProductId:product.parentGroupProductId}, attributes,include});
  }
  
  product.dataValues.MedicalExaminationPackage= await product.getMedicalExaminationPackage({
    include:[
        {
          model: ctx.dao.main.medical.ExaminationItem,
          through:ctx.dao.main.medical.ExaminationPackageItemMapping,
          as: 'ExaminationPackageItems'
        }, 
        {
          model: ctx.dao.main.medical.Center,
          include: [
              {
                model: ctx.dao.main.medical.Organization,
                attributes: ['id', 'name']
              }, 
              { 
                model: ctx.dao.main.catalog.Manufacturer,
                attributes: ['id', 'name'],
                include:[{
                  model:ctx.dao.main.common.File,
                  attributes:['url']
                }],
              },
              { 
                model: ctx.dao.main.common.File,
                required:true,
                attributes: [['url','LocationFile']],
                as:"LocationFile"
              }
          ]
        }
      ]
    });
  ctx.body = {
    code: Code.OK.code, 
    msg: Code.OK.msg,
    data: product.format()
  }
}  

/**
* 按Id查找
*/
exports.getById = async (ctx, next) => {
  let include = [{
    model: ctx.dao.main.common.File,
    attributes: ['id', 'url', 'name', 'size']
  }];

  let result = await ctx.dao.main.catalog.Product.findOne({where:{id:ctx.params.id, productType: Catalog.productType.medicalCard}, attributes, include})

  if(!result) {
    ctx.body = {
      code: Code.NotFound.code, 
      msg: '信息未找到',
      errors: Code.NotFound.msg
    }
    return;
  }
  ctx.state.product = result;
  await next();
}

/**
 * 条件查询
 */
exports.selectProduct = async (ctx, next) => {
  ctx.checkQuery('condition').notEmpty("条件不能为空");
  let perPage=parseInt(ctx.request.query.perPage)||10;
  let page=parseInt(ctx.request.query.page)||1;
  let res = await ctx.dao.main.catalog.Product.paginate({
    perPage:perPage,
    page:page,
    options:{include:[{
      model: ctx.dao.main.common.File,
      attributes: ['url']
    }]},
    where:{
      name:{[Op.like]:`%${decodeURIComponent(ctx.request.query.condition)}%`}
    },
  });
  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: res
  }
}

