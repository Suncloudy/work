<template>
  <div class="padding_left_right">
    <el-header>
      <el-row>
        <el-col :span="10">
          <div class="logo_img_div">
            <img src="../../assets/logo_login@2x.png" class="logo_img"/>
          </div>
        </el-col>
        <el-col :span="12" class="margin_top15">
          <el-steps :active="active" align-center>
            <el-step title="我的购物车" description=""></el-step>
            <el-step title="确认订单" description=""></el-step>
            <el-step title="支付" description=""></el-step>
            <el-step title="支付成功" description=""></el-step>
          </el-steps>
          <!--<el-button style="margin-top: 12px;" @click="next()">下一步</el-button>-->
        </el-col>
      </el-row>
    </el-header>

    <el-row class="margin_top18">
      <el-col :span="12" class="text_align_left">
        <p>订单提交成功，请尽快付款！订单号：{{orderNumber}}</p>
      </el-col>
      <el-col :span="12">
        <p class="info_title">应付金额:<span class="payable">¥{{amountPayable}}</span></p>
      </el-col>
    </el-row>
    <hr>

    <div v-if="paymentMethod === 'transfer'">
      <p class="payTitle">线下汇款<span class="info_content">(到账周期约3个工作日)</span></p>
      <ol>
        <li class="info_content text_align_left">
          汇款订单号为：<span>{{orderNumber}}</span>，线下公司转账请将此订单号填写至电汇凭证的【汇款用途】、【附言】、【摘要】栏内
          （提醒：不同银行的备注字段不同，最好是将所有的可填写备注的地方都填写订单号）
        </li>
        <li class="info_content text_align_left">
          线下公司转账订单，一次转帐可对应多个订单，多个订单时请添写所有订单号，请勿多转账或者少转账。
        </li>
        <li class="info_content text_align_left">
          请在7天内完成汇款，超过10天未对账系统自动会取消订单。到账周期约为3个工作日
        </li>
      </ol>
      <p class="payTitle">汇款信息</p>
      <div class="text_align_left padding_left20">
        <p class="info_title">户名：<span class="info_content">{{accountName}}</span></p>
        <p class="info_title">账号：<span class="info_content">{{account}}</span></p>
        <p class="info_title">开户行：<span class="info_content">{{bank}}</span></p>
        <!--联行号暂时隐藏-->
        <!--<p class="info_title">联行号：<span class="info_content">{{bankNumber}}</span></p>-->
        <p class="info_title">订单号：<span class="info_content">{{orderNumber}}</span></p>
      </div>
    </div>
    <div v-else>
      <p class="payTitle">微信支付</p>
      <div class="margin_left80">
        <p class="info_content text_align_left">距离二维码过期还剩<span class="info_content">{{second}}</span>秒，过期后请刷新也页面重新获取二维码
        </p>
        <div style="width: 160px;height: 160px;background-color:#e6e6e6"></div>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "OrderPayment",
    data() {
      return {
        active:2,
        second: 60,
        amountPayable: '0.00',
        orderNumber: '',
        accountName: '',
        account: '',
        bank: '',
        // bankNumber: '2222 3333 4444',//联行号 暂时不需要
        payData:{},
      }
    },
    computed: {
      ...mapGetters(['paymentMethod','cartParams'])
    },
    created(){
      this.getPaymentInfo();
      this.Times();
      this.orderNumber = this.$route.query.tradeNo;
      this.amountPayable = this.$route.query.paymentAmount;
    },
    methods: {
      getPaymentInfo(){
        let url = "http://api-trade.health.sweetydaddy.com/payment";
        this.$get(url, {
          tradeNo:this.$route.query.tradeNo
        }).then(res => {
          // console.log(JSON.stringify(res))
          if (res.data.code === 200) {
            let bankData = res.data.data.transfer;
            // this.amountPayable = bankData.;
              this.orderNumber = bankData.tradeNo;
              this.accountName = bankData.name;
              this.account =  bankData.account;
              this.bank = bankData.bank;
              // this.bankNumber = '2222 3333 4444';//联行号
            // this.total = res.data.data.total;
            // this.currentPage = res.data.data.page;
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //获取支付状态
      getPayStatus(){
        let url = "http://api-trade.health.sweetydaddy.com/payment/status";
        this.$get(url, {
          tradeNo:this.$route.query.tradeNo
        }).then(res => {
          console.log("status=="+JSON.stringify(res))
          if (res.data.code === 200) {
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //微信支付二维码的倒计时
      Times() {
        var _self = this;
        var interval = window.setInterval(function () {
          if ((_self.second--) <= 0) {
            _self.second = 0;
            window.clearInterval(interval);
          }
        }, 1000);
      }
    }
  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";

  .logo_img_div {
    /*margin-left: 6.75rem;*/
    text-align: left;
  }

  .logo_img {
    text-align: left;
    height: 60px;
    margin-top: 0.75rem;
  }
  .margin_top18 {
    margin-top: 1.6%;
  }
  .margin_left80 {
    margin-left: 10%;
  }

  .commit_info {

  }

  .payTitle {
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    padding-top: 10px;
    padding-left: 10px;
    text-align: left;
  }

  .info_title {
    font-size: 14px;
    color: #404040;
    font-weight: bold;
  }

  .info_content {
    font-size: 14px;
    color: #666666;
    font-weight: normal;
  }

  .payable {
    font-size: 24px;
    color: #DF2321;
  }
</style>
