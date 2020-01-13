<template>
  <div>
    <el-header class="header_bg" style="height: 115px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{asideNavTitle.length!==0?asideNavTitle[0]:"我的钱包"}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{asideNavTitle.length!==0?asideNavTitle[1]:"金币"}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <p class="account_info">金币总数：<span class="account_balance">{{coin}}</span>&emsp;购物可抵现：<span class="account_balance">￥{{deduction}}</span></p>
      </div>
    </el-header>

    <div>
      <el-table
        :data="tableData"
        class="account_table">
        <el-table-column
          prop="date"
          label="时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="refundedAmount"
          label="金币"
          width="180">
          <template slot-scope="scope">
            <span>{{scope.row.Order.refundedAmount === null?"———":scope.row.Order.refundedAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="convertPaymentAmount"
          label="支出">
          <template slot-scope="scope">
            <span>{{scope.row.convertPaymentAmount === null?"———":scope.row.convertPaymentAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total=total>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import VerifyUtils from '../../../utils/utils';

  export default {
    name: "AccountInfo",
    props: ['selectTitle'],
    data() {
      return {
        tableData:[],
        coin:0,
        deduction:0,
        total:0,
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      // console.log('selectTitle', this.selectTitle);
      this.getLogInfo();
    },
    methods: {
      //查询金币流水日志
      getLogInfo() {
        // this.userName = localStorage.getItem("nickname");
        let userId = localStorage.getItem("userId");
        let url = '/api/personal/'+ userId +'/coinTransaction';
        this.$get(url, {}).then(res => {
          if (res.data.code === 200) {
            this.coinNumber = res.data.data.account.coin;
            this.deduction = VerifyUtils.specialToDecimal(this.coinNumber);
            this.tableData = res.data.data.res.items;
            this.total = res.data.data.res.total;
            for (let i=0;i<res.data.data.res.items.length;i++){
              this.tableData[i]['convertPaymentAmount'] = VerifyUtils.specialToDecimal(res.data.data.res.items[i].coin);
              this.tableData[i]['convertRefundedAmount'] = VerifyUtils.specialToDecimal(res.data.data.res.items[i].transactionAmount);
              this.tableData[i]['date'] = VerifyUtils.convertDate(res.data.data.res.items[i].createdAt);
            }
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      }
    }
  }
</script>

<style >
  .header_bg {
    background-color: white;
    text-align: right;
    font-size: 18px;
    height: 115px;
  }
  .el-breadcrumb__inner{
    color: #333333 !important;
    font-size: 18px;
  }
  .el-breadcrumb {
    line-height: 3.5;
    font-size: 18px;
    color: #333333;
  }
  /*账户状态*/
  .account_info{
    color: #666666;
    text-align: left;
    font-size: 16px;
  }
  /*账户余额*/
  .account_balance{
    color: #FA6A5A;
    font-size: 18px;
  }
  .account_table {
    margin-top: 15px;
    width: 100%;
    height: 360px;
  }
  .el-pagination {
    background-color: white;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).hover{
    background-color: #33B2E8;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #33B2E8;
  }

</style>
