'use strict';

const crypto = require('crypto');
var should = require('should');
var request = require('supertest');
const {tool} = require('../../../../libs/utils');
request = request('http://127.0.0.1:6128');

describe('address.js', function() {

    it('获取地址', function (done) {
        request.get('/api/personal/4/address')
        .expect(200, function(err, res) { 
        should.not.exist(err); 
        res.status.should.equal(200);
        console.log(res.body.data)
        done(); 
        });
    })

    it('添加地址', function (done) {
        request.put('/api/personal/4/address')
        .send({
            nickname:"卢锡安",
            name:"奥巴马",
            gender:1,
            email:"1591316186@qq.com"
        })
        .expect(200, function(err, res) { 
        should.not.exist(err); 
        res.status.should.equal(200);
        console.log(res.body.data)
        done(); 
        });
    })
});

