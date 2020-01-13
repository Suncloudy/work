<template>
  <div class="white_bg_color" v-if="invoiceInfoFlag==false">
    <el-row>
      <el-col :span="18">
        <el-form :model="invoiceInfo" label-width="130px" class="data_form" :rules="invoiceRules" ref="invoiceInfo">
          <el-form-item label="开具类型" prop="accountType">
            <el-radio-group v-model="invoiceInfo.accountType">
              <el-radio label="0">企业</el-radio>
              <el-radio label="1">普通用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发票抬头" prop="invoiceName">
            <el-input v-model="invoiceInfo.invoiceName" autocomplete="off" placeholder="请输入发票抬头"></el-input>
          </el-form-item>
          <el-form-item label="发票类型" prop="invoiceType">
            <el-radio-group v-model="invoiceInfo.invoiceType">
              <el-radio label="0">企业增值税普通发票</el-radio>
              <el-radio label="1">增值税专用发票</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="税务登记证号">
            <el-input v-model="invoiceInfo.taxRegistrationNo" autocomplete="off" placeholder="请输入税务登记证号"></el-input>
          </el-form-item>
          <el-form-item label="基本开户银行名称">
            <el-input v-model="invoiceInfo.bankName" autocomplete="off" placeholder="请输入开户许可证上的开户行名称"></el-input>
          </el-form-item>
          <el-form-item label="开户银行账号">
            <el-input v-model="invoiceInfo.bankAccountNumber" autocomplete="off"
                      placeholder="请输入开户许可证上的银行账号"></el-input>
          </el-form-item>
          <el-form-item label="注册地址">
            <el-input v-model="invoiceInfo.registerAddress" autocomplete="off" placeholder="请填写营业执照上的注册地址"></el-input>
          </el-form-item>
          <el-form-item label="注册固定电话">
            <el-input v-model="invoiceInfo.registeredLine" autocomplete="off" placeholder="请填写有效联系电话"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button size="medium" class="confirm_invoice_info" @click="confirmInfo()">确定</el-button>
          </el-form-item>
        </el-form>
        <!--<div class="confirm_div">-->
          <!--<el-button size="medium" class="confirm_invoice_info" @click="confirmInfo()">确定</el-button>-->
        <!--</div>-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import swal from 'sweetalert2'; //alert框

  export default {
    name: "InvoiceInfoManage",
    data() {
      return {
        showInvoiceInfo:false,
        invoiceInfo: {
          accountType:"0",
          invoiceName: '',
          invoiceType: '0',//0企业增值税普通发票 1增值税专用发票
          taxRegistrationNo: '',
          bankName: '',
          bankAccountNumber: '',
          registerAddress: '',
          registeredLine: '',//注册固定电话
        },
        invoiceRules:
          {
            invoiceName: [
              {required: true, message: '请输入发票抬头', trigger: 'blur'},
              {min: 2, message: '长度在最小2个字符', trigger: 'blur'}
            ],
            // birth: [
            //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            // ],
          }
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle','invoiceInfoFlag'])
    },
    methods:{
      confirmInfo(){

        let enterpriseId = localStorage.getItem("enterpriseId");
        let listUrl = "/api/enterprise/invoice/basic/" + enterpriseId;
        this.$post(listUrl, {
          accountType:this.invoiceInfo.accountType,
          invoiceHead:this.invoiceInfo.invoiceName,
          invoiceType: this.invoiceInfo.invoiceType,//发票类型 0企业增值税普通发票 1增值税专用发票
          taxpayerId: this.invoiceInfo.taxRegistrationNo,//纳税人识别码
          bankAccount: this.invoiceInfo.bankAccountNumber,//开户银行账户  如果invoiceType=1 必须上传
          bankName: this.invoiceInfo.bankName,
          address: this.invoiceInfo.registerAddress,
          phoneNumber: this.invoiceInfo.registeredLine,
        }).then(res => {
          if (res.data.code === 200) {
            swal("提示","修改成功", "success");
            this.showInvoiceInfo = true;
            this.$store.dispatch('setInvoiceInfo',true);
            // this.$router.push({ path: '/InvoiceManagement'});
            // console.log("invoiceInfo111=="+this.invoiceInfoFlag);
          } else {
            swal("提示", res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      }
    }
  }
</script>

<style scoped>
  @import "../../../styles/personal/personal-center.scss";

  .data_form {
    width: 450px;
    padding-top: 30px;
    padding-bottom: 30px;
  }
  .confirm_invoice_info{
    width:310px;
    background-color:#33B2E8;
    font-size: 17px;
    color: #FFFFFF;
  }
  .displayClass{
    display: none;
  }
</style>
