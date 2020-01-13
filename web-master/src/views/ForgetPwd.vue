<template>
  <div class="forget_pwd">
    <login-header></login-header>
    <el-container class="reset_pwd_box">
      <el-main class="">
        <el-steps :active="active" align-center>
          <el-step title="输入账号" description=""></el-step>
          <el-step title="验证身份" description=""></el-step>
          <el-step title="重置密码" description=""></el-step>
          <el-step title="重置成功" description=""></el-step>
        </el-steps>
        <hr class="step_hr_color"/>
        <div class="input_padding" v-if="step === 0">
          <el-form :model="numberValidateForm" ref="numberValidateForm" :rules="phoneNumberRules" label-width="">
            <el-form-item
              prop="tel"
              label="">
              <el-input v-model="numberValidateForm.tel" placeholder="输入注册手机号"></el-input>
              <!--<div class="container">-->
              <!--<div id="dragCaptcha" class="nc-container"></div>-->
              <!--</div>-->
              <!--<div>{{msg}}</div>-->
            </el-form-item>
            <div>
              <slide-verify :l="42"
                            :r="10"
                            :w="310"
                            :h="155"
                            slider-text="向右滑动"
                            @success="onSuccess"
                            @fail="onFail"
                            @refresh="onRefresh"
              ></slide-verify>
            </div>
            <el-form-item class="margin_top15">
              <el-button class="nextStep btn_color" @click="telVerifyStep()">下一步</el-button>
              <!--<el-button @click="resetForm('numberValidateForm')">重置</el-button>-->
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="step === 1" class="verify_box">
          <el-form>
            <el-row :gutter="30">
              <el-col :span="14">
                <el-input v-model="captcha" placeholder="请输入图形验证码"></el-input>
              </el-col>
              <el-col :span="5">
                <el-button @click="getImgCode()" v-show="isShow">获取图形验证码</el-button>
                <div v-html="svg" v-show="!isShow" class="img_code_height">
                  {{svg}}
                </div>
              </el-col>
              <el-col :span="5" style="padding-left: 25px;padding-right: 5px">
                <p class="refresh_img_code" v-show="!isShow" @click="refreshImgCode()">换一换</p>
              </el-col>
            </el-row>
            <el-row class="input_margin_top" :gutter="30">
              <el-col :span="14">
                <el-input v-model="msgCode" placeholder="请输入短信验证码"></el-input>
              </el-col>
              <el-col :span="10">
                <el-button @click="getMessageCode()" :disabled=disabled>{{btnTitle}}</el-button>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="" class="input_margin_top nextStep btn_color" @click="submitVerifyForm()">下一步</el-button>
              <!--<el-button @click="resetForm('numberValidateForm')">重置</el-button>-->
            </el-form-item>
            <el-button type="text" class="mail_verify">通过邮箱验证>></el-button>
          </el-form>
        </div>
        <div v-else-if="step === 2">
          <el-form class="input_padding" :model="resetPwdForm" status-icon :rules="resetPwdRules" ref="resetPwdForm">
            <el-row>
              <img src="../assets/sccg_icon_login@2x.png" height="12" width="12"/>
              <span class="setting_prompt">验证成功，请设置新密码</span>
            </el-row>
            <el-form-item
              prop="newPwd"
              label="">
              <el-input type="password" v-model="resetPwdForm.newPwd" placeholder="输入输入6～20位新密码"
                        class="input_margin_top"
                        autocomplete="off">

              </el-input>
              <el-row :gutter="3" class="pwd_safe_margin_top">
                <el-col :span="6">
                  <div :class="[isRed?pwdSafeRedClass:pwdComplex,pwdSafeVerifySize]"></div>
                </el-col>
                <el-col :span="6">
                  <div :class="[isOrange?pwdSafeOrangeClass:pwdComplex,pwdSafeVerifySize]"></div>
                </el-col>
                <el-col :span="6">
                  <div :class="[isGreen?pwdSafeGreenClass:pwdComplex,pwdSafeVerifySize]"></div>
                </el-col>
                <el-col :span="6">
                  <div class="pwd_safe_prompt">
                    密码安全程度
                    <span v-model="pwdGrade"></span>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              prop="confirmPwd"
              label="">
              <el-input type="password" v-model="resetPwdForm.confirmPwd" placeholder="请再次输入新密码"
                        autocomplete="off"></el-input>

            </el-form-item>
            <el-form-item>
              <el-button type="" class="nextStep btn_color" @click="confirmPwdForm('resetPwdForm')">确定</el-button>
              <!--<el-button @click="resetForm('numberValidateForm')">重置</el-button>-->
            </el-form-item>

          </el-form>
          <div class="pwd_specification">密码由字母、数字、
            标点两种以上组成
          </div>
        </div>
        <div v-else-if="step === 3">
          <el-form class="input_padding">
            <el-row>
              <img src="../assets/sccg_icon_login@2x.png" class="success_img" height="24" width="24"/>
              <span class="setting_success">重置成功</span>
            </el-row>
            <p class="success_prompt">恭喜您：重置登录密码成功，请牢记新密码</p>
            <div>
              <el-button type="" class="againLogin btn_color input_margin_top" @click="againLogin()">重新登录</el-button>
              <br/>
              <!--<el-button @click="resetForm('numberValidateForm')">重置</el-button>-->
              <el-button type="text" class="back_index">返回首页>></el-button>
            </div>

          </el-form>
        </div>
      </el-main>
    </el-container>
    <login-footer></login-footer>
  </div>

