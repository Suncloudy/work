'use strict'

/**
 * @class 分页类 Paginator
 * @constructor
 * @param page {Number} 当前页
 * @param perPage {Number} 每页记录数
 * @param total {Number} 总记录数
 * @param items {Array} 当前页记录列表
 *
 * @example
 *  ```
 *  var Paginator = require(REAL_PATH+'/paginator')
 *  var paginator = new Paginator(1, 20, 100, users);
 *  //总页数
 *  var pages = paginator.pages;
 *  //是否有下一页
 *  if (paginator.hasNextPage() === true){}
 *  //是否有上一页
 *  if (paginator.hasPrevPage() === true){}
 *  //上一页
 *  paginator.prevPage()
 *  //下一页
 *  paginator.nextPage()
 *  //总条数
 *  paginator.total()
 *  //当前页条数
 *  paginator.currentPageTotal()
 *  //当前页所有数据
 *  paginator.items()
 *  ```
 */
class Paginator {

  constructor(page=1, perPage=config.get('limit'), total=0, items=[]) {
    
    this.page = page;
    this.perPage = perPage;
    this.total = total;
    this.items = items;
    this.currentPageTotal = items.length;
    this.pages = 0;
    if(this.total%this.perPage ===0){
      this.pages = parseInt(this.total/this.perPage);
    }else{
      this.pages = parseInt(this.total /this.perPage) + 1;
    }
  }

  /**
   * 设置当前页数
   * @method setPage
   * @param page {Number}
   */
  setPage(page) {
    this.page = page;
  }

  /**
   * 设置每页条数
   * @method setPerPage
   * @param perPage {Number}
   */
  setPerPage(perPage) {
    this.perPage = perPage;
  }

  /**
   * 是否有上一页
   * @method hasPrevPage
   * @returns {Boolean}
   */
  hasPrevPage() {
    if(this.page >1){
      return true;
    }
    return false;
  }

  /**
   * 上一页
   * @method prevPage
   * @returns {Number}
   */
  prevPage() {
    if(this.page <= 1){
      return 1;
    }
    return this.page-1;
  }

  /**
   * 是否有下一页
   * @method hasNextPage
   * @returns {Boolean}
   */
  hasNextPage() {
    if(this.page < this.pages){
      return true;
    }
    return false;
  }

  /**
   * 下一页
   * @method nextPage
   * @returns {Number}
   */
  nextPage() {
    if(this.page < this.pages){
      return this.page+1;
    }
    return this.pages;
  }
}


module.exports = Paginator;

