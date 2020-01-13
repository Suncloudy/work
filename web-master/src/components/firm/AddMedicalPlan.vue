<template>
  <div class="margin_top15 white_bg_color  padding_top10">
    <div v-if="createSuccessFlag==false">
      <div class="text_align_left padding_left10 prompt_border">
        <p class="prompt_font">当前体检套餐不能满足您的需要?
          <router-link to="/FirmStructure" class="link_font">配置体检套餐</router-link>
        </p>
        <p class="prompt_font">需要调整员工或部门信息？
          <router-link to="/FirmMember" class="link_font">员工管理</router-link>
          <router-link to="/FirmStructure" class="link_font">部门管理</router-link>
        </p>
      </div>
      <div>
        <el-row>
          <el-col :span="4" class="text_align_left">
            <p class="staff_number padding_left10">员工数<span class="link_font">{{staffAmount}}</span></p>
          </el-col>
          <el-col :span="8" class="text_align_left">
            <p class="staff_number">此次忽略<span class="link_font">20</span></p>
          </el-col>
          <el-col :span="12">
            <el-button class="not_medical">此次不体检</el-button>
          </el-col>
        </el-row>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange" :header-cell-style="tableHeaderColor">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="员工姓名"
            width="120" prop="employeeName">
            <!--<template slot-scope="scope">{{scope.row.date }}</template>-->
          </el-table-column>
          <el-table-column
            prop="phoneNumber"
            label="手机号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="部门"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="money"
            label="套餐"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select v-model="scope.row.money" placeholder="800元套餐" size="small">
                <el-option
                  v-for="item in combo"
                  :key="item.setMealId"
                  :label="item.money"
                  :value="item.setMealId">
                  <span style="float: left">{{ item.money }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <!--active-->
          <el-table-column
            label="本次不体检">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <p class="prompt_font">完成体检配置后，您可以
          <el-button class="not_medical" @click="createMedicalPlan()">创建体检计划</el-button>
        </p>
      </div>
    </div>

    <!--创建体检计划的模态框-->
    <div>
      <el-dialog title="创建体检计划" :visible.sync="medicalPlanDialog" width="35%">
        <el-form :model="createPlan">
          <el-form-item label="创建时间" :label-width="formLabelWidth">
            <!--<el-input v-model="createPlan.date" autocomplete="off" placeholder="请输入创建时间"></el-input>-->
            <el-date-picker
              v-model="createPlan.date"
              type="date"
              placeholder="选择日期" style="width: 96%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="体检计划名称" :label-width="formLabelWidth">
            <el-input v-model="createPlan.name" autocomplete="off" placeholder="请输入此次体检计划的名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="medicalPlanDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmCreateMedicalPlan()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--创建体检计划成功-->
    <div v-if="createSuccessFlag==true" class="white_bg_color">
      <div class="text_align_left padding_left10 prompt_border padding_top10">
        <el-row>
          <img src="../../assets/sccg_icon_login@2x.png" class="success_img" height="24" width="24"/>
          <span class="setting_success">体检计划创建成功！</span>
        </el-row>
        <p class="plan_name_font">{{planName}}
          <!--<router-link to="/FirmStructure" class="link_font">配置体检套餐</router-link>-->
        </p>
        <el-row>
          <el-col :span="10">
            <p class="plan_content">
              计划体检员工<span class="plan_number">{{staffNumber}}</span>人，体检金额<span class="plan_number">¥{{money}}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <el-button class="immediate_pay" @click="immediatePay()">立即支付</el-button>
          </el-col>
          <el-col :span="8">
            <p>
              <span class="link_font" @click="returnModify()">返回修改</span>
              <!--<router-link to="/MedicalPlan" class="link_font">返回修改</router-link>-->
              <!--<i class="el-icon-circle-plus"></i>-->
              <el-popover
                placement="top-start"
                title=""
                width="200"
                trigger="hover"
                content="完成支付后，此次体检计划额度将自动划拨至所对应员工的帐户下。">
                <span slot="reference"><i class="el-icon-circle-plus"></i></span>
                <!--<el-button slot="reference">hover 激活</el-button>-->
              </el-popover>
            </p>
          </el-col>
        </el-row>
      </div>
      <p class="plan_content text_align_left padding_left10">详细</p>
      <div class="padding_left10 padding_right10">
        <el-table
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange" :header-cell-style="tableHeaderColor">
          <el-table-column
            prop="name"
            label="员工姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="tel"
            label="手机号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="depart"
            label="部门"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="suit"
            label="套餐"
            show-overflow-tooltip>

          </el-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import swal from 'sweetalert2'; //alert框
  import VerifyUtils from '../../utils/utils';
  export default {
    name: "AddMedicalPlan",
    data() {
      return {
        checked: 'false',
        staffAmount: '',
        tableData: [],
        multipleSelection: [],
        combo: [],
        medicalPlanDialog: false,
        createPlan: {
          name: '',
          date: ''
        },
        formLabelWidth: '120px',
        createSuccessFlag:false,
        planName: '1月员工关爱体检',
        staffNumber: '10',
        money: '10000',
        tableData3: [{
          tel: '2016-05-03',
          name: '王小虎',
          depart: '策划部',
          suit: '800元'
        }]
      }
    },
    created() {
      this.getPlanStaff();
      this.physicalLimitInfo();
    },
    computed: {
      ...mapGetters(['asideNavTitle','createPlanFlag'])
    },
    methods: {
      //添加体检计划的员工列表
      getPlanStaff() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        // let getStaffUrl = '/api/enterprise/employees/' + enterpriseId + '/physicalExamiantionPlan';
        let url = '/api/enterprise/employees/' + enterpriseId + '/medicalExamiantionPlan';
        this.$get(url, {
        }).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.items;
            this.staffAmount = res.data.data.total;
            // console.log("plan staff=="+JSON.stringify(res.data.data.items))
            // swal("提示", "保存成功", "success");
          } else {
            swal("提示",res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //查看体检额度列表
      physicalLimitInfo() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let listUrl = "/api/enterprise/setMeals/" + enterpriseId;
        this.$get(listUrl, {
          // enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            this.combo = res.data.data.items;
            // console.log("体检额度列表=="+JSON.stringify(res.data));
          } else {
            swal("提示",res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //点击创建体检计划接口
      createMedicalPlan() {
        //显示体检计划的弹框
        this.medicalPlanDialog = true;
        // this.$refs['createPlan'].resetFields();// 重置表单
      },
      //创建体检计划弹框的确认按钮
      confirmCreateMedicalPlan() {
        // this.createSuccessFlag = true;
        //员工信息[{money:20,employeeId:1},{money:20,employeeId:2}]
        var selectInfo = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const obj = {
            money: this.multipleSelection[i].money,
            employeeId: this.multipleSelection[i].entEmployeeId
          }
          selectInfo.push(obj);
        }
        let enterpriseId = localStorage.getItem("enterpriseId");
        let createPlanUrl = "/api/enterprise/medicalExamiantionPlan/" + enterpriseId;
        if (VerifyUtils.validateIsNull(this.createPlan.name)&&
          VerifyUtils.validateIsNull(this.createPlan.date)){
          this.$post(createPlanUrl, {
            phyPlanName: this.createPlan.name,
            employees: JSON.stringify(selectInfo),
            planDate: this.createPlan.date,
          }).then(res => {
            if (res.data.code === 200) {
              this.medicalPlanDialog = false;
              swal("提示","创建成功","success");
              this.createSuccessFlag = true;//创建成功的标志
              this.$store.dispatch('setCreatePlanFlag',true);
              // console.log("createPlanFlag11111=="+this.createPlanFlag);
              // console.log("体检计划=="+JSON.stringify(res.data));
            } else {
              this.medicalPlanDialog = false;
              swal("提示",res.data.msg, "error");
            }
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });
        }else{
          this.$store.dispatch('setCreatePlanFlag',true);
          // console.log("createPlanFlag=="+this.createPlanFlag);
          this.medicalPlanDialog = false;
        }

      },
      //立即支付
      immediatePay() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let payUrl = "/api/enterprise/order/" + enterpriseId;
        this.$post(payUrl, {
          enterpriseId: enterpriseId,
          productId: '',
          productCategory: '',
        }).then(res => {
          if (res.data.code === 200) {
            console.log("立即支付创建订单=="+JSON.stringify(res.data));
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      returnModify(){
        this.createSuccessFlag = false;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
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

  .link_font {
    font-size: 12px;
    color: #33B2E8;
  }

  .prompt_border {
    background: rgba(246, 246, 246, 1);
    border: 1px solid rgba(189, 186, 187, 1);
    margin: 10px;
  }

  .prompt_font {
    font-size: 14px;
    color: #666666;
  }

  .staff_number {
    color: #404040;
    font-size: 14px;
  }

  .not_medical {
    color: #FFFFFF;
    background-color: #33B2E8;
    width: 180px;
    font-size: 17px;
  }

  /*创建成功页的样式*/
  .prompt_border {
    background: rgba(246, 246, 246, 1);
    border: 1px solid rgba(189, 186, 187, 1);
    margin: 10px;
  }

  .plan_name_font {
    font-size: 18px;
    color: #666666;
  }

  .success_img {
    vertical-align: bottom;
  }

  .setting_success {
    vertical-align: baseline;
    font-size: 18px;
    color: #404040;
  }

  .plan_content {
    font-size: 14px;
    color: #404040;
  }

  .plan_number {
    color: #009BDD;
    font-size: 14px;
  }

  .immediate_pay {
    color: #FFFFFF;
    font-size: 17px;
    background-color: #33B2E8;
    width: 202px;
  }

  .link_font {
    font-size: 12px;
    color: #33B2E8;
  }
</style>
