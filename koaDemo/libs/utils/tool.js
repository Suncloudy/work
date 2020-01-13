const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

exports.generateUUID=function(length) {
	var id = '',
  length = length || 32;
  while (length--)
    id += (Math.random() * 16 | 0) % 2 ? (Math.random() * 16 | 0).toString(16) : (Math.random() * 16 | 0).toString(16).toUpperCase();
  
  return id.toLowerCase();
}

exports.parseJSON=function(jsonString) {
	if (!jsonString)
		return {};

	var json;
	try {
		json = JSON.parse(jsonString);
	} catch (err) {
		console.error('parseJSON ERROR: ' + jsonString, err);
		console.log(err.stack)
	}

	return json ? json : {};
}

exports.getNumByChar=function(str, length) {
	var result = '';
	str = str.toLowerCase();
	for (var i = 0; i < length; i++) {
		if (str[i])
			result += ('000000000' + (str[i].charCodeAt() - 96)).slice(-2);
		else
			result += ('000000000'.slice(-2));
	}
	return result;
}

exports.getFixedInt=function(int, length) {
	return ('000000000000000' + int).slice(-length);
}

exports.getFixedRandomInt=function(length) {
	return ('000000000000000' + Math.random() * Math.pow(10, length)).slice(-length);
}

function getMd5(str) {
	var result = "";
	try {
		if (str && typeof str === "string") {
			var md5_str = crypto.createHash('md5');
			result = md5_str.update(str).digest('hex');
		}
		else
			result = "";

	} catch (err) {
		return result;
	}

	return result;
}
exports.getMd5 = getMd5;

//函数功能：json 排序  
// filed:(string)排序字段，  
// reverse: (bool) 是否倒置(是，为倒序)  
// primer (parse)转换类型  
//示例:list.sort(tool.sortJSONArry('downloadTimes',true,parseInt));
exports.sortJSONArry = function (filed, reverse, primer) {
	reverse = (reverse) ? -1 : 1;  

	return function (a, b) {  
		a = a[filed];  
		b = b[filed];  

		if (typeof (primer) != "undefined") {  
			a = primer(a);  
			b = primer(b);  
		}  

		if (a < b) {  
			return reverse * -1;  
		}  
		if (a > b) {  
			return reverse * 1;  
		}  
	}  
}

exports.toUnicode=function(str) {
  var res=[];
  for(var i=0;i < str.length;i++)
    res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
  return "\\u"+res.join("\\u");
}

exports.deUnicode=function(str) {
  str=str.replace(/\\/g,"%");
  return unescape(str);
}

exports.trimRight=function(s){
  if(s == null) return "";
  var whitespace = new String(" \t\n\r");
  var str = new String(s);
  if (whitespace.indexOf(str.charAt(str.length-1)) != -1){
    var i = str.length - 1;
    while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1){
      i--;
    }
    str = str.substring(0, i+1);
  }
  return str;
}

