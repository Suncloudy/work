<template>
  <el-container>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">

        <!--<el-breadcrumb-item :to="{ path: '/' }" v-if="selectTitle[0] != null">{{selectTitle[0]}}</el-breadcrumb-item>-->
        <el-breadcrumb-item>安全设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改登录密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main class="bg_style">
      <div>
        <div style="">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
                   class="input_width">
            <el-form-item label="已绑定手机号" prop="phoneNumber" label-width="100px" class="width360">
              <div class="text_align_left" v-model="telNumber">
                <span>{{telNumber}}</span>
                <span class="check_style" @click="oldPwdValidation()">旧密码验证</span>
              </div>
            </el-form-item>
            <el-form-item label="图形验证码" prop="graphCode" label-width="100px">
              <el-row :gutter="4">
                <el-col :span="10">
                  <el-input type="text" v-model="ruleForm.graphCode" autocomplete="off"
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
            <el-form-item label="短信验证码" prop="messageCode" label-width="100px">
              <el-row :gutter="4" style="">
                <el-col :span="12">
                  <el-input v-model="ruleForm.messageCode" placeholder="请输入短信验证码"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="getMessageCode()" :disabled=disabled>{{btnTitle}}</el-button>
                  <!--<el-button @click="getMessageCode()">短信验证码</el-button>-->
                </el-col>
                <el-col :span="4">

                </el-col>
              </el-row>

            </el-form-item>
            <el-form-item
              prop="newPwd"
              label="新密码" label-width="100px" class="width360">
              <el-input v-model="ruleForm.newPwd" placeholder="输入输入6～20位新密码" autocomplete="off" type="password">

              </el-input>
              <el-row :gutter="4" class="width305">
                <el-col :span="5">
                  <div :class="[isRed?pwdSafeRedClass:pwdComplex,pwdSafeVerifySize]"></div>
                </el-col>
                <el-col :span="5">
                  <div :class="[isOrange?pwdSafeOrangeClass:pwdComplex,pwdSafeVerifySize]"></div>
                </el-col>
                <el-col :span="5">
                  <div :class="[isGreen?pwdSafeGreenClass:pwdComplex,pwdSafeVerifySize]"></div>
                </el-col>
                <el-col :span="9">
                  <div class="pwd_safe_prompt">
                    密码安全程度
                    <span v-model="pwdGrade">{{pwdGrade}}</span>
                  </div>

                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              prop="confirmPwd"
              label="确认密码" class="width360" label-width="100px">
              <el-input v-model="ruleForm.confirmPwd" placeholder="请再次输入新密码" autocomplete="off" type="password"></el-input>

            </el-form-item>
            <el-form-item>
              <el-button class="login_btn" type="primary" @click="sureModifyNewPwd()">确定</el-button>
            </el-form-item>

          </el-form>
          <div class="pwd_specification">密码由字母、数字、
            标点两种以上组成
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import Verify from '../../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {getImgCode, getMessageCode} from '../../../utils/publicMethods'
  export default {
    name: "ModifyPwdByCode",
    data() {
      var validatePwd2 = (rule, value, callback) => {
        if (this.ruleForm.newPwd !== '') {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm.newPwd) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        } else {
          callback(new Error('请先输入新密码'));
        }

      };
      return {
        countdownSecond: 60,
        disabled:false,
        btnTitle:'获取验证码',
        telNumber: '',
        svg: '',
        showImgCode: '',
        isShow: true,
        ruleForm: {
          graphCode: '',
          messageCode: '',
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
        rules: {
          // phoneNumber: [
          //   {validator: Verify.telephoneVerify, trigger: 'blur'}
          // ],
          //图形码
          graphCode: [
            {validator: Verify.graphCodeVerify, trigger: 'blur'},
            {max: 4, message: '长度4个字符', trigger: 'blur'}
          ],
          //短信验证码
          messageCode: [
            {type: 'number', validator: Verify.messageCodeVerify, trigger: 'blur'}
          ],
          newPwd: [
            {validator: Verify.validateNewPwd, trigger: 'blur'}
          ],
          confirmPwd: [
            {validator: validatePwd2, trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      if (Verify.validateIsNull(localStorage.getItem("phoneNumber"))) {
        this.telNumber = localStorage.getItem("phoneNumber");
      }
      this.getImgCode();
    },
    methods: {
      getImgCode() {
        getImgCode(this).then(res => {
          if (res.status === 200) {
            this.svg = res.data;
            this.isShow = false;
          } else {
            this.$message.error(res.statusText);
          }
        })
        // this.$get('/api/service/captcha', {
        //   width: '',
        //   height: '',
        // }).then(res => {
        //   if (res.status == 200) {
        //     this.svg = res.data;
        //     this.isShow = false;
        //   } else {
        //     alert(res.statusText);
        //   }
        // }).catch(function (reason) {
        //   console.log('catch:', reason);
        // });
      },
      refreshImgCode() {
        this.getImgCode();
      },
      //获取短信验证码
      getMessageCode() {
        if (Verify.validateIsNull(this.ruleForm.graphCode) &&
          (Verify.validateIsNull(this.telNumber))) {
          getMessageCode(this, this.ruleForm.graphCode,this.telNumber).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '已发送短信验证码，请查收',
                type: 'success'
              });
              this.codeCountDown();
            }else{
              this.$message.error(res.msg);
            }
          })
        } else {
          this.$message.error('请检查输入的手机号码和图形验证码是否合法');
        }
        // if (Verify.validateIsNull(this.ruleForm.graphCode) &&
        //   Verify.validateIsNull(this.telNumber)){
        //   this.$get('/api/service/sms', {
        //     captcha: this.ruleForm.graphCode,
        //     mobile: this.telNumber,
        //   }).then(res => {
        //     // console.log("test" + JSON.stringify(res));
        //     if (JSON.stringify(res.data.code) == 200) {
        //       this.$message({
        //         message: '已发送短信验证码，请查收',
        //         type: 'success'
        //       });
        //       this.codeCountDown();
        //       // Verify.codeCountDown(this.disabled,this.btnTitle);
        //     } else {
        //       swal("提示", res.data.msg, "error");
        //     }
        //   }).catch(function (reason) {
        //     console.log('catch:', reason);
        //   });
        // }else {
        //   swal("提示","请检查您输入的图形验证码是否合法", "error");
        // }
      },
      oldPwdValidation() {
        if (this.$route.query.modifyPwdFlag === 'person') {
          this.$router.push({path:'/SafeSetting'});
        }else if (this.$route.query.modifyPwdFlag === 'firm' ) {
          this.$router.push({path:'/FirmSafeSetting'});
        }
      },
      //确定通过短信验证码修改密码
      sureModifyNewPwd(){
        let id = '';
        debugger
        if (this.$route.query.modifyPwdFlag === 'person') {
          id= localStorage.getItem("userId");
        }else if (this.$route.query.modifyPwdFlag === 'firm' ) {
          id = localStorage.getItem("enterpriseId");
        }
        if (id === ''){
          swal("提示", "登录状态异常", "error");
          return
        }
        let modifyPwdUrl = '/api/personal/'+ id + '/passwordReplacement/perPasswordEditForNumber';
        if (Verify.validateIsNull(this.ruleForm.confirmPwd) &&
          Verify.validateIsNull(this.ruleForm.newPwd) &&
          Verify.validateIsNull(this.ruleForm.graphCode) &&
          Verify.validateIsNull(this.ruleForm.messageCode)){
          this.$put(modifyPwdUrl, {
            mobile:this.telNumber,
            captcha:this.ruleForm.graphCode,
            smsCode:this.ruleForm.messageCode,
            // originalPassword: this.$md5(this.resetPwdForm.oldPwd),
            newPassword: this.$md5(this.ruleForm.newPwd),
          }).then(res => {
            if (JSON.stringify(res.data.code) == 200) {
              swal("提示", "修改成功", "success");
              if (this.$route.query.modifyPwdFlag === 'person') {
                this.$router.push({path:'/SafeSetting'});
              }else if (this.$route.query.modifyPwdFlag === 'firm' ) {
                this.$router.push({path:'/FirmSafeSetting'});
              }
              //暂时没跳转登录页
              // this.$router.push({ path: '/'})
            } else {
              swal("提示", res.data.msg, "error");
            }
            // console.log("res=="+JSON.stringify(res))
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });
        }else {
          swal("提示", "请检查您输入的内容是否完善", "error");
        }
      },
      codeCountDown() {
        //倒计时
        let time = 60;
        let timer = setInterval(() => {
          if(time == 0) {
            clearInterval(timer);
            this.disabled = false;
            this.btnTitle = "获取验证码";
          } else {
            this.btnTitle =time + '秒后重试';
            this.disabled = true;
            time--
          }
        }, 1000);
      }
    },
    watch: {
      //监听密码的复杂度
      ruleForm: {
        handler(newName) {
          if (newName.newPwd.length > 0) {
            let modes = Verify.pwdComplexityCheck(newName.newPwd);
            if (modes == 1) {
              this.isRed = true;
              this.isOrange = false;
              this.isGreen = false;
              this.pwdGrade = '差';
            } else if (modes == 2) {
              this.isRed = true;
              this.isOrange = true;
              this.isGreen = false;
              this.pwdGrade = '中';
            } else if (modes == 3) {
              this.isRed = true;
              this.isOrange = true;
              this.isGreen = true;
              this.pwdGrade = '强';
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
      }
    }
  }
</script>

<style scoped>
  @import "../../../styles/personal/personal-center.scss";
  .header_bg {
    background-color: white;
    text-align: right;
    font-size: 18px;
    color: #333333;
  }
  .el-breadcrumb {
    font-size: 18px;
    line-height: 3.5;
    color: #333333;
  }
  .bg_style{
    background-color: white;
    margin-top: 10px;
  }
  .width360 {
    width: 360px;
  }
  .input_width {
    width: 460px;
  }
  .width305 {
    width: 305px;
    margin-top: 5px;
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

  .pwd_safe_margin_top {
    margin-top: 5px;
  }

  .nextStep {
    width: 288px;
    height: 43px;
    margin: 0 auto;
  }

  .btn_color {
    color: #FFFFFF;
    background-color: #33B2E8;
  }

  .pwdComplex {

    background: #C0C0C0;
  }

  .pwdSafeVerifySize {
    width: 55px;
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
    margin-right: 38%;
    margin-top: -23.6%;
  }
  .check_style {
    white-space: normal; /*文字换行*/
    font-size: 12px;
    color: #33B2E8;
    width: 115px;
    height: 38px;
    float: right;
    /*margin-right: 40%;*/
    /*margin-top: -31.0%;*/
  }

  .el-input__inner {
    width: 305px;
  }
</style>
