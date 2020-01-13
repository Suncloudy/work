<template>
  <div>
    <div>
      <el-header class="header_bg">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>{{(asideNavTitle[0] === '' || asideNavTitle[0] === undefined )?
              '账号管理':asideNavTitle[0]}}
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{(asideNavTitle[1] === '' || asideNavTitle[1] === undefined )?
              '安全设置':asideNavTitle[1]}}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-breadcrumb>
      </el-header>
      <!--:class="(modifyClass=!whetherEmail)?(!whetherTel):!(whetherPwd)-->
      <div class="margin_top15 white_bg_color padding_left20" :class="{modifyClass:whether}">
        <div class="text_align_left">
          <el-row>
            <el-col :span="3">
              <p class="left_title">登录账号</p>
            </el-col>
            <el-col :span="9">
              <p class="right_list_font">
                {{loginAccount}}
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <p class="left_title">账号ID</p>
            </el-col>
            <el-col :span="9">
              <p class="right_list_font">
                {{accountID}}
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <p class="left_title">注册时间</p>
            </el-col>
            <el-col :span="9">
              <p class="right_list_font">
                {{registerTime}}
              </p>
            </el-col>
          </el-row>
          <hr class="margin_right20">
          <el-row>
            <el-col :span="3">
              <p class="left_title">登录密码</p>
            </el-col>
            <el-col :span="9">
              <p class="right_list_font">
                建议您定期更换密码，并设置一个包含字母，符号或数字中至少两项且长度超过6位的密码。
              </p>
            </el-col>
            <el-col :span="4" class="text_align_center">
              <p v-if="pwdStatus === true">
                <img src="../../assets/firm/sccg_icon_login@2x.png" height="16" width="16"/>
                <span>已设置</span>
              </p>
              <p v-else="pwdStatus === false">
                <img src="../../assets/firm/weishezhi_icon@2x.png" height="16" width="16"/>
                <span>未设置</span>
              </p>
            </el-col>
            <el-col :span="8">
              <el-button class="modify_btn" @click="modifyBindPwd()" size="small">修改</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <p class="left_title">安全手机号</p>
            </el-col>
            <el-col :span="9">
              <p class="right_list_font">{{safeTel}}<span class="left_title">[手机号可用于登录、找回密码]</span></p>
            </el-col>
            <el-col :span="4" class="text_align_center">
              <p v-if="safeTelStatus === true">
                <img src="../../assets/firm/sccg_icon_login@2x.png" height="16" width="16"/>
                <span>已设置</span>
              </p>
              <p v-else="safeTelStatus === false">
                <img src="../../assets/firm/weishezhi_icon@2x.png" height="16" width="16"/>
                <span>未设置</span>
              </p>
            </el-col>
            <el-col :span="8">
              <el-button class="modify_btn" @click="modifyBindTel()" size="small">修改</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <p class="left_title">安全邮箱</p>
            </el-col>
            <el-col :span="9">
              <!--<p class="right_list_font">{{safeEmail.length !==0?safeEmail:'未设置'}}<span class="left_title">[邮箱可用于登录、找回密码]</span></p>-->
            </el-col>
            <el-col :span="4" class="text_align_center">
              <p v-if="safeEmailStatus === true">
                <img src="../../assets/firm/sccg_icon_login@2x.png" height="16" width="16"/>
                <span>已设置</span>
              </p>
              <p v-else="safeEmailStatus === false">
                <img src="../../assets/firm/weishezhi_icon@2x.png" height="16" width="16"/>
                <span>未设置</span>
              </p>
            </el-col>
            <el-col :span="8">
              <el-button class="modify_btn" @click="modifyBindEmail()" size="small">修改</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--修改邮箱-->
      <el-row class="white_bg_color bind_email_div display_none" :class="{modify:isSelectedModifyEmail}">
        <el-col :span="12">
          <el-form :model="emailForm" ref="emailForm" label-width="100px">
            <el-form-item label="已绑定邮箱" prop="bindState">
              <div v-model="emailForm.bindState" class="text_align_left unbind">{{this.emailForm.bindState===true?safeEmail:'未绑定'}}</div>
            </el-form-item>
            <el-form-item
              prop="email"
              label="邮箱" :rules="rules">
              <el-input v-model="emailForm.email" placeholder="请输入要绑定的邮箱"></el-input>
              <p class="verify_hint"><span class="verify_star">*</span>修改或绑定邮箱后，请登录邮箱验证</p>
              <el-button class="confirm_btn" @click="confirmBindEmail()">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <!--修改手机号-->
      <div class="white_bg_color bind_email_div display_none" :class="{modify:isSelectedModifyTel}">
        <el-form :model="ruleForm" :rules="telRules" ref="ruleForm"
                 class="input_width">
          <el-form-item label="已绑定手机号" prop="telNumber" label-width="120px">
            <div v-model="ruleForm.telNumber" class="text_align_left unbind">{{ruleForm.telNumber}}</div>
          </el-form-item>
          <el-form-item label="手机号" prop="phoneNumber" label-width="90px">
            <el-input type="tel" v-model="ruleForm.phoneNumber"
                      placeholder="请输入要绑定的手机号"></el-input>
          </el-form-item>
          <el-form-item label="图形验证码" prop="graphCode" label-width="90px">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-input type="text" v-model="ruleForm.graphCode" placeholder="请输入图形验证码"></el-input>
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
          <el-form-item label="短信验证码" prop="messageCode" label-width="90px">
            <el-row :gutter="10" style="">
              <el-col :span="12">
                <el-input v-model="ruleForm.messageCode" placeholder="请输入短信验证码"></el-input>
              </el-col>
              <el-col :span="8">
                <el-button @click="getMessageCode()" :disabled=disabled>{{btnTitle}}</el-button>
              </el-col>
              <el-col :span="4">

              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item>
            <el-button class="login_btn" type="primary" @click="confirmModifyNewTel()">确定</el-button>
          </el-form-item>

        </el-form>
      </div>
      <!--修改密码-->
      <div class="white_bg_color bind_email_div display_none" :class="{modify:isSelectedModifyPwd}">
        <el-form :model="resetPwdForm" status-icon :rules="resetPwdRules" ref="resetPwdForm" label-width="80px">
          <el-form-item
            prop="oldPwd"
            label="原密码" class="pws_verify_width padding_top10">
            <el-row>
              <el-col :span="16">
                <el-input v-model="resetPwdForm.oldPwd" placeholder="请输入原密码" autocomplete="off" type="password"></el-input>
              </el-col>
              <el-col :span="6">
                <span class="code_specification" @click="messageCodeEvent()">
                  短信验证码验证
                </span>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item
            prop="newPwd"
            label="新密码" label-width="80px" class="width360">
            <el-input v-model="resetPwdForm.newPwd" placeholder="输入输入6～20位新密码" autocomplete="off" type="password">
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
            label="确认密码" class="width360">
            <el-input v-model="resetPwdForm.confirmPwd" placeholder="请再次输入新密码" autocomplete="off"
                      type="password"></el-input>

          </el-form-item>
          <el-form-item
            prop=""
            label="" class="width360">
            <el-button type="text" class="nextStep btn_color" @click="confirmModifyPwd()">确定</el-button>
          </el-form-item>
        </el-form>
        <div class="pwd_specification">密码由字母、数字、
          标点两种以上组成
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Verify from '../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {mapGetters} from 'vuex'
  import {getImgCode, getMessageCode} from '../../utils/publicMethods'
  // import FirmModifyBindTel from "../../components/firm/FirmModifyBindTel"
  export default {
    name: "FirmSafeSetting",
    props: ['selectTitle'],

    data() {
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
        btnTitle:'获取短信验证码',
        disabled:false,
        safeSetting: '安全设置>',
        whether:false,
        whetherEmail: false,//修改邮箱
        whetherTel: false,//修改手机号
        whetherPwd: false,//修改密码
        isSelectedModifyEmail:false,
        isSelectedModifyTel:false,
        isSelectedModifyPwd:false,
        loginAccount: '',//登录账号
        accountID: '',//账号id
        registerTime: '',//注册时间
        safeTel: '',
        safeEmail:'',
        pwdStatus:false,//密码设置状态
        safeTelStatus:false,
        safeEmailStatus:false,//安全邮箱的状态
        emailForm: {
          bindState: false,
          email: ''
        },
        rules: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        svg: '',
        showImgCode: '',
        isShow: false,
        ruleForm: {
          telNumber: '',
          phoneNumber: '',
          graphCode: '',
          messageCode: '',
        },
        telRules: {
          phoneNumber: [
            {validator: Verify.telephoneVerify, trigger: 'blur'}
          ],
          //图形码
          graphCode: [
            {validator: Verify.graphCodeVerify, trigger: 'blur'}
          ],
          //短信验证码
          messageCode: [
            {type: 'number', validator: Verify.messageCodeVerify, trigger: 'blur'}
          ],
        },
        resetPwdForm: {
          oldPwd: '',
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
          oldPwd: [
            {validator: Verify.validateOldPwd, trigger: 'blur'}
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
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      // this.ruleForm.telNumber = localStorage.getItem("phoneNumber");
      this.safeSettingInfo();
    },
    methods: {
      //获取企业安全设置信息
      safeSettingInfo(){
        let enterpriseId = localStorage.getItem("enterpriseId");
        var safeSettingInfo = '/api/enterprise/safeSetting/' + enterpriseId;
        let _self = this;
        _self.$get(safeSettingInfo, {}).then(res => {
          if (res.data.code === 200) {
            if(Verify.validateIsNull(res.data.data.username)){
              _self.loginAccount = res.data.data.username;
            }
            if(Verify.validateIsNull(res.data.data.enterpriseId)){
              _self.accountID = res.data.data.enterpriseId;
            }
            if(Verify.validateIsNull(res.data.data.phoneNumber)){
              _self.safeTel = res.data.data.phoneNumber;
              _self.ruleForm.telNumber = res.data.data.phoneNumber; //修改手机号页以绑定的手机号
            }
            if(Verify.validateIsNull(res.data.data.email)){
              _self.safeEmail = res.data.data.email;
            }
            _self.registerTime = Verify.convertDate(res.data.data.createdAt);
            _self.pwdStatus = res.data.data.passwordSetting;
            _self.safeTelStatus = res.data.data.phoneNumberSetting;//安全手机号的状态
            _self.safeEmailStatus = res.data.data.emailStatus;//安全邮箱的状态
            // console.log("safeSetting==" + JSON.stringify(res.data.data));
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //修改绑定手机号
      modifyBindTel() {
        this.getImgCode();
        this.whether = !this.whether;
        this.isSelectedModifyTel = true;
        this.safeSetting = "安全设置>修改手机号";
      },
      //修改密码
      modifyBindPwd() {
        this.isSelectedModifyPwd = true;
        this.whether = !this.whether;
        this.safeSetting = "安全设置>修改密码";
        },
      //修改绑定的邮箱
      modifyBindEmail() {
        this.isSelectedModifyEmail = true;
        this.whether = !this.whether;
        this.safeSetting = "安全设置>绑定邮箱";
      },
      messageCodeEvent(){
        this.$router.push({path:'/ModifyPwdByCode',query:{'modifyPwdFlag':'firm'}});
      },
      //确认修改绑定手机号
      confirmModifyNewTel() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let modifyTelUrl = "/api/enterprise/phone/" + enterpriseId;
        this.$put(modifyTelUrl, {
          mobile: this.ruleForm.phoneNumber,
          captcha: this.ruleForm.graphCode,
          smsCode: this.ruleForm.messageCode.toString(),
          enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            swal("提示", "修改成功", "success");
            this.safeSettingInfo();
            this.isSelectedModifyTel = false;
            this.whether = false;
            this.safeSetting = "安全设置>";
            this.$refs['ruleForm'].resetFields();
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });

      },
      //确认修改密码
      confirmModifyPwd() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let modifyPwdUrl = "/api/enterprise/password/" + enterpriseId;
        this.$put(modifyPwdUrl, {
          originalPassword: this.$md5(this.resetPwdForm.oldPwd),
          newPassword: this.$md5(this.resetPwdForm.newPwd),
          enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            swal("提示", "修改成功", "success");
            this.safeSettingInfo();
            this.$refs['resetPwdForm'].resetFields();//对整个表单进行重置
            this.isSelectedModifyPwd = false;
            this.whether = false;
            this.safeSetting = "安全设置>";
            //暂时没跳转登录页
            // this.$router.push({ path: '/'})
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //确认修改绑定邮箱
      confirmBindEmail() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let modifyEmailUrl = "/api/enterprise/email/" + enterpriseId;
        this.$put(modifyEmailUrl, {
          email: this.emailForm.email,
          // enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            this.safeSettingInfo();
            this.$refs['emailForm'].resetFields();
            swal("提示", "修改成功", "success");
            this.isSelectedModifyEmail = false;
            this.whether = false;
            this.safeSetting = "安全设置>";

          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
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
      getMessageCode() {
        if (Verify.validateIsNull(this.ruleForm.graphCode) &&
          (Verify.validateIsNull(this.ruleForm.phoneNumber))){
          getMessageCode(this, this.ruleForm.graphCode, this.ruleForm.phoneNumber).then(res => {
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
        }else{
          this.$message.error('请检查输入的手机号码和图形验证码是否合法');
        }
      },
      //倒计时
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
  @import "../../styles/personal/personal-center.scss";

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

  .left_title {
    color: #666666;
    font-size: 14px;
  }

  .modify_btn {
    width: 120px;
    background-color: #33B2E8;
    color: #FFFFFF;
    font-size: 17px;
  }

  .modifyClass {
    display: none;
  }

  .unbind {
    color: #009BDD;
    font-size: 14px;
  }

  .bind_email_div {
    height: 563px;
    margin-top: 10px;
  }

  /*修改邮箱提示语*/
  .verify_hint {
    font-size: 12px;
    color: #666666;
    text-align: left;
  }

  /*星标的样式*/
  .verify_star {
    font-size: 12px;
    color: #009BDD;
  }

  .confirm_btn {
    width: 306px;
    background-color: #33B2E8;
    color: #FFFFFF;
    font-size: 17px;
  }

  /*修改手机号的样式*/
  .login_btn {
    width: 306px;
    height: 43px;
    background-color: #33B2E8;
    text-align: center;
    /*padding-left: 22px;*/
    /*padding-right: 22px;*/
  }

  .img_code_height {
    height: 40px;
  }

  .refresh_img_code {
    font-size: 10px;
    line-height: 12px;
    color: red;
  }

  .input_width {
    width: 460px;
  }
  .pws_verify_width {
    width: 500px;
  }
  /*修改密码的样式*/
  .width360 {
    width: 360px;
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
    margin-right: 44%;
    margin-top: -22.7%;
  }
  .code_specification{
    font-size: 12px;
    color: #33B2E8;
    cursor: pointer;
  }
  .el-input__inner {
    width: 305px;
  }
  .modify{
    display: block;
  }
</style>
