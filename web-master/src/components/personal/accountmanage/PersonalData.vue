<template>
  <div class="bg_color_gray">
    <el-row :gutter="30" class="margin_left0 white_bg_color" style="margin-left: 0px;margin-right: 0px">
      <el-col :span="5" class="user_img">
        <img src="../../../assets/personal/touxiang_bg@2x.png" height="90" width="90"/>
      </el-col>
      <el-col :span="19" class="text_align_left">
        <p class="personal_info">ID:{{userId}}</p>
        <p class="personal_info">微信：<span v-if="weChat.length !== 0">{{weChat}}</span><span v-else-if="weChat.length === 0"><span>未绑定</span>&emsp;<span class="edit_info cursor_pointer">去绑定>></span></span></p>
        <p class="personal_info" v-model="tel">{{tel}}&emsp;&emsp;&emsp;<span class="edit_info cursor_pointer" @click="modifyTel()" >更换>></span></p>
      </el-col>
    </el-row>
    <div class="set_data white_bg_color">

      <el-form :model="userForm" label-width="80px" class="info_data_form" :rules="rules" ref="userForm">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" autocomplete="off" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <!--<el-radio-group  id="sexRadios" :options="sexOptions" name="sexRadio">-->
          <!--</el-radio-group>-->
          <!--0男 1女 默认是男-->
          <el-radio-group v-model="userForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
            <!--<el-radio :label="0">通用</el-radio>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="真实姓名" prop="userName">
            <el-input v-model="userForm.userName" autocomplete="off" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
            <el-form-item>
              <!--<el-input v-if="userForm.birth.length!==0" v-model="userForm.birth" autocomplete="off"></el-input>-->
              <el-date-picker  type="date" placeholder="请选择出生日期" v-model="userForm.birth" class="width280"></el-date-picker>
            </el-form-item>
        </el-form-item>
        <el-form-item label="邮箱" prop="">
          <el-input v-model="userForm.email" autocomplete="off" placeholder="请输入邮箱" type="email"></el-input>
          <span class="hint_email">*可用于找回密码</span>
        </el-form-item>
        <el-button class="save_btn" @click="saveUserInfo()">保存</el-button>
      </el-form>

    </div>
  </div>
</template>

<script>
  import Verify from "../../../utils/utils";
  import swal from 'sweetalert2'; //alert框
  import {mapGetters} from 'vuex';

  export default {
    name: "PersonalData",
    props: ['selectTitle'],
    data() {
      return {
        userId:'',
        tel:'',
        weChat:'',
        userForm: {
          nickname: '',
          userName: '',
          sex: 0,
          birth: '',
          email: '',
        },
        sexSelected: '1',
        // sexOptions: [{text: '男', value: '1'}, {text: '女', value: '2'}],
        rules:
          {
            nickname: [
              {required: true, message: '请输入真实姓名', trigger: 'blur'},
              {min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur'}
            ],
            userName: [
              {required: true, message: '请输入真实姓名', trigger: 'blur'},
              {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
            ],
            email:[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
            ]
            // birth: [
            //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            // ],
          }
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },

    created(){
      this.getPersonInfo();
      this.userId = localStorage.getItem("userId");
    },
    methods:{
      getPersonInfo(){
        let userId = localStorage.getItem("userId");
        let userInfo = '/api/personal/'+ userId;
        this.$get(userInfo, {
          // userId: userId,
        }).then(res => {
          if (res.data.code === 200) {
            console.log("test" + JSON.stringify(res.data.data));
            var info = res.data.data;
            if (Verify.validateIsNull(info.wechat)) {
              this.weChat = info.wechat;
            }
            if (Verify.validateIsNull(info.birthday)){
              this.userForm.birth = info.birthday;
            }
            if (Verify.validateIsNull(info.nickname)){
              this.userForm.nickname = info.nickname;
            }
            if (Verify.validateIsNull(info.name)){
              this.userForm.userName = info.name;
            }
            if (Verify.validateIsNull(info.Account.email)){
              this.userForm.email = info.Account.email;
            }
            if (Verify.validateIsNull(info.gender)){
              this.userForm.sex = info.gender;
              // console.log(this.userForm.sex )
            }
            if (Verify.validateIsNull(res.data.data.Account.phoneNumber)){
              this.tel = res.data.data.Account.phoneNumber;
            }
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //修改手机号
      modifyTel(){
        this.$router.push({ path: '/SafeSetting'})
      },
      saveUserInfo(){
        if (Verify.validateIsNull(this.userForm.nickname) &&
          Verify.validateIsNull(this.userForm.userName)) {
          var data={
            nickname: this.userForm.nickname,
            name: this.userForm.userName,
          };
          if (Verify.validateIsNull(this.userForm.birth)){
            data['birthday'] = this.userForm.birth;
          }
          if (Verify.validateIsNull(this.userForm.sex)){
            data['gender'] = this.userForm.sex;
          }
          if (Verify.validateIsNull(this.userForm.email)){
            if (Verify.emailVerify(this.userForm.email)) {
              data['email'] = this.userForm.email;
            }else{
              this.$message({
                message: '邮箱格式不正确',
                type: 'warning'
              });
            }

          }
          swal({
            title: "是否保存?",
            text: "",
            type: "question",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }).then((result) => {
            if (result.value) {
              let editUserInfo = "/api/personal/" + this.userId;
              this.$put(editUserInfo, data).then(res => {
                if (res.data.code === 200) {
                  swal("提示", "已保存成功", "success");
                }else {
                  swal("提示", res.data.msg, "error");
                }
                // this.getPersonBalance();
                // console.log("res=="+JSON.stringify(res))
              }).catch(function (reason) {
                console.log(JSON.stringify(reason));
              });
            } else {
              swal("Cancelled", "", "");
            }
          });}

      },
      getPersonBalance(){
        let userId = localStorage.getItem("userId");
        let userInfo = '/api/user/account/'+ userId;
        this.$get(userInfo, {
          // userId: userId,
        }).then(res => {
          if (res.data.code === 200) {

            console.log("test" + JSON.stringify(res.data.data));

          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
    }
  }
</script>

<style scoped>
  @import "../../../styles/personal/personal-center.scss";

  .set_data {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .user_img {
    text-align: center;
    margin-top: 20px;
  }

  .personal_info {
    font-size: 14px;
    color: #404040;
  }

  .edit_info {
    color: #33B2E8;
  }

  .info_data_form {
    width: 360px;
    padding-top: 20px;
    padding-left: 20px;
    padding-bottom: 20px;
  }
  .hint_email{
    color:#666666;
    font-size: 12px;
    /*text-align: left;*/
    float: left;
  }
  .save_btn{
    width:300px;
    color: white;
    background-color: #33B2E8;
    font-size: 17px;
  }
  .width280{
    width: 280px;
  }

</style>
