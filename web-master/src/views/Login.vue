<template>
  <div class="login_div">
    <login-header></login-header>
    <el-container class="login_container">
      <el-main>
        <div class="bg_img">
          <el-tabs type="border-card" class="login_box">
            <div class="hind_login">未注册用户可直接通过手机号登录</div>
            <el-tab-pane label="手机快速登录">
              <!--status-icon-->
              <el-form :model="loginRuleForm" :rules="loginRules" ref="loginRuleForm" input-width="305px"
                       class="demo-ruleForm">
                <el-form-item label="" prop="phoneNumber">
                  <el-input
                    placeholder="输入手机号，快速登录"
                    v-model="loginRuleForm.phoneNumber"
                    clearable>
                  </el-input>
                  <!--<el-input type="phone" v-model="loginRuleForm.phoneNumber" placeholder="输入手机号，快速登录"></el-input>-->
                </el-form-item>
                <el-form-item label="" prop="graphCode">
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-input style="" type="text" v-model="loginRuleForm.graphCode" autocomplete="off"
                                placeholder="请输入图形验证码"></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-button class="img_code" @click="getImgCode()" v-show="isShow">获取图形码</el-button>
                      <div v-html="svg" v-show="!isShow" class="img_code_height">
                        {{svg}}
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <span class="refresh_img_code" v-show="!isShow" @click="refreshImgCode()">换一换</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="" prop="messageCode">
                  <el-row :gutter="10">
                    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                      <el-input v-model="loginRuleForm.messageCode" placeholder="请输入短信验证码"></el-input>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" id="message_btn">
                      <el-button @click="getMessageCode()" :disabled=disabled >{{btnTitle}}</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item id="login_btn">
                  <el-button class="login_btn" type="primary" @click="submitForm()">登录</el-button>
                  <span class="forget_pwd" @click="forgetPwd()">忘记密码</span>
                </el-form-item>
                <hr>
                <el-row>
                  <el-button>微信登录</el-button>
                  <!--<el-button @click="forgetPwd()">忘记密码</el-button>-->
                </el-row>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="用户名登录">
              <el-form :model="loginRuleForm" :rules="loginRules" ref="loginRuleForm" label-width="">
                <el-form-item>
                  <el-col :span="12">
                    <el-select v-model="userClass" placeholder="个人用户" class="select_width">
                      <el-option
                        v-for="item in users"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="" prop="userName">
                  <el-input type="text" v-model="loginRuleForm.userName" autocomplete="off"
                            placeholder="手机号/用户名/邮箱"></el-input>
                </el-form-item>
                <el-form-item label="" prop="graphCode">
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-input style="" type="text" v-model="loginRuleForm.graphCode" autocomplete="off"
                                placeholder="请输入图形验证码"></el-input>
                    </el-col>
                    <el-col :span="8">
                      <!--<el-button class="img_code" @click="getImgCode()">获取图形码</el-button>-->
                      <div v-html="svg" v-show="!isShow" class="img_code_height">
                        {{svg}}
                      </div>
                      <div id="mysvg"></div>
                    </el-col>
                    <el-col :span="4">
                      <span class="refresh_img_code" @click="refreshImgCode()">换一换</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="" prop="pass">
                  <el-input type="password" v-model="loginRuleForm.pass" autocomplete="off"
                            placeholder="请输入密码"></el-input>
                  <span class="forget_pwd" @click="forgetPwd()">忘记密码</span>
                </el-form-item>

                <el-form-item>
                  <el-button class="login_btn" type="primary" @click="userPwdForm()">登录</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
    <login-footer></login-footer>
  </div>

</template>

