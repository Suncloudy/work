const getters = {
  stuffList: state => state.model.stuffList,
  createPlanFlag:state =>state.model.createPlanFlag,
  asideNavTitle:state =>state.model.asideNavTitle,
  invoiceInfoFlag:state =>state.model.invoiceInfoFlag,//发票信息

  cartParams:state =>state.model.cartParams,//点击购物车
  paymentMethod:state =>state.model.paymentMethod,//确认订单选择的支付方式
  helpCenterTitle:state =>state.model.helpCenterTitle,//帮助中心的导航标题
  articleId:state =>state.model.articleId,//文章列表的ID
  selectArticleLabel:state =>state.model.selectArticleLabel,//文章标签
  detailFlag:state =>state.model.detailFlag,//文章详情的flag
  changeSelectArticle:state =>state.model.changeSelectArticle,//热门文章选中的index
  provinceCode:state =>state.model.provinceCode, //选择的省份code
  shopCartCache:state =>state.model.shopCartCache,//购物车商品的信息
  searchContent:state =>state.model.searchContent,//搜索内容
};

export default getters
