<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{asideNavTitle[0]}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{asideNavTitle[1]}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <div class="white_bg_color margin_top15">
      <div :class="{displayClass:!submittedFlag}">
        <p class="regular_font text_align_left padding_top10 padding_left10">
          如果您已线下汇款或汇款底单信息提交错误，可以
          <el-button class="submittedLate" size="medium" @click="submittedLate()">提交底单</el-button>
        </p>

        <el-table
          :data="remittanceData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange" :header-cell-style="tableHeaderColor" class="padding_left10">
          <el-table-column
            prop="commitWay"
            label="汇款单位">
            <template slot-scope="scope">
              <span>{{scope.row.commitWay===1?'底单汇款信息':'汇款底单扫描件'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="money"
            label="汇款金额">
            <template slot-scope="scope">
              <span>{{scope.row.money ===null?'———':scope.row.money}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="bankAccount" width="160"
            label="汇款人银行账号">
            <template slot-scope="scope">
              <span>{{scope.row.bankAccount ===null?'———':scope.row.bankAccount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="contact"
            label="联系人">
          </el-table-column>
          <el-table-column
            prop="phoneNumber"
            label="联系手机">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="提交时间">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <span class="special_color">{{scope.row.status==='0'?'审核中':'审核完成'}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--fixed="right"-->
            <!--label="操作">-->
            <!--<template slot-scope="scope">-->
              <!--<el-button type="text" size="small" @click="detailInfo(scope.row)">详细</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
        <div class="margin_top15" style="width: 100%">
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
    </div>
    <div :class="{displayClass:submittedFlag}">
      <offline-submitted-late :submittedFlag = "submittedFlag"></offline-submitted-late>
      <!--<el-form>-->
        <!--<el-form-item label="">-->
          <!--<el-button size="medium" class="confirm_invoice_info" @click="confirmInfo()">确定</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
    </div>
  </div>
</template>

<script>
  import OfflineSubmittedLate from '../../firm/costmanagement/OfflineSubmittedLate'
  import {mapGetters} from 'vuex'
  import Verify from '../../../utils/utils'
  import swal from 'sweetalert2'; //alert框

  export default {
    name: "OfflineRemittance",
    components: {OfflineSubmittedLate},
    data() {
      components:{
        OfflineSubmittedLate
      }
      return {
        remittanceData: [],
        currentPage: 1,
        total: 1,
        remittanceInfo: {
          commitWay: '',
          scanRemittance: '',
          contacts: '',
          contactTel: '',
          remarks: ''
        },
        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }],
        invoiceRules: {
          invoiceName: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'},
            {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
          ],
          // birth: [
          //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          // ],
        },
        submittedFlag: true
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created(){
      this.getRemittance();
    },
    methods: {
      submittedLate() {
        this.submittedFlag = false;
      },
      getRemittance(){
        let enterpriseId = localStorage.getItem("enterpriseId");
        let listUrl = "/api/enterprise/remittances/" + enterpriseId;
        this.$get(listUrl, {
          page:this.currentPage,
          // enterpriseId:enterpriseId
        }).then(res => {
          if (res.data.code === 200) {
            this.remittanceData = res.data.data.items;
            this.currentPage = res.data.data.page;
            this.total = res.data.data.total;
            for (const i in this.remittanceData) {
              let createDate = Verify.convertDate(this.remittanceData[i].createdAt);
              this.remittanceData[i]['createDate'] = createDate;
            }
            // console.log("order list data ==" + JSON.stringify(res.data));
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getRemittance();
      },
      handleSelectionChange(val) {
        console.log(`每 ${val} 条`);
        // this.multipleSelection = val;
      },
      // 修改table header的背景色
      tableHeaderColor({row, column, rowIndex, columnIndex}) {
        if (rowIndex === 0) {
          return 'background-color: #F6F6F6;color: #404040;font-weight: 500;'
        }
      }
    },
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

  .submittedLate {
    background-color: #33B2E8;
    color: #ffffff;
    font-size: 17px;
    width: 120px;
  }

  .regular_font {
    color: #666666;
    font-size: 14px;
  }

  .displayClass {
    display: none;
  }
</style>
