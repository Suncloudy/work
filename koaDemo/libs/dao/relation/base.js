'use strict'
/*
 * 这是一个 ES6 类，需要被所有模型继承的方法都写到这里面 
 * 与前一版本相对，这一版做以下几个改进：
 * 1. 不再提供回调，所有处理基于 Pormise、async\wait
 * 2. 只提供 Sequelize 中没有的公用方法，能用原生方法的尽量用原生方法
 * 
 */
let {Paginator} = require('../../utils')


class BaseClass {
  constructor() {

  }
/*
 * 按Id更新单条数据
 * @param id 更新对象的Id
 * @param updaet 更新内容
 * @param options 可选
 */
 static updateById(id, update, options, callback) {
  if (arguments.length === 3) {
      callback = options
  }

  let opts = {}
  if (options && typeof options !== 'function') {
      opts = options
  }
  if (!opts.where) {
      opts.where = {}
  }
  opts.where[this.model.primaryKeyField] = id
  opts.limit = 1
  if (callback && typeof callback === 'function') {
      this.model.update(update, opts).then(function (result) {
          callback(null, result[0])
      }, function (err) {
          callback(err)
      })
  } else {
      return this.model.update(update, opts)
  }
}

  /**
   * 分页查询
   * @param {object} [options]            查询选项
   * @param {object} [options.options]    sequelize 选项对象
   * @param {object} [options.where]      sequelize where 条件
   * @param {number} [options.page]       查询页码
   * @param {number} [options.perPage]    每页数据量
   * @param {array}  [options.order]      排序
   * @param {array}  [options.attributes] 查询字段
   * @param {boolean}[options.raw]        是否返回原始数据
   * @param {boolean}[options.distinct]   是否 distinct 
  */
  static paginate (options={}) {
    let where = options.where || {}
    let page = options.page > 0 ? options.page : 1
    let perPage = options.perPage > 0 ? parseInt(options.perPage) : config.get('limit')
    let skip = (page - 1) * perPage

    // let opts = {where:where, limit:perPage, offset:skip};
    let opts = options.options || {}
    opts.where = where

    opts.limit = perPage
    opts.offset = skip

    if (options.order) {
      opts.order = options.order
    }

    if(options.attributes){
      opts.attributes = options.attributes
    }

    if(options.raw){
      opts.raw = options.raw
    }
    if(options.distinct){
      opts.distinct = true
    }
    return this.findAndCountAll(opts).then(function (result) {
      let paginate = new Paginator(page, perPage, result.count, result.rows)
      return Promise.resolve(paginate)
    })
  }

  /**
  * 将基类中的静态方法、实例方法复制到子类中
  * 备注：
  */
  static copy (Model) {
    let self = this;
    Object.getOwnPropertyNames(self)
    .concat(Object.getOwnPropertySymbols(self))
    .forEach((prop) => {
       if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length|copy)$/))
          Object.defineProperty(Model, prop, Object.getOwnPropertyDescriptor(self, prop));
     })
  }
}


module.exports = BaseClass

