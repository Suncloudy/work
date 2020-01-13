const model = {
  state: {
    stuffList:'',  // 选择的模板id
    createPlanFlag:false, //创建体检计划时传的员工信息
    asideNavTitle:'',//侧导航的标题
    invoiceInfoFlag:false,//设置发票信息成功的标志
    cartParams:'',//点击Banner的购物车
    paymentMethod:'',//确认订单选择的支付方式
    helpCenterTitle:'',//帮助中心的侧导航标题
    articleId:'',//点击文章列表查看文章详情的id
    detailFlag:'ArticleList',//文章详情的flag
    changeSelectArticle:'',//文章选中的index
    selectArticleLabel:'',//文章label
    provinceCode:'',//点击Banner的选择'更多城市'后对应的省份code
    shopCartCache:'',//购物车商品相关信息
    searchContent:[],//头搜索的内容
  },
  mutations: {
    SET_STUFF_LIST: (state, data) => {
      state.stuffList = data
    },
    SET_CREATE_PLAN_FLAG:(state, data) => {
      state.createPlanFlag = data
    },
    SET_ASIDE_NAV_TITLE:(state, data) => {
      state.asideNavTitle = data
    },
    SET_INVOICE_INFO:(state, data) => {
      state.invoiceInfoFlag = data
    },
    //点击Banner的购物车
    SET_CART_PARAMS:(state, data) => {
      state.cartParams = data
    },
    //确认订单选择的支付方式
    SET_PAYMENT_METHOD:(state,data) => {
      state.paymentMethod = data
    },
    //确认订单选择的支付方式
    SET_HELP_CENTER_TITLE:(state,data) => {
      state.helpCenterTitle = data
    },
    //  文章id
    SET_ARTICLE_ID:(state,data) => {
      state.articleId = data
    },
    //  文章详情的flag
    SET_DETAIL_FLAG:(state,data) => {
      state.detailFlag = data
    },
    //热门文章选中的样式设置
    SET_CHANGE_SELECT_ARTICLE:(state,data) =>{
      state.changeSelectArticle = data
    },
    //文章标签
    SET_SELECT_ARTICLE_LABEL:(state,data)=>{
      state.selectArticleLabel = data;
    },
    //  省份code
    SET_PROVINCE_CODE:(state,data) => {
      state.provinceCode = data
    },
    //  购物车信息
    SET_SHOP_CART_CACHE:(state,data) =>{
      state.shopCartCache = data;
    },
    //搜索
    SET_SEARCH_CONTENT:(state,data) =>{
      state.searchContent = data;
    }
  },
  actions: {
    setModelCode: ({ commit }, data) => {
      commit('SET_STUFF_LIST', data)
    },
    setCreatePlanFlag:({ commit }, data) => {
      commit('SET_CREATE_PLAN_FLAG', data)
    },
    setAsideNavTitle:({ commit },data) =>{
      commit('SET_ASIDE_NAV_TITLE', data)
    },
    setInvoiceInfo:({ commit },data) =>{
      commit('SET_INVOICE_INFO', data)
    },
    setCartParams:({ commit },data) =>{
      commit('SET_CART_PARAMS', data)
    },
    setPaymentMethod:({ commit },data) =>{
      commit('SET_PAYMENT_METHOD', data)
    },
    setHelpCenterTitle:({ commit },data) =>{
      commit('SET_HELP_CENTER_TITLE', data)
    },
    setArticleId:({ commit },data) =>{
      commit('SET_ARTICLE_ID', data)
    },
    setDetailFlag:({ commit },data) =>{
      commit('SET_DETAIL_FLAG', data)
    },
    setChangeSelectArticle:({ commit },data) =>{
      commit('SET_CHANGE_SELECT_ARTICLE', data)
    },
    setSelectArticleLabel:({commit},data) =>{
      commit('SET_SELECT_ARTICLE_LABEL',data)
    },
    setProvinceCode:({ commit },data) =>{
      commit('SET_PROVINCE_CODE', data)
    },
    setShopCartCache:({commit},data) =>{
      commit('SET_SHOP_CART_CACHE',data)
    },
    setSearchContent:({commit},data) =>{
      commit('SET_SEARCH_CONTENT',data)
    }
  }
}
export default model;
