var VerifyUtils = function () {
  var phoneNumberVerify = function (str) {
    var reg = /^1[345678]\d{9}$/
    if (reg.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  var emailVerify = function (str) {
    var reg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    if (reg.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  var validateIsNull = function (str) {
    if (str !== '' && str !== null && str !== undefined && str !== 'null' && str !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  var pwdComplexityCheck = function (sValue) {
    var m = 0;
    if (sValue.length > 0) {
      if (/\d+/.test(sValue)) {
        // debugger;
        m++;
      }
      ;
      //匹配字母
      if (/[A-Za-z]+/.test(sValue)) {
        m++;
      }
      ;
      //匹配除数字字母外的特殊符号
      if (/[^0-9a-zA-Z]+/.test(sValue)) {
        m++;
      }
      ;
      return m;
    }
    return m;
  }
  //转换日期
  var convertDate = function (str) {
    var dateStr = '';
    if (str.length > 0) {
      dateStr = new Date(str).toJSON();
//        var dateee = new Date("2017-07-09T09:46:49.667").toJSON();
      var date = new Date(+new Date(dateStr) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
      return date;
    }
    return dateStr
  }
  //修改密码相关校验
  var graphCodeVerify = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入图形验证码'));
    } else {
      callback();
    }
  };
  var telephoneVerify = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入手机号'));
    } else {
      if (phoneNumberVerify(value)) {
        callback();
        // this.$refs.loginRuleForm.graphCode('graphCode');
      }else{
        callback(new Error('请输入正确格式的手机号'));
      }
    }
  };

  var messageCodeVerify = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入短信验证码'));
    } else {
      // if (VerifyUtils.phoneNumberVerify) {
      // this.$refs.ruleForm.graphCode('graphCode');
      // }
      callback();
    }
  };
  var validateOldPwd = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入原密码'));
    } else {
      callback();
    }
  };
  var validateNewPwd = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入新密码'));
    } else {
      if (pwdComplexityCheck(value) && value.length > 5 && value.length < 21) {
        callback();
      } else {
        callback(new Error('密码由字母、数字、标点两种以上且6～20位组成'));
      }
    }
    // callback();
  };
  //银行卡号验证
  var checkBankCardNumber = (rule, bankCardNumber, callback) => {
    //长度校验
    if (bankCardNumber === "" || bankCardNumber.length < 16 || bankCardNumber.length > 19) {
      callback(new Error("银行卡号位数必须在16~19之间，请完整输入银行卡号！"));
      // return false;
    }
    //开头6位校验
    var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
    if (strBin.indexOf(bankCardNumber.substring(0, 2)) === -1) {
      callback(new Error("银行卡号开头6位不符合规范，请检查后重新输入！"));
      return false;
    }
    //全数字校验
    var num = /^\d*$/;
    if (!num.exec(bankCardNumber)) {
      callback(new Error("银行卡号必须全为数字，请检查后重新输入！"));
      return false;
    }
    //Luhm验证
    var lastNum = bankCardNumber.substr(bankCardNumber.length - 1, 1);//取出最后一位（与luhm进行比较）
    var first15Num = bankCardNumber.substr(0, bankCardNumber.length - 1);//前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) {	//前15或18位倒序存进数组
      newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array();					//奇数位*2的积 <9
    var arrJiShu2 = new Array();				//奇数位*2的积 >9
    var arrOuShu = new Array();					//偶数位数组
    for (var j = 0; j < newArr.length; j++) {
      if ((j + 1) % 2 === 1) {							//奇数位
        if (parseInt(newArr[j]) * 2 < 9)
          arrJiShu.push(parseInt(newArr[j]) * 2);
        else
          arrJiShu2.push(parseInt(newArr[j]) * 2);
      } else									//偶数位
        arrOuShu.push(newArr[j]);
    }
    var jishu_child1 = new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array();//奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
      jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
      jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }
    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
      sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }
    for (var n = 0; n < arrOuShu.length; n++) {
      sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }
    for (var p = 0; p < jishu_child1.length; p++) {
      sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
      sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
    //计算Luhm值
    var k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10;
    var luhm = 10 - k;
    var lNum = parseInt(lastNum);
    if (lNum === luhm) {
      callback();
      return true;
    }
    else {
      callback(new Error("银行卡号不合法，请检查后重新输入！"));
      return false;
    }
  };
  // 分转元 并保留两位小数
  var toDecimal =(x) =>{
    // return (isNaN(x) || x=== 0) ? 0.00 : parseFloat((x/100).toFixed(2));
    var f = (isNaN(x) || x=== 0) ? 0.00 : parseFloat((x/100).toFixed(2));
    // var f = parseFloat(x/100);
    // if (isNaN(f)) {
    //   return false;
    // }
    // f = Math.round(x*100)/100;
    //强制保留两位小数，不足的拼0
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  };
  //制保留2位小数，如：2，会在2后面补上00.即2.00
  var specialToDecimal =(x) =>{
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  };
  /* 格式化日期时间*/
  var dateFormat = (fmt, data) => {
    const date = new Date(data);
    const o = {
      'M+': date.getMonth() + 1,                 // 月份
      'd+': date.getDate(),                    // 日
      'h+': date.getHours(),                   // 小时
      'm+': date.getMinutes(),                 // 分
      's+': date.getSeconds(),                 // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      '"S"': date.getMilliseconds()             // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return fmt;
  };
  var codeCountDown =(disabled,btnTitle) => {
    //倒计时
    let time = 60;
    let timer = setInterval(() => {
      if(time == 0) {
        clearInterval(timer);
        disabled = false;
        btnTitle = "获取验证码";
      } else {
        btnTitle =time + '秒后重试';
        disabled = true;
        time--
      }
    }, 1000);
  };
  //获取cookie
  var getCookie = (c_name) => {
    var arr, reg = new RegExp("(^| )" + c_name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)){
      return (arr[2]);
    } else
      return null;
  };

//设置cookie,增加到vue实例方便全局调用
  var setCookie =(c_name, value, expireDays)=> {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expireDays);
    document.cookie = c_name + "=" + escape(value) + ((expireDays == null) ? "" : ";expires=" + exdate.toGMTString());
  };

//删除cookie
  var delCookie = (name) =>{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/';
  };
    return {
      phoneNumberVerify: phoneNumberVerify,
      emailVerify: emailVerify,
      validateIsNull: validateIsNull,
      pwdComplexityCheck: pwdComplexityCheck,
      convertDate: convertDate,
      telephoneVerify:telephoneVerify,
      graphCodeVerify: graphCodeVerify,
      messageCodeVerify: messageCodeVerify,
      validateOldPwd: validateOldPwd,
      validateNewPwd: validateNewPwd,
      checkBankCardNumber: checkBankCardNumber,
      toDecimal:toDecimal,
      specialToDecimal:specialToDecimal,
      // codeCountDown:codeCountDown,
      dateFormat:dateFormat,
      getCookie: getCookie,
      setCookie: setCookie,
      delCookie: delCookie,
    }
  }

  export default VerifyUtils()
