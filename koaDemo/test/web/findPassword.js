'use strict';
var should = require('should');
var request = require('supertest');
var manager = 'http://127.0.0.1:3000';
//mocha单元测试讲解 http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html
//var app = 'http://test.sweetydaddy.com';//管理端地址
//var app = 'http://apitest.sweetydaddy.com';


describe('找回密码相关',function () {
    let verifyCode = '0073';
    let mobile = '15510120873';
    let taskId = '';

    //找回密码任务创建
   before(function (done) {
        request(manager)
            .post('/user/findPassword')
            .send({
                mobile:'15510120873',
            })
            .expect(200) //断言希望得到返回http状态码
            .end(function(err, res) {
                console.log(err);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                console.info(res.body);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                taskId=res.body.data.taskId;
                done();
            });
    });

     //找回密码验证接口
     it('找回密码验证接口',function (done) {
        request(manager)
            .post('/user/findPassword/'+taskId+'/validate')
            .send({
                mobile:mobile,
                verifyCode:verifyCode,
            })
            .expect(200) //断言希望得到返回http状态码
            .end(function(err, res) {
                console.log(err);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                console.info(res.body);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                done();
            });
    });

     //找回密码重置接口
    after(function (done) {
        request(manager)
            .post('/user/findPassword/'+taskId+'/reset')
            .send({
                newPassword:'96e79218965eb72c92a549dd5a330112',
            })
            .expect(200) //断言希望得到返回http状态码
            .end(function(err, res) {
                console.log(err);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                console.info(res.body);//得到返回我们可以用2.2中的断言对返回结果进行判断。
                done();
            });
    });
})