<script>
  import VerifyUtils from '../utils/utils'
  import {getImgCode, getMessageCode} from '../utils/publicMethods'
  import LoginHeader from '../components/LoginHeader'
  import LoginFooter from '../components/LoginFooter'
  import Cookies from 'js-cookie'

  export default {
    name: "Login",
    components: {'login-header': LoginHeader, 'login-footer': LoginFooter},
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      var userName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          if (VerifyUtils.phoneNumberVerify(value) || VerifyUtils.emailVerify(value) || value.length !== 0) {
            callback();
          } else {
            callback(new Error('请输入正确格式的手机号'));
          }
          callback();
        }
      };
      return {
        svg: '',
        isShow: false,
        btnTitle: '获取短信验证码',
        disabled: false,
        users: [{
          value: 'personal',
          label: '个人用户'
        },
          {
            value: 'enterprise',
            label: '企业用户'
          }
        ],
        userClass: 'personal',
        loginRuleForm: {
          phoneNumber: '',
          graphCode: '',
          messageCode: '',
          pass: '',
          userName: ''
        },
        loginRules: {
          phoneNumber: [
            {validator: VerifyUtils.telephoneVerify, trigger: 'blur'},
            // {type: 'tel',message: '请输入正确的手机格式'}
          ],
          //图形码
          graphCode: [
            {validator: VerifyUtils.graphCodeVerify, trigger: 'blur'},
            {max: 4, message: '长度4个字符', trigger: 'blur'}
          ],
          //短信验证码
          messageCode: [
            {validator: VerifyUtils.messageCodeVerify, trigger: 'blur'}
          ],
          //密码
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          //用户名
          userName: [
            {validator: userName, trigger: 'blur'}
          ],
        },
      }
    },
    created() {
      localStorage.clear();
      this.getImgCode();
      //console.log(getImgCode(this))
    },
    mounted() {
    },
    methods: {
      submitForm() {
        console.log(this.loginRuleForm + JSON.stringify(this.loginRuleForm));
        this.$post('api/shortcutLogin', {
          captcha: this.loginRuleForm.graphCode,
          mobile: this.loginRuleForm.phoneNumber,
          smsCode: this.loginRuleForm.messageCode.toString()
          // verifyCode:this.loginRuleForm.messageCode.toString()
        }).then((res) => {
          // console.log("login" + JSON.stringify(res));
          if (res.data.code === 200) {
            let userInfo = res.data.data.Personal;
            localStorage.setItem('userId', userInfo.accountId);
            // localStorage.setItem("userId",userInfo.id);//id
            if (VerifyUtils.validateIsNull(userInfo.nickname)) {
              localStorage.setItem("nickname", userInfo.nickname);
            }
            if (VerifyUtils.validateIsNull(userInfo.name)) {
              localStorage.setItem("name", userInfo.name);
            }
            if (VerifyUtils.validateIsNull(res.data.data.phoneNumber)) {
              localStorage.setItem("phoneNumber", res.data.data.phoneNumber);
            }
            if (VerifyUtils.validateIsNull(userInfo.wechat)) {
              localStorage.setItem("weChat", userInfo.wechat);
            }
            if (VerifyUtils.validateIsNull(userInfo.email)) {
              localStorage.setItem("email", userInfo.email);
            }
            if (VerifyUtils.validateIsNull(userInfo.birthday)) {
              localStorage.setItem("birthday", userInfo.birthday);
            }
            localStorage.setItem("gender", userInfo.gender);//性别
//头像
            localStorage.setItem("avatar", userInfo.avatarFileId);
            // 存储token
            localStorage.setItem("accessToken", res.data.token);
            debugger
            // Cookies.setCookie('Admin-Token',res.data.token)
            this.$router.push({path: '/IndexPage'});
            localStorage.setItem("loginStatus", "1");
          } else {
            // alert(res.data.msg);
            this.$message.error(res.data.msg);
          }
        })
        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
        //     alert('submit!');
        //   } else {
        //     console.log('error submit!!');
        //     return false;
        //   }
        // });
      },
      //用户名密码登录
      userPwdForm() {
        localStorage.clear();
        var data = {
          captcha: this.loginRuleForm.graphCode,
          mobile: this.loginRuleForm.userName,
          accountType: this.userClass,
          password: this.$md5(this.loginRuleForm.pass)
        }
        this.$post('/api/login', data).then((res) => {
          // console.log("/api/login==" + JSON.stringify(res));
          if (res.data.code === 200) {
            console.log(JSON.stringify(res.data.data));
            let userInfo = res.data.data.user;
            //个人用户
            if (userInfo.type === "personal") {
              localStorage.setItem("userId", userInfo.Personal.accountId);//id
              localStorage.setItem("nickname", userInfo.Personal.nickname);
              localStorage.setItem("gender", userInfo.Personal.gender);//性别
              localStorage.setItem("name", userInfo.Personal.name);
              localStorage.setItem("email", userInfo.Personal.email);
              localStorage.setItem("weChat", userInfo.Personal.wechat);
              localStorage.setItem("birthday", userInfo.Personal.birthday);
              localStorage.setItem("phoneNumber", userInfo.phoneNumber);
              localStorage.setItem("avatar", userInfo.Personal.avatarFileId);
            }
            //企业用户
            if (userInfo.type === "enterprise") {
              localStorage.setItem("enterpriseId", userInfo.Enterprise.accountId);//id
              // {"enterpriseId":2,"name":"神州","email":"3123100","phoneNumber":"31233213"}}
              localStorage.setItem("name", userInfo.Enterprise.name);
              localStorage.setItem("email", userInfo.Enterprise.email);
              localStorage.setItem("weChat", userInfo.Enterprise.wechat);
              localStorage.setItem("contact", userInfo.Enterprise.contact);//联系人
              localStorage.setItem("phoneNumber", userInfo.phoneNumber);

            }
            localStorage.setItem("loginStatus", "1");//登录状态 1：登录 0：未登录
            localStorage.setItem("accessToken", res.data.data.accessToken);
            console.log("login==" + JSON.stringify(res));
            // Cookies.setCookie('Admin-Token',res.data.token)
            //xsrfCookieName
            //xsrfHeaderName
            // localStorage.setItem("CookieName",res.config.xsrfCookieName);
            this.$router.push({path: '/IndexPage'});

          } else {
            this.$message.error(res.data.msg);
            // alert(res.data.msg);
          }
          // alert("loginUser")
          //
        })
      },
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
      refreshImgCode() {
        this.getImgCode();
      },
      //获取短信验证码
      getMessageCode() {
        if (VerifyUtils.validateIsNull(this.loginRuleForm.graphCode) &&
          (VerifyUtils.validateIsNull(this.loginRuleForm.phoneNumber))) {
          getMessageCode(this, this.loginRuleForm.graphCode, this.loginRuleForm.phoneNumber).then(res => {
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
          if (time === 0) {
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      forgetPwd() {
        this.$router.push({path: '/ForgetPwd'})
      }
    }
  }
</script>

<style>

  .login_div {
    /*为了固定底部的footer*/
    padding-bottom: 154px;
    position: relative;
  }

  .login_container {
    background-color: white;
  }

  .el-main {
    padding: 0;
  }

  .bg_img {
    background: url('../assets/bg_login@2x.png');
    background-size: auto 100%;
    backgroundRepeat: "no-repeat";
    height: 519px;
    margin-top: 20px;
    /*margin-left: -20px;*/
    /*margin-right: -20px;*/
  }

  .login_box {
    width: 350px;
    margin-right: 15rem;
    margin-top: 1rem;
    float: right;
  }

  .login_box .el-tabs__item {
    width: 176px;
  }

  .login_box .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    border-top: 1px solid #33B2E8;
  }

  .login_btn {
    width: 306px;
    height: 43px;
    background-color: #33B2E8;
    text-align: center;
    border-width: 0px;
  }

  .img_code_height {
    height: 40px;
  }

  .refresh_img_code {
    font-size: 10px;
    line-height: 12px;
    color: red;
  }

  /*选择框的宽度*/
  .select_width {
    width: 320px;
  }

  /*提示登录语*/
  .hind_login {
    width: 306px;
    height: 20px;
    background: rgba(190, 233, 250, 1);
    border: 1px solid rgba(51, 178, 232, 1);
    color: #33B2E8;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .forget_pwd {
    font-size: 13px;
    color: #33B2E8;
    float: right;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    color: #404040;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    color: #404040;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #404040;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    color: #009BDD;
  }

  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: #009BDD;
  }

  /*设置tab选中的样式*/
  .login_box .el-tabs__item.is-active {
    /*border-top: 0px solid #009BDD;*/
    border-bottom: 2px solid #009BDD;
  }
  .login_btn .el-button:focus, .el-button:hover {
      color: white;
    border-color: #089EDE;
  }
  .login_btn .el-button--primary:focus, .el-button--primary:hover {
    border-width: 0px;
    color: white;
  }


</style>
