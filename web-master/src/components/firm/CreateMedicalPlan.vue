<template>
  <div class="margin_top15 white_bg_color padding_top10">
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
            <router-link to="/MedicalPlan" class="link_font">返回修改</router-link>
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
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "CreateMedicalPlan",
    data() {
      return {
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
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created(){
      // console.log("123==="+this.stuffList);
    },
    methods: {
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
            swal("提示", res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      handleSelectionChange(val) {
      },
      // 修改table header的背景色
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #F6F6F6;color: #404040;font-weight: 500;'
        }
      }
    }

  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";

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
