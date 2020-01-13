<template>
  <div class="margin_top15 white_bg_color padding10">
    <el-table
      :data="tableData"
      height="450"
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
        prop="status"
        label="状态">
      <template slot-scope="scope">
        {{scope.row.status ===0?"已创建":(scope.row.status ===1?"已完成":"已作废")}}
      </template>
      </el-table-column>
      <el-table-column
        prop="createDate" width="180"
        label="时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <div class="del_goods">
            <el-button @click="payClick(scope.row)" type="text" size="small">支付</el-button>
            <el-button @click="cancellationClick(scope.row)" type="text" size="small">作废</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total" class="margin_top15">
    </el-pagination>
  </div>
</template>

<script>
  import Verify from '../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {mapGetters} from 'vuex'

  export default {
    name: "MedicalHistory",
    data() {
      return {
        total:0,
        currentPage:1,
        pageSize:10,
        tableData: [],
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created(){
      this.getHistoryList();
    },
    methods:{
      getHistoryList(){
        let enterpriseId = localStorage.getItem("enterpriseId");
        console.log('enterpriseId=='+enterpriseId);
        let historyUrl = "/api/enterprise/medicalExamiantionPlans/"+enterpriseId;
        this.$get(historyUrl, {
          // enterpriseId:enterpriseId,
          page:this.currentPage,
          perPage:this.pageSize
        }).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.items;
            this.total = res.data.data.total;
            for (const i in this.tableData){
              let createDate = Verify.convertDate(this.tableData[i].createdAt);
              this.tableData[i]['createDate']= createDate;
            }
            // console.log("历史==" + JSON.stringify(res));
          } else {
            swal("提示",res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //支付
      payClick(){

      },
      //作废
      cancellationClick(row){
        swal({
          title: "您确定要作废这条体检计划吗?",
          // text: "You will not be able to recover this imaginary file!",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            let cancelUrl = "/api/enterprise/medicalExamiantionPlan/" + row.id;
            this.$del(cancelUrl, {
            }).then(res => {
              if (res.data.code === 200) {
                // console.log("作废体检计划==" + JSON.stringify(res.data));
                swal("提示", "这条体检计划已作废", "success");
                this.getHistoryList();
              } else {
                swal("提示",res.data.msg, "error");
              }
              // console.log("res=="+JSON.stringify(res))
            }).catch(function (reason) {
              console.log(JSON.stringify(reason));
            });
          }
        });
      },
      handleClick(){

      },
      // 修改table header的背景色
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #F6F6F6;color: #404040;font-weight: 500;'
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getHistoryList();
      }
    }
  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";
  .padding10{
    padding: 10px;
  }
</style>
