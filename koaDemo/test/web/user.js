'use strict';
var should = require('should');
var request = require('supertest');
var manager = 'http://127.0.0.1:6128';
//var app = 'http://test.sweetydaddy.com';//管理端地址
//var app = 'http://apitest.sweetydaddy.com';


describe('api用户相关接口',function () {
    
    let userId='2';
    //用户快捷登陆接口
    it.only('用户登陆接口',function (done) {
        request(manager)
            .post('/api/user/loginSpeed')
            .send({
                mobile:'15510120873',
                captcha:'1234',
                verifyCode:'123456',
            })
            .expect(200) //断言希望得到返回http状态码
            .end(function(err, res) {
                console.log(err);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                console.info(res.body);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                done();
            });
    });

     //用户账户密码登陆
     it('用户账户密码登陆',function (done) {
        request(manager)
            .post('/api/user/login')
            .send({
                mobile:'18698929217',
                accountType:'enterprise',
                password:'666666',//111111的加密结果
                captcha:'1234'
            })
            .expect(200) //断言希望得到返回http状态码
            .end(function(err, res) {
                console.log(err);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                console.info(res.body);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                done();
            });
    });

     //用户基本信息编辑
     it('用户基本信息编辑',function (done) {
        request(manager)
            .post('/api/user/profile/'+userId)
            .send({
                name:'哈哈哈',
            })
            .expect(200) //断言希望得到返回http状态码
            .end(function(err, res) {
                console.log(err);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                console.info(res.body);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                done();
            });
    });

     //用户修改密码
     it('用户修改密码',function (done) {
        request(manager)
            .post('/api/user/password/'+userId)
            .send({
                originalPassword:'666666',
                newPassword:'111111',
            })
            .expect(200) //断言希望得到返回http状态码
            .end(function(err, res) {
                console.log(err);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                console.info(res.body);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                done();
            });
    });
})