</template>

<script>
  import LoginHeader from "../components/LoginHeader";
  import LoginFooter from "../components/LoginFooter";
  import Verify from "../utils/utils";
  import {getImgCode, getMessageCode} from '../utils/publicMethods'
  import "../styles/js/jquery-1.11.0.min.js"


  export default {
    components: {'login-header': LoginHeader, 'login-footer': LoginFooter},
    data() {
      var validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (Verify.pwdComplexityCheck(value) && value.length > 5 && value.length < 21) {
            // alert(value)
          } else {
            callback(new Error('密码由字母、数字、标点两种以上且6～20位组成'));
          }
        }
        callback();
      };
      var validatePwd2 = (rule, value, callback) => {
        if (this.resetPwdForm.newPwd !== '') {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.resetPwdForm.newPwd) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        } else {
          callback(new Error('请先输入新密码'));
        }

      };
      return {
        // msg: '', //滑块校验提示
        btnTitle: '获取短信验证码',
        disabled: false,
        checkMark: 0,
        svg: '',
        isShow: true,
        active: 0,
        step: 0,
        numberValidateForm: {
          tel: '',
          // pwd: ''
        },
        phoneNumberRules: {
          tel: [
            {validator: Verify.telephoneVerify, trigger: 'blur'}
          ]
        },
        captcha: '',//图形验证码
        msgCode: '',//短信验证码
        resetPwdForm: {
          newPwd: '',
          confirmPwd: ''
        },
        pwdGrade: '差',
        pwdSafeVerifySize: 'pwdSafeVerifySize',
        isRed: false,
        isOrange: false,
        isGreen: false,
        pwdSafeRedClass: 'pwdSafeRedClass',//安全度差
        pwdComplex: 'pwdComplex',
        pwdSafeOrangeClass: 'pwdSafeOrangeClass',//中级
        pwdSafeGreenClass: 'pwdSafeGreenClass',//复杂
        resetPwdRules: {
          newPwd: [
            {validator: validatePwd, trigger: 'blur'}
          ],
          confirmPwd: [
            {validator: validatePwd2, trigger: 'blur'}
          ],
        },
        msgFlag: false,
      }
    },
    created() {
      this.getImgCode();
    },
    mounted() {
    },
    methods: {
      onSuccess() {
        // this.msg = '校验成功';
        this.checkMark = 1;
        this.$message({
          message: '校验成功',
          type: 'success'
        });
      },
      onFail() {
        this.checkMark = 2;
        // this.msg = '校验失败,请稍候重试';
        this.$message.error('校验异常,请稍候重试');
      },
      onRefresh() {
        // this.msg = '请刷新再试一下';
        this.$message('请刷新再试一下');
      },
      //输入账号
      telVerifyStep() {
        if (Verify.phoneNumberVerify(this.numberValidateForm.tel)) {
          if (this.checkMark === 1) {
            this.$post('/api/user/findPassword', {
              mobile: this.numberValidateForm.tel,
            }).then(res => {
              console.log("tel==" + JSON.stringify(res))
              if (res.data.code === 200) {
                let taskId = res.data.data.taskId;
                sessionStorage.setItem("taskId", taskId);
                this.active = 1;
                this.step = 1;
              } else {
                alert(res.data.msg);
              }
            }).catch(function (reason) {
              console.log('catch:', reason);
            });
          } else {
            this.$message('请进行滑块校验');
          }
        } else {
          this.active = 0;
          this.step = 0;
          this.$message('请输入手机号码');
        }
      },
      //提交验证
      submitVerifyForm() {
        if (this.msgFlag = true) {
          let taskId = sessionStorage.getItem("taskId");
          let verifyUrl = "/api/user/findPassword/" + taskId + "/validate";
          this.$post(verifyUrl, {
            taskId: taskId,
            mobile: this.numberValidateForm.tel,
            captcha: this.captcha,
            smsCode: this.msgCode
          }).then(res => {
            if (res.data.code === 200) {
              this.active = 2;
              this.step = 2;
            }
            // console.log(JSON.stringify(res))
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });

        } else {
          alert("请检查您输入的验证码是否正确");
        }
      },
      //确认密码
      confirmPwdForm(pwd) {
        this.$refs[pwd].validate((valid) => {
          if (valid) {
            let taskId = sessionStorage.getItem("taskId");
            let verifyUrl = "/api/user/findPassword/" + taskId + "/reset";
            this.$post(verifyUrl, {
              taskId: taskId,
              newPassword: this.$md5(this.resetPwdForm.newPwd)
            }).then(res => {
              // console.log(JSON.stringify(res));
              if (res.data.code === 200) {
                this.active = 3
                this.step = 3;
              }
              // console.log(JSON.stringify(res))
            }).catch(function (reason) {
              console.log(JSON.stringify(reason));
            });
          } else {
            console.log('请检查密码是否输入合法');
            return false;
          }
        });
      },
      //获取图片验证码
      getImgCode() {
        getImgCode(this).then(res => {
          if (res.status === 200) {
            this.svg = res.data;
            this.isShow = false;
          } else {
            this.$message.error(res.statusText);
          }
        })
      },
      //刷新图片验证码
      refreshImgCode() {
        this.getImgCode();
      },
      //获取短信验证码
      getMessageCode() {
        if (Verify.validateIsNull(this.captcha) &&
          (Verify.validateIsNull(this.numberValidateForm.tel))) {
          getMessageCode(this, this.captcha, this.numberValidateForm.tel).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '已发送短信验证码，请查收',
                type: 'success'
              });
              this.codeCountDown();
            } else {
              this.$message.error(res.msg);
            }
          })
        } else {
          this.$message.error('请检查输入的手机号码和图形验证码是否合法');
        }
      },
      //倒计时
      codeCountDown() {
        //倒计时
        let time = 60;
        let timer = setInterval(() => {
          if (time == 0) {
            clearInterval(timer);
            this.disabled = false;
            this.btnTitle = "获取验证码";
          } else {
            this.btnTitle = time + '秒后重试';
            this.disabled = true;
            time--
          }
        }, 1000);
      },
      againLogin() {
        this.$router.push({path: '/Login'});
        this.active = 3
        this.step = 3;
      },

    },
    watch: {
      //监听密码的复杂度
      resetPwdForm: {
        handler(newName) {
          if (newName.newPwd.length > 0) {
            let modes = Verify.pwdComplexityCheck(newName.newPwd);
            if (modes == 1) {
              this.isRed = true;
              this.isOrange = false;
              this.isGreen = false;
            } else if (modes == 2) {
              this.isRed = true;
              this.isOrange = true;
              this.isGreen = false;
            } else if (modes == 3) {
              this.isRed = true;
              this.isOrange = true;
              this.isGreen = true;
            } else {
              this.isRed = false;
              this.isOrange = false;
              this.isGreen = false;
            }
          } else {
            this.isRed = false;
            this.isOrange = false;
            this.isGreen = false;
          }
        },
        deep: true,
        immediate: true
      },
    }
  }
