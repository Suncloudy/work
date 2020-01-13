<template>
  <div>
    <!--<p class="text_align_left">当前绑定手机号：<span v-model="telNumber">{{telNumber}}</span></p>-->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
             class="input_width">
      <!--//input-width="305px"-->
      <el-form-item label="已绑定手机号" prop="phoneNumber" label-width="100px" class="width360">
        <div class="text_align_left" v-model="telNumber">
          <span>{{telNumber}}</span>
        </div>
      </el-form-item>
      <el-form-item label="新手机号" prop="phoneNumber" label-width="100px">
        <el-input type="tel" v-model="ruleForm.phoneNumber" autocomplete="off"
                  placeholder=" 请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="图形验证码" prop="graphCode" label-width="100px">
        <el-row :gutter="10">
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
        <el-button class="login_btn" type="primary" @click="sureModifyNewTel()">确定</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import VerifyUtils from '../../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {getImgCode, getMessageCode} from '../../../utils/publicMethods'
  export default {
    name: "ModifyBindTel",
    data() {
      return {
        telNumber: '',
        btnTitle:'获取验证码',
        disabled:false,
        svg: '',
        showImgCode: '',
        isShow: false,
        ruleForm: {
          phoneNumber: '',
          graphCode: '',
          messageCode: '',
        },
        rules: {
          phoneNumber: [
            {validator: VerifyUtils.telephoneVerify, trigger: 'blur'}
          ],
          //图形码
          graphCode: [
            {validator: VerifyUtils.graphCodeVerify, trigger: 'blur'},
            { max:4, message: '长度4个字符', trigger: 'blur' }
          ],
          //短信验证码
          messageCode: [
            {type: 'number', validator: VerifyUtils.messageCodeVerify, trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      if (VerifyUtils.validateIsNull(localStorage.getItem("phoneNumber"))) {
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
      },
      refreshImgCode() {
        this.getImgCode();
      },
      getMessageCode() {
        if (VerifyUtils.validateIsNull(this.ruleForm.graphCode) &&
          VerifyUtils.validateIsNull(this.telNumber)){
          getMessageCode(this,this.ruleForm.graphCode, this.telNumber).then(res => {
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
        }else {
          swal("提示","请检查您输入的手机号和图形验证码是否合法", "error");
        }
      },
      //确认修改手机号
      sureModifyNewTel() {
        let userId = localStorage.getItem("userId");
        let modifyTelUrl = "/api/personal/" + userId + '/phoneReplacement';
        this.$put(modifyTelUrl, {
          mobile: this.ruleForm.phoneNumber,
          captcha: this.ruleForm.graphCode,
          // verifyCode: this.ruleForm.messageCode.toString(),
          smsCode: this.ruleForm.messageCode.toString(),
          // userId:userId,
        }).then(res => {
          if (JSON.stringify(res.data.code) == 200) {
            swal("提示", "修改成功", "success");
            localStorage.removeItem("phoneNumber");
            localStorage.setItem("phoneNumber", this.ruleForm.phoneNumber);
            // this.$router.go(0)
          } else {
            swal("提示", res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
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
    }
  }
</script>

<style>
  @import "../../../styles/personal/personal-center.scss";

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
</style>
