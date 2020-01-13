'use strict';

var should = require('should');
var request = require('supertest');
request = request('http://127.0.0.1:6128');
//request = request('http://111.230.240.71:6128');

const {tool} = require('../../libs/utils')

describe('广告模埠', function() {
  let key = "eg1QBJtoDwSnPVMT";
  let secret = "FoG46jAJxDlgoRs51xeQgOpffBfdPAXg";

  it('商品广告位', function (done) {
    let timestamp = Date.now()
    let query = '';
    request.get('/api/ad/products/indexMedicalExaminationPackage')
    .set('x-auth-key', key)
    .set('x-auth-timestamp', timestamp)
    .set('x-auth-signature', tool.sign(query, secret+timestamp))
    .expect(200, function(err, res) { 
      should.not.exist(err); 
      res.status.should.equal(200);
      console.log(res.body.data[0])
      // res.body.code.should.equal(200);
      done(); 
    });
  })
});

