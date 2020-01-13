<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{(asideNavTitle[0] === '' || asideNavTitle[0] === undefined )?
          '费用管理':asideNavTitle[0]}}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{(asideNavTitle[1] === '' || asideNavTitle[1] === undefined )?
          '交易记录':asideNavTitle[1]}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="white_bg_color margin_top15">
      <p class="p_title text_align_left padding_left10 padding_top10">交易记录</p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="交易类型">
          <el-select v-model="formInline.type" placeholder="所有类型">
            <el-option
              v-for="item in dealType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-col :span="11">
            <el-date-picker
              v-model="formInline.date1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <!--<el-date-picker type="datetime" placeholder="选择日期" v-model="formInline.date1"-->
                            <!--style="width: 100%;" default-time="12:00:00"></el-date-picker>-->
          </el-col>
          <el-col  :span="2">至</el-col>
          <el-col :span="11">
            <!--<el-date-picker type="datetime" placeholder="选择日期" v-model="formInline.date2"-->
                            <!--style="width: 100%;" default-time="12:00:00"></el-date-picker>-->
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
      <p class="export_font">导出</p>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%" :header-cell-style="tableHeaderColor" class="padding_left10">
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品">
        </el-table-column>
        <el-table-column
          prop="order"
          label="收入">
          <template slot-scope="scope">
            <span class="special_color">———</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payAmount"
          label="支出">
          <template slot-scope="scope">
          <span class="special_color">￥{{scope.row.payAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balance"
          label="余额">
          <template slot-scope="scope">
          <span class="special_color">￥{{scope.row.balance}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注">

        </el-table-column>
        <el-table-column
          prop="trancTime"
          label="交易时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detailInfo(scope.row)">详细</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="white_bg_color margin_top15" style="width: 100%">

      <div class="block" v-if="total>0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total=total>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Verify from '../../../utils/utils'
  export default {
    name: "TransactionRecords",
    data() {
      return {
        tableData: [],
        currentPage: 1,
        total: 0,
        formInline: {
          user: '',
          type: '',
          date1: '',
        },
        //交易的类型 'recharge', 'withdraw', 'consumption', 'refund', 'manager', 'other'
        dealType: [{
          value: 'recharge',
          label: '充值'
        }, {
          value: 'consumption',
          label: '消费'
        }, {
          value: 'withdraw',
          label: '提现'
        }, {
          value: 'refund',
          label: '退款'
        }, {
          //管理调整了金额
          value: 'manager',
          label: '管理员调整'
        }, {
          value: 'other',
          label: '其他'
        }],
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created(){
      this.getTransactionRecords();
    },
    methods: {
      getTransactionRecords(){
        let enterpriseId = localStorage.getItem("enterpriseId");
        let data = {
          enterpriseId: enterpriseId,
          page:this.currentPage,
          perPage:10,
        };
        if(Verify.validateIsNull(this.formInline.type)){
          data['type']= this.formInline.type;
        }
        if(Verify.validateIsNull(this.formInline.date1)){
          data['start']= Verify.dateFormat('yyyy-MM-dd hh:mm:ss',this.formInline.date1[0]);
          data['end']= Verify.dateFormat('yyyy-MM-dd hh:mm:ss', this.formInline.date1[1]);
        }

        this.$get('/api/enterprise/transactionHistory', data).then(res => {
          if (JSON.stringify(res.data.code) == 200) {
            this.total = res.data.data.total;
            this.currentPage = res.data.data.page;
            this.tableData = res.data.data.items;
            for (let i =0;i<res.data.data.items.length;i++){
              this.tableData[i].trancTime = Verify.convertDate(res.data.data.items[i].createdAt);
              this.tableData[i].payAmount = Verify.toDecimal(res.data.data.items[i].Order.paymentAmount);
              for (let j=0;j<res.data.data.items[i].Order.OrderItems.length;j++){
                this.tableData[i].productName = res.data.data.items[i].Order.OrderItems[j].name;
                this.tableData[i].balance = Verify.toDecimal(res.data.data.items[i].Order.Account.balance);
              }
            }
            console.log("this.tableData==" + JSON.stringify(this.tableData));
          } else {
            swal("提示", res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },

      //搜索事件
      onSubmit() {
        // console.log('submit!');
        this.getTransactionRecords();
      },
      detailInfo() {

      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getTransactionRecords();
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

  .p_title {
    font-size: 14px;
    color: #404040;
    /*padding-top: 20px;*/
  }

  .export_font {
    color: #009BDD;
    font-size: 14px;
    text-align: right;
    padding-right: 10px;
  }
</style>