exports.decodeHtml=function(val) {
	return val.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

function encrypt(str, secret, opts) {
  if(!opts) opts = {};

  let iv = opts.iv||'';
  let cipherType = opts.cipherType||'aes192';
  let inputEncoding = opts.inputEncoding||'utf8';
  let outputEncoding = opts.outputEncoding||'hex';

  let cipher = crypto.createCipheriv(cipherType, secret, iv);
  if(opts.autoPadding) {
    cipher.setAutoPadding(true);
  }

  let cipherChunks = [];
  cipherChunks.push(cipher.update(str, inputEncoding, outputEncoding));
  cipherChunks.push(cipher.final(outputEncoding));
  return cipherChunks.join('');
}
exports.encrypt=encrypt;

function decrypt(str, secret, opts) {
  if(!opts) opts = {};

  let iv = opts.iv||'';
  let cipherType = opts.cipherType||'aes192';
  let inputEncoding = opts.inputEncoding||'hex';
  let outputEncoding = opts.outputEncoding||'utf8';

  let decipher = crypto.createDecipheriv(cipherType, secret, iv);
  if(opts.setAutoPadding) {
    decipher.setAutoPadding(true);
  }
  let cipherChunks = [];
  cipherChunks.push(decipher.update(str, inputEncoding, outputEncoding));
  cipherChunks.push(decipher.final(outputEncoding));
  return cipherChunks.join('');
}
exports.decrypt=decrypt;

/**
 * 生成随机字符串
 * @param {Number} length 字符串长度
 * @param {Number} flag 0.数字+字符+大写 1.数字 2.小写字符 3.大写
 */
exports.makeRandomStr=function(length, flag) {
  var str = '0123456789abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWSYZ';
  var min = 0;
  var max = 61;
  if (flag === 1) {
    max = 9;
  } else if (flag === 2) {
    min = 10;
    max = 35;
  } else if (flag === 3) {
    min = 36;
  }
  var backStr = '';
  for(var i=0;i<length;i++) {
    var idx = parseInt(Math.random()*(max-min)+min);
    backStr += str[idx];
  }
  return backStr;
};

/**
 * queryString签名
 * @params query            {string|object} 字符串或对象形式的查询参数
 * @params secretKey        {string} 签名用secretKey
 * @params opts             {object} 选项
 *         opts.isReverse   {bool}   是否降序（默认字典）
 *         opts.isKeyFront  {bool}   是否前置Key（默认后置）
 *         opts.isUpperSign {bool}   返回签名是否大写（默认小写）
 */
exports.sign = function(query, secretKey, opts) {
  opts = opts||{};

  // 字符串转对象
  let params = query;
  if(typeof params==='string') {
    params = querystring.parse(params)
  }

  let paramsArr = querystring.stringify(params).split('&').sort();

  if(opts&&opts.isReverse) {
    paramsArr.reverse();
  }
  
  let paramsStr = encodeURIComponent(paramsArr.join('&'));
  let signStr = paramsStr+secretKey;
  if(opts&&opts.isKeyFront) {
    signStr = secretKey+paramsStr;
  }
  let sign = getMd5(signStr).toLowerCase();
  if(opts&&opts.isUpperSign) {
    sign = sign.toUpperCase();
  }
  return sign;
}

/**
 * sign 的进一步封装，返回 Url+'&sign='+sign
 * @params query            {string|object} 字符串或对象形式的查询参数
 * @params secretKey        {string} 签名用secretKey
 * @params opts             {object} 选项
 *         opts.sign        {string} 签名参数名
 *         opts.isReverse   {bool}   是否降序（默认字典）
 *         opts.isKeyFront  {bool}   是否前置Key（默认后置）
 *         opts.isUpperSign {bool}   返回签名是否大写（默认小写）
 */
exports.getSignUrl = function(query, secretKey, opts) {
  if(!query||!secretKey) {
    return false;
  }

  opts = opts||{};

  let params = query;
  if(typeof params==='object') {
    params = querystring.stringify(params)
  }
  let sign = opts.sign||'sign';
  return params+'&'+sign+'='+exports.sign(query, secretKey, opts);
}

/**
 * base64编码
 */
exports.base64Encode = function(str) {
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out, i, len;
  var c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";

  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4)
       | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xF) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
  }
  return out;
}

/**
 * base64解码
 */
exports.base64Decode = function (str) {//base64\u89e3\u5bc6
  var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
  var c1, c2, c3, c4;
  var i, len, out;
  len = str.length;
  i = 0;
  out = "";
  while(i < len) {
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c1 == -1);
    if (c1 == -1) break;
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c2 == -1);
    if (c2 == -1) break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    do {
      c3 = str.charCodeAt(i++) & 0xff;
      if (c3 == 61)  return out;
      c3 = base64DecodeChars[c3];
    } while(i < len && c3 == -1);
    if(c3 == -1) break;
    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
    do {
      c4 = str.charCodeAt(i++) & 0xff;
      if(c4 == 61) return out;
      c4 = base64DecodeChars[c4];
    } while(i < len && c4 == -1);
    if(c4 == -1) break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return out;
}

exports.getIP = function(req) {
  var ip = req.headers['x-real-ip']||req.headers['x-forwarded-for']||req.ip;
  if(ip.indexOf('::1')!==-1){
  	ip = '127.0.0.1';
  }
  return ip;
}

exports.normalize = (score, normalize) => {
  var score = (!isNaN(score)&&score>0)?score:0
  var normalize = (!isNaN(normalize)&&normalize>0)?normalize:0
  return parseFloat((score*normalize).toFixed('1'));
}

exports.hasRule = (iAllRule, iRule) => {
  var iNewFlag = 0X01 << iRule;
  if (iAllRule & iNewFlag )
    return true;

  return false;
}

// 计算文件Md5
exports.fileMd5 = (path, callback) => {
	var stream = fs.createReadStream(path);
	var fsHash = crypto.createHash('md5');

	stream.on('data', function(d) {
   fsHash.update(d);
 });

	stream.on('end', function() {
    var md5 = fsHash.digest('hex');
    callback(null, md5)
  });
	stream.on('error', function(err) {
    callback(err)
  });
}

