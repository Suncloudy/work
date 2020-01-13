'use strict';

const crypto = require('crypto');
var should = require('should');
var request = require('supertest');
const {tool} = require('../../../libs/utils');
request = request('http://127.0.0.1:6128');

describe('商品相关', function() {
  let key = 'eg1QBJtoDwSnPVMT';
  let secret = 'FoG46jAJxDlgoRs51xeQgOpffBfdPAXg';
  let timestamp = Date.now()

  it('筛选器', function (done) {
    request.get('/api/catalog/product/filter')
    .set('x-auth-key', key)
    .set('x-auth-timestamp', timestamp)
    .set('x-auth-signature', tool.sign({}, secret+timestamp))
    .expect(200, function(err, res) { 
      should.not.exist(err); 
      res.status.should.equal(200);
      console.log(res.body.data)
      done(); 
    });
  })

  it('列表', function (done) {
    let query = '';//'type=1&item=1'
    request.get(`/api/catalog/products?${query}`)
    .set('x-auth-key', key)
    .set('x-auth-timestamp', timestamp)
    .set('x-auth-signature', tool.sign(query, secret+timestamp))
    .expect(200, function(err, res) { 
      should.not.exist(err); 
      res.status.should.equal(200);
      console.log(res.body.data)
      done(); 
    });
  })

  it.only('详细', function (done) {
    request.get(`/api/catalog/product/2`)
    .set('x-auth-key', key)
    .set('x-auth-timestamp', timestamp)
    .set('x-auth-signature', tool.sign({}, secret+timestamp))
    .expect(200, function(err, res) { 
      should.not.exist(err); 
      res.status.should.equal(200);
      console.log(res.body.data)
      done(); 
    });
  })
});

