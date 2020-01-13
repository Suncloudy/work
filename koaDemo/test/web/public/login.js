'use strict';

var should = require('should');
var request = require('supertest');
// request = request('http://127.0.0.1:6128');
request = request('http://api-web.health.sweetydaddy.com');

const {tool} = require('../../../libs/utils')

describe('公共模块', function() {
  let key = "eg1QBJtoDwSnPVMT";
  let secret = "FoG46jAJxDlgoRs51xeQgOpffBfdPAXg";

  let cookies;
  let code = '8485';

  it('快捷登录', function (done) {
    let timestamp = Date.now()
    let query = {
      mobile: '18701683001',
      smsCode: code
    };
    request.post('/api/shortcutLogin')
    .send(query)
    .set('x-auth-key', key)
    .set('x-auth-timestamp', timestamp)
    .set('x-auth-signature', tool.sign(query, secret+timestamp))
    .expect(200, function(err, res) { 
      should.not.exist(err); 
      res.status.should.equal(200);
      console.log(res.body)
      // res.body.code.should.equal(200);
      done(); 
    });
  })

  it.only('密码登录', function (done) {
    let timestamp = Date.now()
    let query = {
      mobile: '18701683001',
      accountType: 'personal',
      password: '96e79218965eb72c92a549dd5a330112',
      captcha: '8485'
    };
    request.post('/api/login')
    .send(query)
    .set('x-auth-key', key)
    .set('x-auth-timestamp', timestamp)
    .set('x-auth-signature', tool.sign(query, secret+timestamp))
    .expect(200, function(err, res) { 
      should.not.exist(err); 
      res.status.should.equal(200);
      console.log(res.headers)
      // res.body.code.should.equal(200);
      done(); 
    });
  })
});

