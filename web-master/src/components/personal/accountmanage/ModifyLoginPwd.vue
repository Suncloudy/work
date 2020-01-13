<template>
  <div>
    <div>
      <el-form :model="resetPwdForm" status-icon :rules="resetPwdRules" ref="resetPwdForm" label-width="80px">
        <el-form-item
          prop="oldPwd"
          label="原密码" class="width360">
          <el-input v-model="resetPwdForm.oldPwd" placeholder="请输入原密码" autocomplete="off" type="password"></el-input>

          <!--<el-row>-->
          <!--<el-col :span="18">-->
          <!--<el-input v-model="resetPwdForm.oldPwd" placeholder="请输入原密码" autocomplete="off" type="password"></el-input>-->

          <!--</el-col>-->
          <!--<el-col :span="6">-->
          <!--<div class="pwd_safe_prompt">-->
          <!--短信验证码验证-->
          <!--</div>-->
          <!--</el-col>-->
          <!--</el-row>-->

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
          <el-input v-model="resetPwdForm.confirmPwd" placeholder="请再次输入新密码" autocomplete="off" type="password"></el-input>

        </el-form-item>
        <!--<el-form-item>-->
        <el-form-item
          prop=""
          label="" class="width360">
          <el-button type="text" class="nextStep btn_color" @click="confirmPwdForm('resetPwdForm')">确定</el-button>
          <!--<el-button @click="resetForm('numberValidateForm')">重置</el-button>-->
        </el-form-item>

      </el-form>
      <div class="pwd_specification">密码由字母、数字、
        标点两种以上组成
      </div>
      <div class="code_specification" @click="messageCodeEvent()">
        短信验证码验证
      </div>
    </div>

  </div>
</template>

<script>
  import Verify from '../../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {getImgCode, getMessageCode} from '../../../utils/publicMethods'
  // import ModifyPwdByCode from '../components/personal/accountmanage/ModifyPwdByCode'
  export default {
    name: "ModifyLoginPwd",
    // components:{
    //   ModifyPwdByCode,
    // },
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
        },
      }
    },
    created(){

    },
    methods: {
      //确认事件
      confirmPwdForm() {
        let userId = localStorage.getItem("userId");
        // let modifyPwdUrl = "/api/user/password/" + userId;
        let modifyPwdUrl = '/api/personal/'+ userId + '/passwordReplacement';
        if (Verify.validateIsNull(this.resetPwdForm.oldPwd) &&
          Verify.validateIsNull(this.resetPwdForm.newPwd)){
          this.$put(modifyPwdUrl, {
            originalPassword: this.$md5(this.resetPwdForm.oldPwd),
            newPassword: this.$md5(this.resetPwdForm.newPwd),
          }).then(res => {
            if (res.data.code === 200) {
              swal("提示", "修改成功", "success");
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
          swal("提示", "请输入要更改的密码", "error");
        }
      },
      getImgCode() {
        getImgCode(this).then(res => {
          if (res.status === 200) {
            this.svg = res.data;
            // this.isShow = false;
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
          (Verify.validateIsNull(this.ruleForm.phoneNumber))) {
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
        } else {
          this.$message.error('请检查输入的手机号码和图形验证码是否合法');
        }
      },
      messageCodeEvent(){
        // this.$router.push({path:'/ModifyPwdByCode'});
        this.$router.push({path:'/ModifyPwdByCode',query:{'modifyPwdFlag':'person'}});
      }
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
  .code_specification {
    white-space: normal; /*文字换行*/
    font-size: 12px;
    color: #33B2E8;
    width: 115px;
    height: 38px;
    float: right;
    margin-right: 40%;
    margin-top: -31.0%;
    cursor: pointer;
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
    margin-top: -24.7%;
  }

  .el-input__inner {
    width: 305px;
  }
</style>
