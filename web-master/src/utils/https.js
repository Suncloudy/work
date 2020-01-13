import axios from 'axios';
import qs from 'qs' ;
import swal from 'sweetalert2'; //alert框
import router from '@/router/index';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.timeout = 8000;
// axios.defaults.baseURL = 'http://47.92.208.24:6128/';
axios.defaults.baseURL = 'http://api-web.health.sweetydaddy.com';

//http://111.230.240.71:6128/
//47.92.208.24:6128/
axios.defaults.withCredentials = true;//携带cookie

//http request 拦截器
axios.interceptors.request.use(config => {
  // config.data = JSON.stringify(config.data)
  // config.headers['Content-Type'] = 'application/json';
  if(config.method == 'post'){
    config.data = qs.stringify(config.data);
    console.log(config)
  }
  return config;
},(error) => {
  return Promise.reject(error);
})

//添加响应拦截器
axios.interceptors.response.use(function (response) {
  // console.log(response.data);
  if (response.data.code === 401){
    swal({
      title: "需登录，是否登录",
      // text: "You will not be able to recover this imaginary file!",
      type: "question",
      showCancelButton: false,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }).then((result) => {
      // debugger
      if (result.value) {
        localStorage.setItem("accessToken", '');
        router.replace({
          path: 'login',
          query: {redirect: router.currentRoute.fullPath}
        })
        // location.reload()
      } else {
        // swal("提示", res.data.msg, "error");
      }
    });
    return Promise.reject(error);
  }
  // 成功处理
  if (!response) {
    return Promise.reject(response.data);
  }
  return response;
}, function (error) {
  // 失败处理
  // error.code = error.response.status

  return Promise.reject(error);
});


/**
 * 封装put方法  patch
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
  // let cookieName = localStorage.getItem('CookieName');
  let accessToken = localStorage.getItem('accessToken');
  let timestamp = new Date().getTime();
  let secret = 'FoG46jAJxDlgoRs51xeQgOpffBfdPAXg';
  let k = qs.stringify(data).split('&');
  k.sort();
  let result = k.join('&');
  var encode = encodeURIComponent(result) + secret;
  var sign = this.$md5(encode);
  return new Promise((resolve, reject) => {
    axios.put(url, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "x-auth-key": "eg1QBJtoDwSnPVMT",
        "x-auth-signature": sign,
        "x-auth-timestamp": timestamp,
        "x-auth-token":accessToken,
        // "set-cookie":cookieName,
      }
    })
      .then(response => {
        resolve(response);
      })
      .catch((error) => {
        reject(error)
      })
    console.log("putData=="+JSON.stringify(data))
  }).catch(function(reason) {
    console.log('catch:', reason);
  });
}

/**
 * 封装delete方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del(url, params = {}) {
  let accessToken = localStorage.getItem('accessToken');
  let timestamp = new Date().getTime();
  let secret = 'FoG46jAJxDlgoRs51xeQgOpffBfdPAXg';
  let k = qs.stringify(params).split('&');
  k.sort();
  let result = k.join('&');
  var encode = encodeURIComponent(result) + secret;
  var sign = this.$md5(encode);
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params,
      headers: {
        "content-type": "application/json",
        "x-auth-key": "eg1QBJtoDwSnPVMT",
        "x-auth-signature": sign,
        "x-auth-timestamp": timestamp,
        "x-auth-token":accessToken,
      }
    })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err)
      })
  }).catch(function(reason) {
    console.log('catch:', reason);
  });
}
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function noSignFetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      headers: {
        'Content-Type': 'image/svg+xml',
      }
    })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err)
      })
  }).catch(function (reason) {
    console.log('catch:', reason);
  });
}


export function fetch(url, params = {}) {
  let accessToken = localStorage.getItem('accessToken');
  let timestamp = new Date().getTime();
  //或var timestamp = (new Date()).valueOf();
  //或var timestamp = Date.parse(new Date());（这一种精确到秒，前两种到毫秒）

  //开发：key: “eg1QBJtoDwSnPVMT” secret: “FoG46jAJxDlgoRs51xeQgOpffBfdPAXg”
  //生产：key: “tSGZ1K29ZgPysjlE” secret: “PEc9eRwiFPNFFMPp17AE391oCTeipJJP”

  let secret = 'FoG46jAJxDlgoRs51xeQgOpffBfdPAXg';
  let k = qs.stringify(params).split('&');
  k.sort();
  let result = k.join('&');
  // console.log("result=" + result);
  var encode = encodeURIComponent(result) + secret;
  var sign = this.$md5(encode);
  //等同于 var sign = this.$crypto.createHash("md5").update(encode).digest('hex').toLowerCase();
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      headers: {
        "content-type": "application/json",
        "x-auth-key": "eg1QBJtoDwSnPVMT",
        "x-auth-signature": sign,
        "x-auth-timestamp": timestamp,
        "x-auth-token":accessToken,
      }
    })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err)
      })
  }).catch(function (reason) {
    console.log('catch:', reason);
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  let accessToken = localStorage.getItem('accessToken');
  let timestamp = new Date().getTime();
  let secret = 'FoG46jAJxDlgoRs51xeQgOpffBfdPAXg';
  let k = qs.stringify(data).split('&');
  k.sort();
  let result = k.join('&');
  var encode = encodeURIComponent(result) + secret;
  var sign = this.$md5(encode);

  return new Promise((resolve, reject) => {
    // axios.post(url,qs.stringify(data), {
    axios.post(url, data, {
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
        // "content-type": "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
        "x-auth-key": "eg1QBJtoDwSnPVMT",
        "x-auth-signature": sign,
        "x-auth-timestamp": timestamp,
        "x-auth-token":accessToken,
      }
    })
      .then(response => {
        resolve(response);
      })
      .catch((error) => {
        reject(error)
      })
    console.log("postData==" + JSON.stringify(data))
  }).catch(function (reason) {
    console.log('catch:', reason);
  });
}
