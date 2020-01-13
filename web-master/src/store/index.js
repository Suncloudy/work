import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import model from './modules/model';
// import * as getters from './getters' // 导入响应的模块，*相当于引入了这个组件下所有导出的事例
// import * as actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    model,
  },
  getters
});

export default store
