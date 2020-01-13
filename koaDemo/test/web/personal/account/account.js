'use strict';

const crypto = require('crypto');
var should = require('should');
var request = require('supertest');
const {tool} = require('../../../../libs/utils');
request = request('http://127.0.0.1:6128');

describe('account.js 测试 koa测试类到底怎么用', function() {
    let key = 'eg1QBJtoDwSnPVMT';
    let secret = 'FoG46jAJxDlgoRs51xeQgOpffBfdPAXg';
    let timestamp = Date.now()
    let cookies;
    before('登录', function (done) {
        request.post('/api/login')
        .send({
            username: 'root',
            password: crypto.createHash('md5').update('111111').digest('hex')
        })
        .expect(200, function(err, res) { 
            should.not.exist(err); 
            res.status.should.equal(200);
            cookies = res.headers['set-cookie'];
            done(); 
        });
    })

    it('获取个人信息', function (done) {
        request.get('/api/personal/4')
        .expect(200, function(err, res) { 
        should.not.exist(err); 
        res.status.should.equal(200);
        console.log(res.body.data)
        done(); 
        });
    })

    it('编辑个人信息', function (done) {
        request.put('/api/personal/4')
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