// 随机排列数组元素
exports.randomArray = (arr) => {
  var _arr = [];
  while (arr.length>0) {
    let r  = Math.floor(Math.random()*arr.length);
    var x = arr[r];
    arr.splice(r, 1);
    _arr.push(x);
  }
  return _arr;
}

exports.rmbUpper = function(money) {
  var cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]; 
  var cnIntRadice = ["", "拾", "佰", "仟"]; 
  var cnIntUnits = ["", "万", "亿", "兆"];
  var cnDecUnits = ["角", "分", "毫", "厘"];
  var cnInteger = "整"; 
  var cnIntLast = "元";
  var maxNum = 999999999999999.9999;
  var IntegerNum; 
  var DecimalNum; 
  var ChineseStr = ""; 
  var parts; 
  if (money == ""){
    return "";
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    return "";
  }
  if (money == 0) {
    ChineseStr = cnNums[0] + cnIntLast + cnInteger;
    return ChineseStr;
  }
  money = money.toString(); 
  if (money.indexOf(".") == -1) {
    IntegerNum = money;
    DecimalNum = '';
  } else {
    parts = money.split(".");
    IntegerNum = parts[0];
    DecimalNum = parts[1].substr(0, 4);
  }
  if (parseInt(IntegerNum, 10) > 0) { 
    var zeroCount = 0;
    var IntLen = IntegerNum.length;
    for (var index = 0; index < IntLen; index++) {
      var n = IntegerNum.substr(index, 1);
      var p = IntLen - index - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0; 
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
    ChineseStr += cnIntLast;
  }
  if (DecimalNum != '') { 
    var decLen = DecimalNum.length;
    for (var index = 0; index < decLen; index++) {
      var n = DecimalNum.substr(index, 1);
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[index];
      }
    }
  }
  if (ChineseStr == '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (DecimalNum == '') {
    ChineseStr += cnInteger;
  }
  return ChineseStr;
}

/**
* 隐藏字符串
* @param obj {string} required 要处理的字符串
* @param start {int} optional 开始隐藏的位置（0开始）
* @param len {string} optional 隐藏长度
*/
exports.shadow = function(obj, start, len, use) {
  if (typeof obj === "string") {
    if(!start) start = 0;
    let end = obj.length;
    if(len) end=start+len;

    if (end>obj.length) {
      end = obj.length
    }
    let backStr = '';
    for(let i=0;i<obj.length;i++) {
      if(i>=start && i<end) {
        backStr +='*';
      } else {
        backStr += obj[i];
      }
    }
    return backStr;
  } else {
    return '';
  }
};

/**
* 脱敏
* @param obj {string} required 要处理的字符串
* @param startLeft {int} optional 前面剩余位
* @param endLeft {int} optional 后面剩余位
*/
exports.desensitization = function(obj, startLeft, endLeft) {
  if (typeof obj === "string") {
    let start = startLeft||0;
    let end = obj.length-endLeft;

    if (end>obj.length) {
      end = obj.length
    }
    let backStr = '';
    for(let i=0;i<obj.length;i++) {
      if(i>=start && i<end) {
        backStr +='*';
      } else {
        backStr += obj[i];
      }
    }
    return backStr;
  } else {
    return '';
  }
};


/**
 * 中青数据接口签名 
 * 规则：
 * 1. 参数按字典序排序
 * 2. 去掉等号，拼接成字符串
 * 4. md5(secret+字符串).toUpperCase()
 *
 * @params queryStr         {string} queryString
 * @params secretKey        {string} 签名用secretKey
 */
exports.apiSign = function(queryStr, secretKey){
  let qstrObj = querystring.parse(queryStr);
  if(qstrObj.digital_signature) delete qstrObj.digital_signature;

  let qstrArr = [];
  for(let k in qstrObj) {
    qstrArr.push(k+qstrObj[k]);
  }
  qstrArr.sort();
  return getMd5(secretKey+qstrArr.join('')).toUpperCase();
}


// 按身份证号算年龄
exports.getAgeById = function(idCode) {
  if(typeof idCode==='string') {
    let num = parseInt(idCode.substr(6, 4));
    return new Date().getFullYear() - num;
  } else {
    return '--';
  }
}

// 按身份证号算性别
exports.getSexById = function(idCode) {
  if(typeof idCode==='string') {
    let num = parseInt(idCode[16]);
    if (num % 2 === 0) {
      return '女'
    } else if (num % 2 === 1) {
      return '男'
    }
  } else {
    return '';
  }
}

// 计算两地之间的距离
exports.getDistance=function (lat1,lng1,lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  return Number(s);   
}



