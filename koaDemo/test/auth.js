var should = require('should');
var request = require('supertest');
request = request('http://127.0.0.1:6128');
let {Token} = require('../libs/utils');

let key = "eg1QBJtoDwSnPVMT";
let secret = "FoG46jAJxDlgoRs51xeQgOpffBfdPAXg";

describe('验证功能', function() {
  let cookies;
  let timestamp = Date.now();
  let query = 'user=helle&address=world';
  let signature = sign(query, secret, timestamp);
  it('参数、身份验证', function (done) {
    request.get('/authTest?'+query)
    .set('x-auth-key', key)
    .set('x-auth-timestamp', timestamp)
    .set('x-auth-signature', signature)
    .set('x-auth-token', createToken())
    .expect(200, function(err, res) { 
      should.not.exist(err); 
      res.status.should.equal(200);
      console.log(res.body)
      // res.body.code.should.equal(200);
      cookies = res.headers['set-cookie'];
      done(); 
    });
  })
});


function createToken() {
  let secret = '85icMJFSPfkcztbk5BzCUcNPCbYXtgkD';
  let timestamp = Date.now()+60*60*1000;
  return Token.create(1, timestamp, secret);
}


/**
* 对请求签名
* @param {string} params    所有请求参数
* @param {string} secret    应用密钥
* @param {number} timestamp 时间戳
* @return {Object} 追加了签名后的所有参数的集合
*/
function sign(params, secret, timestamp) {
  /**
   * 序列化参数集合
   */
  function serialize(params) {
    let result, keys;
    keys = params.split('&'); //分割成字符数组
    keys.sort();//数组进行排序 George,John,Thomas,James,Adrew,Martin
    result = keys.join('&');//将数组中的所有元素放入字符串 George&John&Thomas
    result = encodeURIComponent(result);
    return result;
  }
  var encodeUri = serialize(params)+secret+timestamp;
  var crypto = require('crypto');
  return crypto.createHash('md5').update(encodeUri).digest('hex').toLowerCase();

};