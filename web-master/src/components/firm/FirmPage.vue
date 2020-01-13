<template>
  <div>
    <!--<el-header class="header_bg">-->
    <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--<el-breadcrumb-item :to="{ path: '/' }">企业主页</el-breadcrumb-item>-->
    <!--&lt;!&ndash;<el-breadcrumb-item>{{selectTitle[1]}}</el-breadcrumb-item>&ndash;&gt;-->
    <!--</el-breadcrumb>-->
    <!--</el-header>-->
    <el-row>
      <el-col :span="17">
        <div class="firm_info_bg">
          <div class="firm_info">
            <p class="firm_name">欢迎您，{{firmName}}</p>
            <div class="firm_detail">
              <el-row>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="12">
                      <p class="people_font"><span class="number_people">{{numberPeople}}</span>人</p>
                      <p class="people_font">下次体检</p>
                    </el-col>
                    <el-col :span="12">
                      <p class="people_font"><span class="number_people">{{playMoney}}</span>计划金</p>
                      <p class="setting_font" @click="settingPlan()">设置</p>
                    </el-col>
                  </el-row>
                </el-col>

                <el-col :span="8" class="left_box">
                  <p class="balance_font">¥{{balance}}</p>
                  <el-row>
                    <el-col :span="16">
                      <img class="balance_img" src="../../assets/firm/zhanghuyue_icon@2x.png" height="28" width="28"/>
                      <span class="account_balance">账户余额</span>
                    </el-col>
                    <el-col :span="8">
                      <p class="top_up">充值</p>
                    </el-col>
                  </el-row>
                </el-col>

                <el-col :span="8" class="left_box">
                  <p class="invoice_font">¥{{invoice}}</p>
                  <el-row>
                    <el-col :span="16">
                      <img class="balance_img" src="../../assets/firm/fapiao_icon_green@2x.png" height="28" width="28"/>
                      <span class="invoice">可开具发票</span>
                    </el-col>
                    <el-col :span="8">
                      <p class="request_invoice">索要发票</p>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div>
          <el-row class="margin_top50">
            <el-col :span="6">
              <router-link to="/FirmMember" class="decoration_none">
                <img src="../../assets/firm/tjcy_icon_icon@2x.png" height="86" width="86"/>
                <p class="event_font">添加成员</p>
              </router-link>

            </el-col>
            <el-col :span="6">
              <router-link to="/FirmData" class="decoration_none">
                <img src="../../assets/firm/qygl_icon@2x.png" height="86" width="86"/>
                <p class="event_font">企业管理</p>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/MedicalPlan" class="decoration_none">
                <img src="../../assets/firm/tjjh_icon@2x.png" height="86" width="86"/>
                <p class="event_font">体检计划</p>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/InvoiceManagement" class="decoration_none">
                <img src="../../assets/firm/fapiao_icon@2x.png" height="86" width="86"/>
                <p class="event_font">开具发票</p>
              </router-link>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="1" class="space_div">
      </el-col>
      <el-col :span="6">
        <el-row class="white_bg_color height102">
          <el-col :span="14">
            <img class="balance_img" src="../../assets/firm/tz_qy_icon@2x.png" height="22" width="22"/>
            <span class="new_notice">一个新通知</span>
          </el-col>
          <el-col :span="10">
            <span class="look_notice">查看通知</span>
          </el-col>
        </el-row>
        <div class="white_bg_color margin_top15">
          <p class="composition_title">成员</p>
          <el-row>
            <el-col :span="12">
              <span class="composition_list">员工</span>
            </el-col>
            <el-col :span="12" class="text_align_left">
              <span class="look_notice">{{staffNumber}}个</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="composition_list">部门</span>
            </el-col>
            <el-col :span="12" class="text_align_left">
              <span class="look_notice">{{departNumber}}个</span>
            </el-col>
          </el-row>
        </div>
        <div class="white_bg_color margin_top15">
          <p class="composition_title">体检计划</p>
          <el-row>
            <el-col :span="12">
              <span class="composition_list">体检计划</span>
            </el-col>
            <el-col :span="12" class="text_align_left">
              <p class="look_notice" v-for="s in cycleArr">{{s}}</p>
              <!--<P class="look_notice">10月/年</P>-->
            </el-col>
          </el-row>
          <!--<el-row>-->
          <!--<el-col :span="12">-->
          <!--<span class="composition_list">体检预算</span>-->
          <!--</el-col>-->
          <!--<el-col :span="12" class="text_align_left">-->
          <!--<span class="look_notice">300/人</span>-->
          <!--</el-col>-->
          <!--</el-row>-->
        </div>
      </el-col>
    </el-row>
    <div>

      <!--<table></table>-->
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import VerifyUtils from '../../utils/utils';

  export default {
    name: "FirmPage",
    props: ['selectTitle'],
    data() {
      return {
        firmName: 'XXX科技有限公司',
        numberPeople: 0,
        playMoney: 0.00,
        balance: '0.00',
        invoice: '0.00',
        staffNumber: '0',
        departNumber: '0',
        cycleArr:[],
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      this.getFirmInfo();
      if (this.$route.query.orderFlag === 'firmOrder') {
        this.$router.push({ path: '/FirmOrderManage'});
      }
    },
    methods: {
      getFirmInfo() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        var firmInfo = '/api/enterprise/profile/' + enterpriseId;
        this.$get(firmInfo, {
          enterpriseId: enterpriseId,
        }).then(res => {
            if (res.data.code === 200) {
              this.firmName = res.data.data.enterpriseName;
              this.staffNumber = res.data.data.employee;
              this.departNumber = res.data.data.department;
              this.balance = VerifyUtils.toDecimal(res.data.data.balance);
              this.invoice = VerifyUtils.toDecimal(res.data.data.invoice);
              let phyExamiantionPlanRes = res.data.data.phyExamiantionPlanRes;
              let arr = [];
              for (let i = 0; i < phyExamiantionPlanRes.length; i++) {
                arr.push(phyExamiantionPlanRes[i].planDate);
              }
              var max = arr[0];

              for (var j = 1; j < arr.length; j++) {
                var cur = arr[j];
                cur > max ? max = cur : null
              }
              const index = phyExamiantionPlanRes.findIndex(val => val.planDate === max);
              this.numberPeople = phyExamiantionPlanRes[index].employeeNumber;
              if (VerifyUtils.validateIsNull(phyExamiantionPlanRes[index].payout)){
                this.playMoney = phyExamiantionPlanRes[index].payout;
              }else{
                this.playMoney = 0;
              }


              //  周期类型  cyclePeriod：0 天，10 周，20 月，30 年
              let cycleRemindRes = res.data.data.cycleRemindRes;
              this.cycleArr = [];
              for (let k = 0; k < cycleRemindRes.length; k++) {
                let period = '';
                if (cycleRemindRes[k].cyclePeriod === 0) {
                  period = cycleRemindRes[k].cycle + '天';
                } else if (cycleRemindRes[k].cyclePeriod === 10) {
                  period = cycleRemindRes[k].cycle + '周';
                } else if (cycleRemindRes[k].cyclePeriod === 20) {
                  period = cycleRemindRes[k].cycle + '月';
                } else if (cycleRemindRes[k].cyclePeriod === 30) {
                  period = cycleRemindRes[k].cycle + '年';
                }
                this.cycleArr.push(period);
              }
            }
            else {
              alert(JSON.stringify(res.data.msg));
            }
          }
        ).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      settingPlan() {
        this.$router.push({path: '/MedicalPlan'});
      }
    }
  }
</script>

<style>
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

  .firm_name {
    font-size: 16px;
    color: #FFFFFF;
    padding-left: 1%;
    text-align: left;
  }

  .firm_info {
    padding: 5% 9px 5% 9px;
  }

  .firm_info_bg {
    background: url('../../assets/firm/qiye_shouye_bg.png');
    background-size: auto 100%;
    /*backgroundRepeat: "no-repeat";*/
    /*width: auto;*/
    /*height: 228px;*/
  }

  .firm_detail {
    background-color: #FFFFFF;
    height: 124px;
  }

  /*分割线*/
  .left_box {
    margin-top: 5px;
    border-left: 1px solid #666666;
  }

  /*人数的数字样式*/
  .number_people {
    color: #009BDD;
    font-size: 30px;
  }

  /*人数的'人'字样式*/
  .people_font {
    color: #666666;
    font-size: 14px;
  }

  /*'设置'的字体样式*/
  .setting_font {
    color: #009BDD;
    font-size: 14px;
  }

  /* 账户余额的字体*/
  .balance_font {
    color: #FA6A5A;
    font-size: 30px;
    margin-top: 14px;
    margin-bottom: 14px;
  }

  .balance_img {
    vertical-align: middle;
  }

  /*'充值'的字体样式*/
  .top_up {
    color: #FA6A5A;
    font-size: 14px;
    margin-top: 2px;
  }

  .account_balance {
    color: #404040;
    font-size: 14px;
  }

  /*发票相关样式*/
  .invoice_font {
    color: #5BC146;
    font-size: 30px;
    margin-top: 14px;
    margin-bottom: 14px;
  }

  .request_invoice {
    color: #5BC146;
    font-size: 14px;
    margin-top: 2px;
  }

  .margin_top50 {
    margin-top: 50px;
  }

  .event_font {
    font-size: 18px;
    color: #333333;
    margin-top: 5px;
  }

  /*通知div的样式*/
  .new_notice {
    color: #404040;
    font-size: 14px;
  }

  .look_notice {
    color: #33B2E8;
    font-size: 14px;
    margin-top: 2px;
  }

  .height102 {
    line-height: 102px;
    text-align: center;
  }

  /*组成div*/
  .composition_title {
    font-size: 18px;
    color: #333333;
    text-align: left;
    padding-top: 10px;
    margin-left: 20px;
  }

  .composition_list {
    font-size: 16px;
    color: #666666;
  }
  .space_div{
    background-color: #f6f6f6;
    width: 20px;
    height: 80px;
  }
  .decoration_none {
    text-decoration: none;
  }
  .el-breadcrumb__inner {
    color: #333333;
  }
</style>
