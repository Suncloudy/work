// import VerifyUtils from 'utils'

export function getImgCode(request) {
  return request.$nosignget('/api/service/captcha', {
    width: '',
    height: '',
  },).then(res => {
      return res;
  }).catch(function (reason) {
    console.log('catch:', reason);
  });
}

//获取短信验证码
export function getMessageCode(request, graphCode, phoneNumber) {
  return request.$get('/api/service/sms', {
    captcha: graphCode,
    mobile: phoneNumber
  },).then(res => {
    if (res.data.code === 200) {
      return res.data
    } else {
      return res.data.msg;
    }
  }).catch(function (reason) {
    console.log('catch:', reason);
  });
}
