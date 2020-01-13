<template>
  <div>
    <div class="bg_color_gray">
      <el-row :gutter="20" style="margin-left: 0px;margin-right: 0px">
        <el-col :span="15" class="white_bg_color">
          <el-row :gutter="10" class="text_align_left">
            <el-col :span="5" class="user_img">
              <img src="../../assets/personal/touxiang_bg@2x.png" height="90" width="90"/>
            </el-col>
            <el-col :span="19">
              <p class="personal_info">您好，{{userName}}</p>
              <p class="personal_info">这是您加入爱惠康第<span class="day_font">{{joinDay}}</span>天</p>
              <p class="personal_info">您当前可享受<span class="day_font">{{discount}}</span>折优惠</p>
              <p class="change_personal_info"></p>
              <el-row class="text_align_left">
                <el-col :span="12">
                  <p class="margin_top0_bottom0"><span class="invite_number">{{inviteNumber}}</span><span
                    class="ren">人</span>
                  </p>
                  <span class="personal_info">已邀请</span>
                </el-col>
                <el-col :span="12">
                  <p class="margin_top0_bottom0"><span class="invite_number">{{surplusInviteNumber}}</span><span
                    class="ren">人</span></p>
                  <span class="personal_info">剩余可邀请</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="9" class="">
          <el-row class="">
            <el-col :span="24">
              <img src="../../assets/personal/wdjt_banner@2x.png" height="179" width="" @click="givenMedical()"/>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="margin_top15 margin_bottom15">
        <div class="coupon_div">
          <el-row :gutter="50" style="margin-left: 0px;margin-right: 0px">
            <el-col :span="6" v-for="(o, index) in items" :key="index" :class="{'marginTop10':index>3}">
              <div>
                <el-row :gutter="10" class="text_align_left family_member">
                  <div>
                    <el-col :span="10" class="user_img">
                      <img src="../../assets/personal/touxiang_bg@2x.png" height="45" width="45"/>
                    </el-col>
                    <el-col :span="14">
                      <p class="personal_info">{{o.phoneNumber}}</p>
                      <p class="change_personal_info" @click="givenFamily()"><u>赠送体检</u></p>
                    </el-col>
                  </div>
                </el-row>
              </div>
            </el-col>
            <!--<el-col :span="2">-->
            <!--&emsp;-->
            <!--</el-col>-->
          </el-row>
        </div>
      </div>
      <div>
        <!--赠送会员-->
        <el-dialog id="familyModal" ref="familyModal" :closeOnClickModal="false" title="赠送会员" :rules="rules" :visible.sync="dialogFormVisible">
          <el-form :model="familyRuleForm" style="text-align: right">
            <el-form-item label="注册手机号：" class="text_align_left">
              <span v-model="phoneNumber" autocomplete="off">{{phoneNumber}}</span>
            </el-form-item>
            <el-form-item label="图形验证码：" prop="graphCode">
              <el-row>
                <el-col :span="8">
                  <el-input style="" type="text" v-model="familyRuleForm.graphCode" autocomplete="off"
                            placeholder="请输入图形验证码"></el-input>
                </el-col>
                <el-col :span="4">
                  <!--<el-button class="img_code" @click="getImgCode()">获取图形码</el-button>-->
                  <div v-html="svg" v-show="!isShow" class="img_code_height">
                    {{svg}}
                  </div>
                </el-col>
                <el-col :span="4">
                  <span class="refresh_img_code" @click="refreshImgCode()">换一换</span>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="短信验证码：" prop="messageCode">
              <el-row>
                <el-col :span="8">
                  <el-input v-model="familyRuleForm.messageCode" placeholder="请输入短信验证码"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button @click="getMessageCode(familyRuleForm.graphCode)" :disabled=disabled>{{btnTitle}}</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="被赠送人：" :label-width="formLabelWidth">
              <el-row>
                <el-col :span="8">
                  <el-input v-model="familyRuleForm.givenPhoneNumber" autocomplete="off"
                            placeholder="请输入被赠送人手机号"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="对Ta说：" :label-width="formLabelWidth">
              <el-row>
                <el-col :span="14">
                  <el-input type="textarea" v-model="familyRuleForm.remark" autocomplete="off"
                            placeholder="愿你三冬暖，愿你春不寒"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="givenEvent()">确 定</el-button>
          </div>
        </el-dialog>
        <!--赠送体检-->
        <el-dialog title="赠送体检" :visible.sync="dialogTableVisible" center>
          <span class="text_align_left">请选择赠送的体检卡</span>

          <el-table
            ref="multipleTable"
            :data="medicalCardList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="ID"
              prop="cardId">
            </el-table-column>
            <el-table-column
              label="卡号"
              prop="cardNumber">
            </el-table-column>
            <el-table-column
              prop="packageName"
              label="体检套餐"
              width="120">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="额度"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="organizationName"
              label="所属机构"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="nextStepVerify()">下一步</el-button>
          </span>
        </el-dialog>
        <el-dialog id="givenCardModal" ref="givenCardModal" title="验证" :rules="rules" :visible.sync="cardDialogVisible">
          <el-form :model="givenCardForm" style="text-align: right">
            <el-form-item label="注册手机号：" class="text_align_left">
              <span v-model="phoneNumber" autocomplete="off">{{phoneNumber}}</span>
            </el-form-item>
            <el-form-item label="图形验证码：" prop="graphCode">
              <el-row>
                <el-col :span="8">
                  <el-input style="" type="text" v-model="givenCardForm.graphCode" autocomplete="off"
                            placeholder="请输入图形验证码"></el-input>
                </el-col>
                <el-col :span="4">
                  <!--<el-button class="img_code" @click="getImgCode()">获取图形码</el-button>-->
                  <div v-html="svg" v-show="!isShow" class="img_code_height">
                    {{svg}}
                  </div>
                </el-col>
                <el-col :span="4">
                  <span class="refresh_img_code" @click="refreshImgCode()">换一换</span>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="短信验证码：" prop="messageCode">
              <el-row>
                <el-col :span="8">
                  <el-input v-model="givenCardForm.messageCode" placeholder="请输入短信验证码"></el-input>
                </el-col>
                <el-col :span="4">
                      <el-button @click="getMessageCode(givenCardForm.graphCode)" :disabled=disabled>{{btnTitle}}</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cardDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="givenCards()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex';
  import VerifyUtils from '../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {getImgCode, getMessageCode} from '../../utils/publicMethods'

  export default {
    name: 'MyFamily',
    props: ['selectTitle'],
    data() {
      return {
        phoneNumber: '',
        btnTitle:'获取短信验证码',
        disabled:false,
        cardBtnTitle:'短信验证码',
        discount: "无打",//登录时返回的折扣
        userName: '',
        joinDay: 0,
        tel: '',
        activeIndex: '1',
        inviteNumber: 0,
        surplusInviteNumber: 0,
        accountBalance: 0.00,
        coupons: 0,
        dialogFormVisible: false,
        svg: '',
        showImgCode: '',
        isShow: true,
        familyRuleForm: {
          givenPhoneNumber: '',
          graphCode: '',
          messageCode: '',
          remark: '',
        },
        formLabelWidth: '97px',
        rules: {
          givenPhoneNumber: [
            {validator: VerifyUtils.phoneNumberVerify, trigger: 'blur'}
          ],
          //图形码
          graphCode: [
            {validator: VerifyUtils.graphCodeVerify, trigger: 'blur'}
          ],
          //短信验证码
          messageCode: [
            {type: 'number', validator: VerifyUtils.messageCodeVerify, trigger: 'blur'}
          ],
        },
        items: [],
        dialogTableVisible: false,//赠送体检弹框
        //体检卡列表
        medicalCardList: [],
        multipleSelection: [],
        givenCardForm: {
          graphCode: '',
          messageCode: '',
        },
        cardDialogVisible:false
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },

    created() {
      this.getImgCode();
      this.phoneNumber = localStorage.getItem("phoneNumber");
      // this.discount = localStorage.getItem("discount");
      this.getFamilyInfo();
      this.givenMedicalExaminationCard();
    },
    methods: {
      getFamilyInfo() {
        let userId = localStorage.getItem("userId");
        // let familyInfo = '/api/user/familyProfile/' + userId;
        let familyInfo = '/api/personal/' + userId + '/familyProfile';

        this.$get(familyInfo, {
          // userId: userId,
        }).then(res => {
          if (res.data.code === 200) {
            console.log("test" + JSON.stringify(res.data.data));
            var userBasic = res.data.data.userBasic;
            this.userName = userBasic.name;

            if (VerifyUtils.validateIsNull(userBasic.discount)) {
              this.discount = userBasic.discount.id;
            }
            debugger
            this.joinDay = VerifyUtils.convertDate(userBasic.createdAt);
            if (VerifyUtils.validateIsNull(this.joinDay)) {
              this.getTime();
            }
            if (VerifyUtils.validateIsNull(userBasic.phoneNumber)) {
              this.phoneNumber = userBasic.phoneNumber;
            }
            var inviteBasic = res.data.data.inviteBasic;
            this.inviteNumber = inviteBasic.inviteNumber;
            this.surplusInviteNumber = inviteBasic.inviteNumber;//剩余可邀请
            this.items = inviteBasic.items;
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      givenMedical() {
        this.dialogFormVisible = true;
      },
      // 立即赠送折扣(家人关爱计划)
      givenEvent() {
        let userId = localStorage.getItem("userId");
        let givenUrl = '/api/personal/' + userId + '/familyDiscount';
        // let givenUrl = '/api/user/family/discount/' + userId;
        this.$post(givenUrl, {
          mobile: this.phoneNumber,
          captcha: this.familyRuleForm.graphCode,
          smsCode: this.familyRuleForm.messageCode,
          discountId: this.discount,
          invitePhone: this.familyRuleForm.givenPhoneNumber,
          say: this.familyRuleForm.remark
        }).then(res => {
          if (res.data.code === 200) {
            debugger
            this.dialogFormVisible = false;
            this.getFamilyInfo();
          } else {
            alert(res.data.msg)
          }
          // this.dialogFormVisible = false;
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //赠送体检给家人
      givenFamily() {
        //获取可赠送的卡片
        this.givenMedicalExaminationCard();
        this.dialogTableVisible = true;
      },
      //获取可赠送体检卡列表
      givenMedicalExaminationCard(){
        this.givenCardForm.messageCode = '';
        this.givenCardForm.graphCode = '';
        let userId = localStorage.getItem("userId");
        let givenUrl = '/api/personal/' + userId + '/0' + '/phyCards';
        this.$get(givenUrl, {}).then(res => {
          if (res.data.code === 200) {
            this.medicalCardList = res.data.data.items;
          } else {
            alert(res.data.msg)
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //选择体检卡后，下一步
      nextStepVerify(){
        if (VerifyUtils.validateIsNull(this.multipleSelection) &&this.multipleSelection.length != 0 ) {
          this.cardDialogVisible = true;
        }else{
          this.$message({
            message: '请先选择要赠送的体检卡',
            type: 'warning'
          });
        }

      },
      //确定赠送
      givenCards() {
        let userId = localStorage.getItem("userId");
        var itemArr = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          let obj = this.multipleSelection[i].cardId;
          itemArr.push(obj);
        }
        let givenUrl = '/api/personal/' + userId  + '/familyPhyCard';
        this.$put(givenUrl, {
          mobile:this.phoneNumber,
          cardIds:itemArr,
          captcha:this.givenCardForm.graphCode,
          smsCode:this.givenCardForm.messageCode
          // verifyCode:this.givenCardForm.messageCode
        }).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '赠送成功',
              type: 'success'
            });
          } else {
            alert(res.data.msg)
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getImgCode() {
        getImgCode(this).then(res => {
          if (res.status === 200) {
            this.svg = res.data;
            this.isShow = false;
          } else {
            this.$message.error(res.statusText);
          }
        });
      },
      refreshImgCode() {
        this.getImgCode();
      },
      getMessageCode(graphCode) {
        // this.codeCountDown();
        if (VerifyUtils.validateIsNull(graphCode) &&
          (VerifyUtils.validateIsNull(this.phoneNumber))) {
          getMessageCode(this, graphCode, this.phoneNumber).then(res => {
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
          this.$message({
            showClose: true,
            message: '请先输入图形验证码',
            type: 'error'
          });
        }
      },
      codeCountDown() {
        // this.dialogFormVisible = true;
        //倒计时
        let time = 60;
        let timer = setInterval(() => {
          if(time === 0) {
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      getTime () {
        if (this.joinDay === '') {
          this.open();
          return;
        }
        this.dateDiff(this.joinDay);
      },
      dateDiff(sDate1) {
        var date2 = new Date();
        var date1 = new Date(Date.parse(sDate1.replace(/-/g,   "/")));
        var iDays = parseInt(Math.abs(date2.getTime()- date1.getTime()) /1000/60/60/24);
        this.joinDay = iDays;
      },
    }
  }
</script>

<style>
  @import "../../styles/personal/personal-center.scss";

  .margin_left0 {
    margin-left: 0px;
  }

  /*个人信息*/
  .text_align_left {
    text-align: left;
  }

  .user_img {
    text-align: center;
    margin-top: 20px;
  }

  .personal_info {
    color: #404040;
    font-size: 14px;
  }

  .change_tel {
    color: #33B2E8;
    font-size: 14px;
  }

  .change_personal_info {
    /*float: right;*/
    color: #33B2E8;
    font-size: 14px;
  }

  /*邀请数字*/
  .invite_number {
    color: #33B2E8;
    font-size: 30px;
  }

  .ren {
    font-size: 14px;
    color: #666666;
  }

  .family_member {
    border: 1px solid #CCCCCC;
    margin-top: 15px;
  }

  .marginTop10 {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .coupon_div {
    height: auto;
    background-color: white;
  }

  .day_font {
    color: #DF2321;
    font-size: 14px;

  }

  .img_code_height {
    height: 40px;
  }

  .refresh_img_code {
    font-size: 10px;
    line-height: 12px;
    color: red;
  }

  .img_code_height {
    height: 40px;
  }
</style>



