// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-theme-chalk';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import store from './store'

import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式
import swal from 'sweetalert2'; //alert框

// Vue.prototype.$store = store;
import {post,fetch,noSignFetch,put,del} from './utils/https' //get,post方法
//定义全局变量
Vue.prototype.$post=post;
Vue.prototype.$get=fetch;
Vue.prototype.$put=put;
Vue.prototype.$del=del;
Vue.prototype.$nosignget=noSignFetch;//不带签名的get方法

import { getToken, setToken } from './utils/auth';
// // //定义全局变量

import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

import crypto from 'crypto'
Vue.prototype.$crypto = crypto;

Vue.config.productionTip = false
Vue.use(ElementUI);
// Vue.use(BootstrapVue);

//滑块校验
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify);

//加载图片
// import VueLazyLoad from 'vue-lazyload'
// Vue.use(VueLazyLoad,{
//   error:'assets/medicalproduct/dummy.png',
//   loading:'assets/medicalproduct/dummy.png'
// })

// register global progress.
// const whiteList = ['/Login', '/PersonalCenter', '/FirmCenter'];// 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  if (!localStorage.getItem('accessToken')) { // 判断是否有token
    if(to.path === '/Login') {
      localStorage.setItem("accessToken", '1');
      next({ path: '/Login' });
    } else if (to.path === '/PersonalCenter'|| to.path === '/FirmCenter' || to.path === 'PersonalPage') {
      next({ path: '/Login' });
    } else {
      next();
      // swal({
      //   title: "请登录",
      //   // text: "You will not be able to recover this imaginary file!",
      //   type: "warning",
      //   showCancelButton: false,
      //   confirmButtonColor: "#DD6B55",
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      // }).then((result) => {
      //   if (result.value) {
      //     next({ path: '/Login' });
      //     // this.$router.push({path: '/Login'})
      //   } else {
      //     swal("提示", result.data.msg, "error");
      //   }
      // });

    }

  }else{
    next()
    NProgress.done()
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
