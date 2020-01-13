'use strict';

var should = require('should');
var request = require('supertest');
request = request('http://127.0.0.1:6128');
//request = request('http://111.230.240.71:6128');

const {tool} = require('../../../libs/utils')

describe('公共模块', function() {
  let key = "eg1QBJtoDwSnPVMT";
  let secret = "FoG46jAJxDlgoRs51xeQgOpffBfdPAXg";

  let cookies;
  let code = '1122';
  it('图片验证码', function (done) {
    request.get('/api/service/captcha?text='+code)
    .expect(200, function(err, res) { 
      should.not.exist(err); 
      res.status.should.equal(200);
      console.log(res.body)
      // res.body.code.should.equal(200);
      cookies = res.headers['set-cookie'];
      done(); 
    });
  })

  it('短信验证码', function (done) {
    let timestamp = Date.now()
    let query = `captcha=${code}&mobile=18701683001`;
    request.get('/api/service/sms?'+query)
    .set('x-auth-key', key)
    .set('x-auth-timestamp', timestamp)
    .set('x-auth-signature', tool.sign(query, secret+timestamp))
    .set('cookie', cookies)
    .expect(200, function(err, res) { 
      should.not.exist(err); 
      res.status.should.equal(200);
      console.log(res.body)
      // res.body.code.should.equal(200);
      done(); 
    });
  })
});

