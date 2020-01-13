<template>
  <div>
    <el-row class="white_bg_color">
      <el-col :span="12">
        <el-header class="header_bg">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>{{(asideNavTitle[0] === '' || asideNavTitle[0] === undefined )?
              '体检管理':asideNavTitle[0]}}
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{(asideNavTitle[1] === '' || asideNavTitle[1] === undefined )?
              '体检计划':asideNavTitle[1]}}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
      </el-col>
      <el-col :span="12" class="margin_top15">
        <el-button class="add_medical_plan" :class="{displayClass:whether}" @click="addMedicalPlan()">添加体检计划</el-button>
      </el-col>
    </el-row>
    <div :class="{displayClass:whether}">
      <div class="margin_top15 white_bg_color">
        <el-row>
          <el-col :span="12">
            <p class="medical_title text_align_left padding_left10">体检计划</p>
            <p class="plan_name text_left">{{planName}}</p>
            <el-row>
              <el-col :span="12">
                <p class="plan_number_font margin_top0">{{medicalCount}}</p>
                <p class="medical_title margin_top0">体检人数</p>
              </el-col>
              <el-col :span="12">
                <p class="plan_number_font margin_top0">¥{{planMoney}}</p>
                <p class="medical_title margin_top0">计划金额</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <p class="add_new_medical_plan margin_top0" @click="addMedicalPlan()"><i
                  class="el-icon-circle-plus"></i>添加体检计划
                </p>
              </el-col>
              <el-col :span="12">
                <p class="state_title_font margin_top0">状态：<span class="state_font">{{active===1?'未生效':'已生效'}}</span>
                </p>
                <p class="state_title_font margin_top0">添加时间：{{addDate}}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12" class="left_box">
            <el-row>
              <el-col :span="12">
                <p class="medical_title text_align_left padding_left10">套餐配置</p>
              </el-col>
              <el-col :span="12">
                <p class="add_new_medical_plan" @click="configurationOperate()"><i class="el-icon-setting"></i>去设置</p>
              </el-col>
            </el-row>

            <p class="plan_name text_left">{{settingState}}</p>
            <p class="setting_hint text_left">配置套餐用于生成体检计划，不同部门可配置不同套餐</p>
            <hr class="hr_border">
            <el-row>
              <el-col :span="12">
                <p class="medical_title text_align_left padding_left10">体检周期</p>
              </el-col>
              <el-col :span="12">
                <p class="add_new_medical_plan" @click="configurationOperate()"><i class="el-icon-setting"></i>去设置</p>
              </el-col>
            </el-row>
            <p class="plan_name text_left">{{medicalCycle}}</p>
            <p class="setting_hint text_left">配置套餐用于生成体检计划，不同部门可配置不同套餐</p>
          </el-col>
        </el-row>
      </div>
      <div class="white_bg_color margin_top15">
        <el-row>
          <el-col :span="12">
            <p class="medical_title text_align_left padding_left10 padding_top10">体检历史</p>
          </el-col>
          <el-col :span="12">
            <p class="add_new_medical_plan text_align_right padding_right10 padding_top10"
               @click="moreMedicalHistory()">更多</p>
          </el-col>
        </el-row>
        <div class="padding_left10 padding_right10">
          <el-table
            :data="tableData"
            height="250"
            style="width: 100%" :header-cell-style="tableHeaderColor">
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="employeeNumber"
              label="体检人数">
            </el-table-column>
            <el-table-column
              prop="payout"
              label="体检支出">
              <template slot-scope="scope">
                {{scope.row.payout ===null?"———":scope.row.payout}}
              </template>
            </el-table-column>
            <el-table-column
              prop="averageLimit"
              label="人均额度">
            </el-table-column>
            <el-table-column
              prop="createDate"
              label="时间">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <div class="del_goods">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">查看详细</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>
    <!-- 体检历史-->
    <div :class="{displayClass:whetherHistory}">
      <medical-history></medical-history>
    </div>
    <!--创建体检计划的模态框-->
    <!--<div>-->
    <!--<el-dialog title="创建体检计划" :visible.sync="medicalPlanDialog" width="35%">-->
    <!--<el-form :model="createPlan">-->
    <!--<el-form-item label="创建时间" :label-width="formLabelWidth">-->
    <!--<el-input v-model="createPlan.date" autocomplete="off" placeholder="请输入创建时间"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="体检计划名称" :label-width="formLabelWidth">-->
    <!--<el-input v-model="createPlan.name" autocomplete="off" placeholder="请输入此次体检计划的名称"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button @click="medicalPlanDialog = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="confirmCreateMedicalPlan()">确 定</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
    <!--</div>-->
    <!--添加体检计划-->
    <div :class="{displayClass:whetherAddPlan}" class="white_bg_color">
      <add-medical-plan></add-medical-plan>
      <!--<div>-->
      <!--<p class="prompt_font">完成体检配置后，您可以<el-button class="create_medical_plan" @click="createMedicalPlan()">创建体检计划</el-button></p>-->
      <!--</div>-->
    </div>
    <!--创建体检计划-->
    <div :class="{displayClass:whetherCreatePlan}" v-if="createPlanFlag==true">
      <create-medical-plan></create-medical-plan>
    </div>
  </div>
