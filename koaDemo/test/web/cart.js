'use strict';

var should = require('should');
var request = require('supertest');
request = request('http://127.0.0.1:6128');
//request = request('http://111.230.240.71:6128');

const {tool} = require('../../libs/utils')

describe('购物车模块', function() {
  let key = "eg1QBJtoDwSnPVMT";
  let secret = "FoG46jAJxDlgoRs51xeQgOpffBfdPAXg";

  let cookie;
  before('登录', function(done) {
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
      // console.log(res.body)
      cookie = res.headers['set-cookie'];
      done(); 
    });
  })

  it('购物车列表', function (done) {
    let timestamp = Date.now()
    let query = '';
    request.get('/api/carts')
    .set('cookie', cookie)
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

  it('同步', function (done) {
    let timestamp = Date.now()
    let query = '';
    request.post('/api/carts')
    .send({
      carts: [{
        product: 1,
        amount: 1
      }]
    })
    .set('cookie', cookie)
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

  it.only('删除', function (done) {
    let timestamp = Date.now()
    let query = '';
    request.delete('/api/cart/1')
    .set('cookie', cookie)
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

  it('删除', function (done) {
    let timestamp = Date.now()
    let query = '';
    request.delete('/api/carts')
    .set('cookie', cookie)
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
});