</script>
<style>
  @import "../styles/css/drag.css";

  .forget_pwd {
    background-color: white;
  }

  .step_hr_color {
    margin-top: 33px;
    margin-bottom: 20px;
    /*width: 550px;*/
    border: 1px solid #E6EBEE;
  }
  .el-step__title{
    font-size: 14px;
  }
  .reset_pwd_box {
    width: 654px;
    margin: 0 auto;
  }

  .input_padding {
    width: 305px;
    margin: 0 auto;
  }

  /*下一步进度条*/
  .nextStep {
    width: 312px;
    height: 43px;
    margin: 0 auto;
  }

  .el-step__title.is-finish {
    color: #33B2E8;
    border-color: #33B2E8;
  }

  .el-step__head.is-finish {
    color: #fff;
  }

  .el-step__icon {
    background-color: #33B2E8;
  }

  .el-step__icon.is-text {
    border: 0px solid #33B2E8;
  }

  .el-step__icon-inner {
    color: #fff;
  }

  .el-step__line-inner {
    border: 1px solid #33B2E8;
  }

  .el-step__line-inner
  .el-step__line {
    color: #33B2E8;
  }

  el-step text {
    font-size: 14px;
  }

  /*验证码框*/
  .verify_box {
    width: 306px;
    margin: 0 auto;
  }

  .mail_verify {
    float: left;
  }

  .input_margin_top {
    margin-top: 22px
  }

  /*重置密码*/
  .setting_prompt {
    font-size: 14px;
    color: #404040;
  }

  .pwd_safe_margin_top {
    margin-top: 5px;
  }

  .pwdComplex {

    background: #C0C0C0;
  }

  .pwdSafeVerifySize {
    width: 66px;
    height: 8px;
  }

  .pwd_safe_prompt {
    font-size: 12px;
    color: #666666;
    line-height: 0.8;
  }

  .pwd_specification {
    white-space: normal; /*文字换行*/
    font-size: 12px;
    color: #33B2E8;
    border: 1px solid #33B2E8;
    background: rgba(190, 233, 250, 1);
    width: 115px;
    height: 38px;
    float: right;
    margin-right: 4%;
    margin-top: -33.4%;
  }

  .pwdSafeRedClass {
    background: #E60012;
  }

  .pwdSafeOrangeClass {
    background: #F39800;
  }

  .pwdSafeGreenClass {
    background: #5FBF4D;
  }

  /*重置成功*/
  .success_img {
    vertical-align: bottom;
  }

  .setting_success {
    vertical-align: baseline;
    font-size: 18px;
    color: #404040;
  }

  .success_prompt {
    font-size: 14px;
    color: #666666;
    margin-top: 26px;
  }

  .againLogin {
    width: 166px;
    height: 43px;
  }

  .btn_color {
    color: #FFFFFF;
    background-color: #33B2E8;
  }

  .el-button--primary {
    color: #fff;
    background-color: #33B2E8;
    border-color: #33B2E8;
  }

  .back_index {
    font-size: 14px;
    color: #33B2E8;
    padding-right: 30%;
  }

  .img_code_height {
    height: 40px;
  }

  .refresh_img_code {
    font-size: 10px;
    line-height: 20px;
    color: red;
  }

  /*.step_btn {*/
  /*width: 44px;*/
  /*height: 44px;*/
  /*}*/

  /*.line {*/
  /*display: inline-block;*/
  /*width: 78px;*/
  /*border-top: 1px solid #C0C0C0;*/
  /*}*/
</style>