</template>

<script>
  import MedicalHistory from '../../../src/components/firm/MedicalHistory'
  import AddMedicalPlan from '../../../src/components/firm/AddMedicalPlan'
  import CreateMedicalPlan from '../../../src/components/firm/CreateMedicalPlan'
  import {mapGetters} from 'vuex'
  import swal from 'sweetalert2'; //alert框
  import Verify from '../../utils/utils';

  export default {
    name: "MedicalPlan",
    components: {
      AddMedicalPlan,
      MedicalHistory,
      CreateMedicalPlan
    },
    data() {
      return {
        medicalPlan: '体检管理>体检计划',
        planName: '',
        medicalCount: 0,//体检计划人数
        planMoney: '0.00',//体检计划金额
        active: 1,//体检计划是否生效
        addDate: '未添加',//体检计划添加日期
        settingState: '未设置',//套餐设置状态
        medicalCycle: '未设置',
        whether: false,// 体检计划主页
        whetherHistory: true,//体检历史
        whetherAddPlan: true,//添加体检计划
        whetherCreatePlan: true,//创建体检计划
        tableData: [],
        formLabelWidth: '120px'
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle', 'createPlanFlag'])
    },
    created() {
      this.getStaffPlanList();
      console.log("createPlanFlag000==" + this.createPlanFlag);
      // if (this.createPlanFlag == false) {
      //   this.confirmCreateMedicalPlan();
      // }
    },
    methods: {
      //获取首页只返回最近创建的一个计划
      getStaffPlanList() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        // let getStaffUrl = '/api/enterprise/employees/' + enterpriseId + '/medicalExamiantionPlan';
        let getStaffUrl = '/api/enterprise/medicalExamiantionPlan/' + enterpriseId + '/home';
        this.$get(getStaffUrl, {
          // enterpriseId: enterpriseId,
        }).then(res => {
            if (res.data.code === 200) {
              // this.tableData = res.data.data;
              // console.log("staff==" + JSON.stringify(res.data.data))
              //体检计划相关
              var physicalExamiantionPlan = res.data.data.physicalExamiantionPlan;
              if (Verify.validateIsNull(physicalExamiantionPlan)) {
                //体检计划的名称
                if (Verify.validateIsNull(physicalExamiantionPlan.name)) {
                  this.planName = physicalExamiantionPlan.name;
                }
                //体检计划的人数
                if (Verify.validateIsNull(physicalExamiantionPlan.employeeNumber)) {
                  this.medicalCount = physicalExamiantionPlan.employeeNumber;
                }
                //体检计划金额
                if (Verify.validateIsNull(physicalExamiantionPlan.sumMoney)) {
                  this.planMoney = physicalExamiantionPlan.sumMoney;
                }
                //体检计划是否生效
                if (Verify.validateIsNull(physicalExamiantionPlan.status)) {
                  this.active = physicalExamiantionPlan.status;
                }

                //体检计划添加时间
                if (Verify.validateIsNull(physicalExamiantionPlan.createdA)) {
                  this.addDate = physicalExamiantionPlan.createdA;
                }
              }
              //套餐配置相关
              var setMeal = res.data.data.setMeal;
              if (Verify.validateIsNull(setMeal)) {
                if (Verify.validateIsNull(setMeal.settingStatus)) {
                  this.settingState = setMeal.settingStatus;
                }
              }
              //周期
              var cycleRemind = res.data.data.cycleRemind;
              if (Verify.validateIsNull(cycleRemind)) {
                this.medicalCycle = '';
                for (let i=0;i<cycleRemind.items.length;i++){
                  //defaultValue:20, comment:'周期类型：0.天 10.周 20.月 30.年' },
                  if (cycleRemind.items[i].cyclePeriod === 20){
                    this.medicalCycle += cycleRemind.items[i].cycle +'月' +' ';
                  }else if(cycleRemind.items[i].cyclePeriod === 10){
                    this.medicalCycle += cycleRemind.items[i].cycle +'周' +' ';
                  }else if(cycleRemind.items[i].cyclePeriod === 30){
                    this.medicalCycle += cycleRemind.items[i].cycle +'年' +' ';
                  }else if(cycleRemind.items[i].cyclePeriod === 0){
                    this.medicalCycle += cycleRemind.items[i].cycle +'天' +' ';
                  }
                }
              }
              var physicalPlanList = res.data.data.physicalExamiantionPlanList;
              if (Verify.validateIsNull(physicalPlanList)) {
                if (Verify.validateIsNull(physicalPlanList.items)) {
                  this.tableData = physicalPlanList.items;
                  for (const i in this.tableData) {
                    let createDate = Verify.convertDate(this.tableData[i].createdAt);
                    this.tableData[i]['createDate'] = createDate;
                  }
                }
              }
              // swal("提示", "保存成功", "success");
            }
            else {
              swal("提示", res.data.msg, "error");
            }
          }
        ).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //去设置套餐配置和体检周期
      configurationOperate() {
        this.$router.push('/MedicalConfiguration');
      }
      ,
      //添加体检计划
      addMedicalPlan() {
        this.whether = true;
        this.whetherHistory = true;
        this.whetherAddPlan = false;
        this.medicalPlan = '体检管理>体检计划>添加体检计划';
      }
      ,
      handleClick(row) {
        console.log(row);
      }
      ,
      //更多体检历史
      moreMedicalHistory() {
        this.whether = true;
        this.whetherAddPlan = true;
        this.whetherHistory = false;
        this.medicalPlan = '体检管理>体检计划>体检历史';
        // this.asideNavTitle[1] = "体检历史";
        console.log(this.asideNavTitle);
        this.asideNavTitle[1] = "体检历史";
      }
      ,
      //创建体检计划
      createMedicalPlan() {
        this.medicalPlanDialog = true;

      }
      ,
      //确认创建体检计划
      confirmCreateMedicalPlan() {
        // /api/enterprise/physicalExamiantionPlan/:enterpriseId
        this.whether = true;
        this.whetherAddPlan = true;
        this.whetherHistory = true;
        this.medicalPlanDialog = false;
        this.whetherCreatePlan = false;
        this.medicalPlan = '体检管理>体检计划';
        this.asideNavTitle[1] = "体检计划";
        // this.$store.dispatch('setStuffPlanInfo','1')
      }
      ,
      // 修改table header的背景色
      tableHeaderColor({row, column, rowIndex, columnIndex}) {
        if (rowIndex === 0) {
          return 'background-color: #F6F6F6;color: #404040;font-weight: 500;'
        }
      }
    }
  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";

  .dashed_hr {
    height: 5px;
    border: none;
    border-top: 3px dashed #6f7180;

  }

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

  .text_left {
    text-align: left;
    padding-left: 10px;
    margin-top: 0px;
    margin-bottom: 5px;
  }

  .left_box {
    margin-top: 5px;
    border-left: 1px dashed #F6F6F6;
  }

  .hr_border {
    margin-left: 10px;
    margin-right: 10px;
    border: 1px dashed #F6F6F6;
  }

  .medical_title {
    font-size: 14px;
    color: #404040;
  }

  .prompt_font {
    font-size: 14px;
    color: #666666;
  }

  .plan_name {
    font-size: 18px;
    color: #666666;
  }

  .plan_number_font {
    font-size: 30px;
    color: #009BDD;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .add_medical_plan {
    color: #FFFFFF;
    font-size: 17px;
    background-color: #33B2E8;
    width: 202px;
  }

  .add_new_medical_plan {
    color: #009BDD;
    font-size: 16px;
  }

  .state_title_font {
    font-size: 12px;
    color: #666666;
  }

  .state_font {
    font-size: 12px;
    color: green;
  }

  .setting_hint {
    color: #AAAAAA;
    font-size: 12px;
  }

  .displayClass {
    display: none;
  }

  .create_medical_plan {
    color: #FFFFFF;
    background-color: #33B2E8;
    width: 180px;
    font-size: 17px;
  }
</style>
