const Op = require('sequelize').Op;
const {Code, User, Catalog} = require('../../libs/consts');

/**
* 购物车列表
*/
exports.carts = async (ctx, next) => {
  let key = ctx.state.key;
  let cart = await ctx.redis.hgetall(key);
  console.log(cart)
  let include = [{
    model: ctx.dao.main.common.File,
    attributes: ['url']
  }];
  const attributes = ['id', 'name', 'imageFileId', 'marketPrice', 'salePrice']
  let products = await ctx.dao.main.catalog.Product.findAll({where:{id:{[Op.in]:Object.keys(cart)}}, include, attributes});

  console.log(products.length)

  let items = Object.keys(cart).map((k) => {
    for(let product of products) {
      if(product.id==k) {
        return {
          product: product.format(),
          amount: parseInt(cart[k])
        }
        break;
      }
    }
  });
  items = items.filter(element=>{
    if(element){
      return element;
    }
  });

  ctx.body = {
    code: Code.OK.code, 
    msg: Code.OK.msg,
    data: {items:items,discount:ctx.state._user.discount.enterprise} 
  }
}

/**
* 批量创建数据（登录后同步数据）
*/
exports.creates = async (ctx, next) => {
  ctx.checkBody('carts').notEmpty();

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

  let key = ctx.state.key;
  let sets = [];
  ctx.request.body.carts.forEach((item) => {
    sets.push(item.product);
    sets.push(item.amount);
  });

  if(sets.length>0) {
    await ctx.redis.hmset(key, sets);
  }

  ctx.body = {
    code: Code.OK.code, 
    msg: Code.OK.msg
  }
}

/**
* 创建单条数据
*/
exports.create = async (ctx, next) => {
  ctx.checkBody('product').notEmpty();
  ctx.checkBody('amount').notEmpty();

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

  let key = ctx.state.key;
  let amount = await ctx.redis.hget(key, ctx.request.body.product);
  if(amount) {
    await ctx.redis.hset(key, ctx.request.body.product, parseInt(amount)+parseInt(ctx.request.body.amount));
  } else {
    await ctx.redis.hset(key, ctx.request.body.product, parseInt(ctx.request.body.amount));
  }

  ctx.body = {
    code: Code.OK.code, 
    msg: Code.OK.msg
  }
}

/**
* 创建单条数据
*/
exports.update = async (ctx, next) => {
  ctx.checkBody('amount').notEmpty();

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

  let key = ctx.state.key;
  await ctx.redis.hset(key, ctx.params.productId, parseInt(ctx.request.body.amount));

  ctx.body = {
    code: Code.OK.code, 
    msg: Code.OK.msg
  }
}


/**
* 删除数据
*/
exports.delete = async (ctx, next) => {
  let key = ctx.state.key;
  await ctx.redis.hdel(key, ctx.params.productId);

  ctx.body = {
    code: Code.OK.code, 
    msg: Code.OK.msg
  }
}

/**
* 批量删除
*/
exports.deletes = async (ctx, next) => {
  let key = ctx.state.key;
  if(ctx.query.ids) {
    let ids = ctx.query.ids.split(',');
    await Promise.all(ids.map((id) => {
      return ctx.redis.hdel(key, id);
    }));
  } else {
    await ctx.redis.del(key);  
  }

  ctx.body = {
    code: Code.OK.code, 
    msg: Code.OK.msg
  }
}

exports.getKey = async(ctx, next) => {
  let user = ctx.state._user;
  console.log("****"+JSON.stringify(user));
  let cKey = `${config.get('redis').prefix}cart:${user.id}`;
  ctx.state.key = cKey;

  await next();
}
