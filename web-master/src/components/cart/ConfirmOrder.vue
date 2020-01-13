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
          <el-steps :active="active" align-center class="steps">
            <el-step title="我的购物车" description=""></el-step>
            <el-step title="确认订单" description=""></el-step>
            <el-step title="支付" description=""></el-step>
            <el-step title="支付成功" description=""></el-step>
          </el-steps>
          <!--<el-button style="margin-top: 12px;" @click="next()">下一步</el-button>-->
        </el-col>
      </el-row>


    </el-header>
    <div v-if="cartParams === 'order'">
      <div>
        <p class="orderTitle">收货地址</p>
        <el-row :gutter="20">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-for="(o, index) in addressTableData" :key=index :class="{'marginTop15':index>2}">
            <el-card :body-style="{ padding: '0px' }" shadow="hover" :class="{'red_box':o.shadowFlag,'gray_box':!o.shadowFlag}" class="text_align_left padding_left10">
              <div  @click="selectAddress(o)" class="address_info">
                <div slot="header" class="margin_top5">
                  <span>{{o.receiver}}</span>
                  <span> &emsp;{{o.cityName}}</span>
                  <el-button v-if="o.name !== null" class="address_flag">{{o.name === null?'':o.name}}</el-button>
                </div>
                <hr class="hr_color">
                <div class="card_content">
                  <p>{{o.countyName}}</p>
                  <p>{{o.detailAddress}}</p>
                  <p class="margin_bottom15">{{o.phoneNumber}}</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!--<el-row>-->
          <!--<div v-else class="recommend_space_div">-->
            <!--<img src="../../assets/personal/wudingdan_icon@2x.png" height="88" width="" style="margin-top: 20px"/>-->
            <!--<p class="prompt_placeholder">暂时没有相关推荐套餐</p>-->
          <!--</div>-->
        <!--</el-row>-->
      </div>
      <div>
        <p class="orderTitle">支付方式</p>
        <div class="padding_left10 padding_right10">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-card shadow="never" class="text_align_left padding_left10">
                <div class="card_content">
                  <el-radio v-model="radio" class="district" label="wxpay" @change="radioChange()"><img
                    class="pay_img"
                    src="../../assets/order/vip_wechat_icon@2x.png"
                    height="34" width="34"/>微信支付
                  </el-radio>
                </div>
              </el-card>
            </el-col>
            <!--公司转帐仅企业用户可见-->
            <el-col :span="4">
              <el-card shadow="never" class="text_align_left padding_left10" v-if="enterpriseId !== null">
                <div class="card_content">
                  <el-radio v-model="radio" class="district" label="transfer" @change="radioChange()"><img
                    class="pay_img"
                    src="../../assets/order/zz_ddlc_qrdd@2x.png"
                    height="34" width="34"/>公司转账
                  </el-radio>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <div>
        <p class="orderTitle">商品及服务信息</p>
        <div class="padding_left10 padding_right10">
          <el-table
            ref="multipleTable"
            :data="orderData"
            tooltip-effect="dark"
            style="width: 100%" :header-cell-style="tableHeaderColor">
            <el-table-column label="商品" width="100">
              <template slot-scope="scope">
                <img :src="scope.row.goodImgUrl" width="40" height="40" class="head_pic"/>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="商品名称"
              width="120">
              <!--<template slot-scope="scope">{{ scope.row.date }}</template>-->
            </el-table-column>
            <el-table-column
              prop="convertSalePrice"
              label="单价"
              width="120">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="数量"
              show-overflow-tooltip>
              <!--stockQuantity 库存-->
              <template slot-scope="scope">
                <p class="red_font" v-if="scope.row.stockQuantity < scope.row.quantity"><span class="delete_num">{{scope.row.quantity}}</span>库存不足</p>
                {{ scope.row.stockQuantity < scope.row.quantity?(scope.row.stockQuantity) :scope.row.quantity }}
              </template>
            </el-table-column>
            <el-table-column
              prop="preferentialWay"
              label="优惠方式"
              show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.preferentialWay === null?'———':scope.row.preferentialWay }}</template>
            </el-table-column>
            <el-table-column
              prop="sumPrice"
              label="小计"
              width="120">
            </el-table-column>
          </el-table>
        </div>
        <div>
          <p class="orderTitle">结算信息</p>
          <div class="red_box">
            <p class="coupon">优惠券&emsp;<span class="prompt_info">（无可用优惠券）</span></p>
            <div class="padding_left10 padding_right10">
              <el-row :gutter="20" v-if="couponData.length !== 0">
                <el-col :span="4" v-for="(o, index) in couponData" :key="o" :class="{'marginTop15':index>2}">
                  <el-card :body-style="{ padding: '0px' }" shadow="never" class="text_align_left padding_left10">
                    <div class="card_content">
                      <div class="effective_coupon_img">¥30<span class="full_reduction">[满100减30]</span></div>
                      <!--<p class="district">{{couponIntroduce}}</p>-->
                      <p class="prompt_info margin_bottom15">{{effectiveDate}}</p>
                    </div>
                  </el-card>
                  <p class="prompt_info margin_bottom15">
                    <img src="../../assets/order/zhuyi@2x.png" class="prompt_img"/>
                    {{promptInfo}}
                  </p>
                </el-col>
                <el-col :span="12" class="text_align_right padding_right20">
                  <p class="pay_list_content">运费&emsp;¥{{shippingFee}}</p>
                  <p class="pay_list_content">优惠&emsp;¥{{reducedPrice}}</p>
                  <p class="pay_list_content">优惠券&emsp;¥{{freight}}</p>
                  <p class="pay_list_content"><span class="quantity">{{goodsQuantity}}</span>件商品，总额&emsp;¥{{sumPrice}}
                  </p>
                </el-col>
              </el-row>
              <el-row v-else-if="couponData.length === 0">
                <el-col :span="24" class="text_align_right padding_right20">
                  <p class="pay_list_content">运费&emsp;¥{{shippingFee}}</p>
                  <p class="pay_list_content">优惠&emsp;¥{{reducedPrice}}</p>
                  <p class="pay_list_content">优惠券&emsp;¥{{freight}}</p>
                  <p class="pay_list_content"><span class="quantity">{{goodsQuantity}}</span>件商品，总额&emsp;¥{{sumPrice}}
                  </p>
                </el-col>
              </el-row>
            </div>
            <div class="text_align_right padding_right20">
              <p class="pay_list_content"> <el-checkbox v-model="coinChecked" :disabled="coinDisable" @change="checkedStoresChange"></el-checkbox>金币 共:<span class="quantity">¥{{coinNumber}}</span>,可用<span class="quantity">¥{{limitCoin}}</span>,抵<span class="quantity">¥{{useCoin}}</span>
              </p>
              <p class="pay_list_content"> <el-checkbox v-model="accountChecked" :disabled="accountDisable" @change="checkedStoresChange"></el-checkbox>帐户可用额度<span class="quantity">¥{{limitMoney}}</span>,抵扣<span class="quantity">¥{{deductionMoney}}</span>
              </p>
              <p class="pay_list_title">收货地址:<span class="pay_list_content">{{receiptAddress}}</span></p>
              <p class="pay_list_title">收货人:<span class="pay_list_content">{{selectConsignee}}</span></p>
              <p class="pay_list_title">应付金额:<span class="payable">¥{{amountPayable}}</span></p>
            </div>
          </div>
          <div class="text_align_right">
            <el-button class="commit_order_btn" @click="commitOrderEvent() ">提交订单</el-button>
            <!--<el-button class="commit_order_btn_disable" @click="commitOrderEvent()" v-else-if="commitOrderFlag === false" disabled>提交订单</el-button>-->
          </div>
        </div>
      </div>
    </div>
    <!--<div v-else-if="cartParams === 'payment'">-->
    <!--<compent v-bind:is="cartParams === 'payment'">-->
    <!--<order-payment></order-payment>-->
    <!--</compent>-->

    <!--</div>-->
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import OrderPayment from "../cart/OrderPayment"
  import Verify from '../../utils/utils'
  import Cookies from 'js-cookie'

  export default {
    name: "ConfirmOrder",
    components: {
      OrderPayment,
    },
    data() {
      return {
        active: 1,
        addressTableData: [],
        radio: 'wxpay',//微信支付
        orderData: [], //商品列表
        couponData:[],//优惠券
        shippingFee:0.00,//运费
        // couponIntroduce: '¥30[满100减30]全场通用',
        // effectiveDate: '2018-12-12到2019-12-12',
        goodsQuantity: 1,//商品件数
        freight: '0.00',//运费
        reducedPrice:'0.00',//优惠金额
        sumPrice: '0.00',
        accountChecked: false,//是否使用账户余额
        accountDisable:false,
        limitMoney: '0.00',//账户余额
        coinNumber:0, // 金币总额
        limitCoin: 0, // 可用金币
        coinChecked: false, //是否使用金币
        coinDisable:false,
        useCoin: 0, //抵用金币
        deductionMoney: '0.00',//抵扣金额
        maxDeductionMoney: '0.00',//后台返回的最大抵扣金额
        receiptAddress: '',
        selectConsignee: '',//收货人
        amountPayable: '0.00',//应付金额,
        enterpriseId: '',//企业id
        addressData: [],//地址的json列表
        promptInfo:'结算商品中没有符合条件的商品',
        orderItems:[],//订单明细
        discountsDetail:[],//折扣明细
        commitOrderFlag:true,
        paymentAmount:'0.00' //应付金额
      }
    },
    computed: {
      ...mapGetters(['cartParams', 'shopCartCache'])
    },
    created() {
      this.getConfirmOrderInfo();
      this.getCityData();
      this.getShippingAddressData();
      this.enterpriseId = localStorage.getItem('enterpriseId');
      this.$store.dispatch('setPaymentMethod', this.radio);
    },
    methods: {
      //监听金币和账户余额的checked的选择框
      checkedStoresChange(){
        let self = this;
        ///应付金额
        debugger
        self.deductionMoney = self.maxDeductionMoney
        let deductionMoney = Number(self.deductionMoney)
        let accountPayment = Number(self.paymentAmount)
        if (self.accountChecked && self.coinChecked) {
          //当可用账户余额和可用金币都被选中时，应付金额 = paymentAmount - 可用余额 - 可用金币
          //若可用余额 + 可用金币 > paymentAmount，则将可用金币优先计算
          let sum = deductionMoney +  self.useCoin
          if (sum >= accountPayment) {
            // 如果最大可用余额>应付金额，优先使用金币的抵扣，重新计算抵扣余额
            // 如果最大可用余额不大于应付金额，应付金额=账户支付-可用余额-可用金币
            if (deductionMoney >= accountPayment) {
              self.deductionMoney = accountPayment - self.useCoin
              self.amountPayable = accountPayment - Number(self.deductionMoney) - self.useCoin
            } else {
              self.amountPayable = accountPayment - deductionMoney - self.useCoin
            }
            // self.coinChecked = true
            // self.coinSwitch = true
          } else {
            self.amountPayable = accountPayment - self.useCoin - deductionMoney
          }
        }else if (self.coinChecked === true) {
          //当可用可用金币被选中时，再判断可用金币是否大于应付金额，若大于，则账户的checked框不可选，反之
          //金币是按照商品价格的比例显示，这种可能性几乎没有
          if (self.useCoin >= accountPayment) {
            self.accountChecked = false
            self.accountDisable = true
          }else{
            self.accountDisable = false
          }
          self.amountPayable = accountPayment - self.useCoin;
        } else if (self.accountChecked === true) {
          //当可用账户余额被选中时，再判断可用余额是否大于应付金额，若大于，则金币的checked框不可选，反之
          if (deductionMoney >= accountPayment) {
            self.deductionMoney = accountPayment
            self.amountPayable = accountPayment - Number(self.deductionMoney)
          } else {
            self.amountPayable = accountPayment - deductionMoney
          }
        }else{
          //若账户使用余额未选中，则金币可选；若可用金币未选中，账户余额可选择
          if (self.accountChecked === false){
            self.coinDisable = false;
          } else{
            self.accountDisable = false;
          }
          self.amountPayable = accountPayment;
        }
      },
      //收货地址
      getShippingAddressData() {
        let userId = localStorage.getItem("userId");
        // let url = "/api/user/addresss/" + userId;
        let url = "/api/personal/" + userId + '/address';
        this.$get(url, {
          page: this.currentPage,
          perPage: 10,
        }).then(res => {
          console.log(JSON.stringify(res))
          if (res.data.code === 200) {
            this.addressTableData = res.data.data.items;
            // this.total = res.data.data.total;
            for (let i = 0; i < this.addressTableData.length; i++) {
              let province = this.addressTableData[i].province;
              let city = this.addressTableData[i].city;
              let county = this.addressTableData[i].county;
              this.addressTableData[i]['cityName'] = this.addressData['86'][province] + this.addressData[province][city];
              this.addressTableData[i]['countyName'] = this.addressData[city][county];
              this.addressTableData[i]['detailAddress'] = this.addressData['86'][province] + this.addressData[province][city] + this.addressData[city][county];
              this.addressTableData[i]['shadowFlag'] = false;
            }
            for (let j = 0; j < this.addressTableData.length; j++) {
              if (this.addressTableData[j].default == true){
                this.addressTableData[j].shadowFlag = true;
                this.receiptAddress =  this.addressTableData[j]['detailAddress']+this.addressTableData[j].address;
                this.selectConsignee = this.addressTableData[j].receiver;
                return;
              }
            }
            // this.currentPage = res.data.data.page;
            // console.log("addressTableData ==" + JSON.stringify(this.addressTableData));
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //确认订单
      getConfirmOrderInfo() {
        let self = this;
        let url = 'http://api-trade.health.sweetydaddy.com/order/confirm';
        // let url = '/order/confirm';
        let data = {
          orderFrom: 'cart',
          createdAt: new Date().getTime()
        };
        let cartData = [];
        let items = [];
        if (Verify.validateIsNull(Cookies.get('shoppingCartList'))) {
          cartData = JSON.parse(Cookies.get('shoppingCartList'));
          for (let i = 0; i < cartData.length; i++) {
            let obj = {
              productId: cartData[i].productId,
              quantity: cartData[i].amount
            };
            items.push(obj);
          }
        } else if (Verify.validateIsNull(self.shopCartCache)) {
          cartData = JSON.parse(this.shopCartCache);
          for (let i = 0; i < cartData.length; i++) {
            let obj = {
              productId: cartData[i].productId,
              quantity: cartData[i].amount
            };
            items.push(obj);
          }
        }
        if (Verify.validateIsNull(items)) {
          // data['cart'] = {items: items};
          data['items'] = items;
        }
        self.$post(url, data).then(res => {
        // this.$orderPost(url, data).then(res => {
          if (res.data.code === 200) {
            // console.log("cartInfo==" + JSON.stringify(res.data.data));
            self.orderData = res.data.data.products;
            //优惠券
            self.couponData = res.data.data.discount.coupon;
            //运费
            if (Verify.validateIsNull(res.data.data.shipping)) {
              self.shippingFee = Verify.toDecimal(res.data.data.shipping.amount);
            }else{
              self.shippingFee = Verify.toDecimal(self.shippingFee);
            }
            //订单明细，确认订单时传参
            // this.orderItems = res.data.data.products;

            //账户可用额度
            self.limitMoney = Verify.toDecimal(res.data.data.account.balance);
            //抵扣
            self.deductionMoney = 1500
              // Verify.toDecimal(res.data.data.account.enabledBalance);
            self.maxDeductionMoney = 1500
              // Verify.toDecimal(res.data.data.account.enabledBalance);
            //总额
            self.sumPrice = Verify.toDecimal(res.data.data.order.total);
            //金币总额
            if (Verify.validateIsNull(res.data.data.account.coin)) {
              self.coinNumber = res.data.data.account.coin;
            }
            if (Verify.validateIsNull(res.data.data.account.enabledCoin)) {
              // 可用金币
              self.limitCoin = res.data.data.account.enabledCoin;
              // 抵用金币
              self.useCoin = res.data.data.account.enabledCoin;
            }
            //应付金额
            self.amountPayable = Verify.toDecimal(res.data.data.order.paymentAmount);
            self.paymentAmount = Verify.toDecimal(res.data.data.order.paymentAmount);

            //商品数量
            self.goodsQuantity = res.data.data.order.quantity;
            //优惠金额
            self.reducedPrice = Verify.toDecimal(res.data.data.order.discountAmount);
            //判断是否可以提交订单

            for (let i=0;i<res.data.data.products.length;i++){
              //分转元后的单价
              self.orderData[i]['convertSalePrice'] = Verify.toDecimal(res.data.data.products[i].salePrice);
              //总计
              self.orderData[i]['sumPrice'] = Verify.toDecimal(res.data.data.products[i].total);
              //  提交订单的按钮是否可点
              if (res.data.data.products[i].stockQuantity < res.data.data.products[i].quantity && res.data.data.products[i].stockQuantity <=0){
                // this.commitOrderFlag = false;
              }else {
                // console.log("discounts22l==" + JSON.stringify(res.data.data.products[i]));
                self.orderItems.push(res.data.data.products[i]);
                // console.log("discountsDetail==" + JSON.stringify(this.orderItems));
              }
            }

            for (let i=0;i<res.data.data.products.length;i++){
              //优惠方式
              if (Verify.validateIsNull(res.data.data.discount.enterprise)) {
                self.orderData[i]['preferentialWay']  = res.data.data.discount.enterprise.name +res.data.data.discount.enterprise.discountPercentage;
              }
              //商品图片
              if (Verify.validateIsNull(res.data.data.products[i].File)) {
                self.orderData[i]['goodImgUrl'] = 'http://'+res.data.data.products[i].File.url;
                //给订单详情赋值图片id
                self.orderItems[i]['imageFileId'] = res.data.data.products[i].File.id;//商品图片
              }

            }
            //优惠明细
            let obj = {
              id:res.data.data.discount.enterprise.id,
              amount:res.data.data.discount.enterprise.discountAmount
            };
            self.discountsDetail.push(obj);

          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
        // orderPostRequest(data).then(res =>{
        //   debugger
        //   console.log("cartInfo==" + JSON.stringify(res.data.data));
        // })
      },
      //选择收货地址
      selectAddress(address){
        // address.shadowFlag = !address.shadowFlag;
        this.receiptAddress = address.detailAddress + address.address;
        this.selectConsignee = address.receiver;
        for (let i = 0; i < this.addressTableData.length; i++) {
          if (this.addressTableData[i].shadowFlag === true) {
            this.addressTableData[i].shadowFlag = false;
          }else{
            address.shadowFlag = !address.shadowFlag;
          }
        }
      },
      //创建订单
      commitOrderEvent() {
        if (this.orderItems.length !=0){
        // if (this.commitOrderFlag == true){
          let url = 'http://api-trade.health.sweetydaddy.com/order';
          // //优惠明细（不需要则不传或null）非必传
          // let discounts = [];
          // discounts['id'] = '';
          // discounts['amount'] = '';//折扣金额
          //配送信息 (不需要则不传或传null)
          let shipping = {};
          shipping['receiver'] = '';
          shipping['phoneNumber'] = '';
          shipping['province'] = '';
          shipping['city'] = '';
          shipping['county'] = '';
          shipping['address'] = '';
          let data = {
            orderFrom: 'cart',
            accountAmount: this.deductionMoney,//账户支付金额（分）
            paymentAmount: this.amountPayable,//第三方支付金额（分）
            paymentMethod: this.radio,//支付方式：'wxpay'-微信支付 'transfer'-公司转帐
            items: this.orderItems,//订单明细
            coinAmount:this.useCoin
          };
          if (Verify.validateIsNull(this.discountsDetail)) {
            // data['cart'] = {items: items};
            data['discounts'] = this.discountsDetail;
          }
          this.$post(url, data).then(res => {
            if (res.data.code === 200) {
              this.$store.dispatch('setCartParams', 'payment');
              this.$router.push({ path: '/OrderPayment',query:{tradeNo:res.data.data.orderNumber,paymentAmount:res.data.data.paymentAmount}});
              // console.log("cartInfo 1222==" + JSON.stringify(res.data.data));
            } else {
              alert(res.data.msg);
            }
          }).catch(function (reason) {
            console.log('catch:', reason);
          });
        } else{
          this.$message({
            message: '库存不足，请修改购物车数量',
            type: 'warning'
          });
        }
      },
      radioChange() {
        this.$store.dispatch('setPaymentMethod', this.radio);
        // console.log("123===" + this.radio);
      },
      next() {
        if (this.active++ > 2) this.active = 0;
      },
      getCityData() {
        const config = require('../../../static/region');
        // this.firmAddress = config['86'];
        this.addressData = config;
      },
      //修改表头背景色
      tableHeaderColor({row, column, rowIndex, columnIndex}) {
        if (rowIndex === 0) {
          return 'background-color: #F6F6F6;color: #404040;font-weight: 500;'
        }
      }

    }
  }
</script>

<style>
  @import "../../styles/personal/personal-center.scss";

  .logo_img_div {
    text-align: left;
  }
  /*步骤条的样式*/
  .steps .el-step__title.is-process {
    font-weight: 700;
    color: #33B2E8;
  }
  .steps .el-step__head.is-success {
    color: #33B2E8;
    border-color: #33B2E8;
  }
  .steps .el-step__title.is-finish {
    color: #33B2E8;
  }
  .steps .el-step__title.is-finish {
    color: #33B2E8
  }
  .steps .el-step__head.is-finish {
    color: #33B2E8;
    border-color: #33B2E8
  }
  .logo_img {
    text-align: left;
    height: 60px;
    margin-top: 0.75rem;
  }

  .orderTitle {
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    padding-top: 10px;
    padding-left: 10px;
    text-align: left;
  }

  .marginTop15 {
    margin-top: 15px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
  .address_info {
    font-size: 14px;
    color: #404040;
  }
  /*家 或公司*/
  .address_flag{
    font-size: 14px;
    color: #404040;
    width:60px;
    height:28px;
    background:#EEEEEE;
    float: right;
    padding: 3px 0;
    margin-right: 5px;
  }

  .pay_img {
    vertical-align: middle;
  }

  /*'区'的字体样式*/
  .district {
    font-size: 16px;
    color: #000000;
  }

  /*优惠券标题*/
  .coupon {
    font-size: 14px;
    color: #404040;
    padding-left: 10px;
    text-align: left;
  }

  /*优惠券的'块'*/
  .coupon_img {
    margin-top: 10px;
    width: 78px;
    height: 36px;
    background: #CCCCCC;
    color: #ffffff;
    font-size: 24px;
    text-align: center;
  }

  .effective_coupon_img {
    margin: 10px;
    /*width: 78px;*/
    height: 36px;
    background: #FA9992;
    color: #ffffff;
    font-size: 24px;
    text-align: center;
  }

  .quantity {
    color: #DF2321;
    font-size: 14px;
  }

  .pay_list_title {
    font-weight: bold;
    font-size: 14px;
    color: #404040;
  }

  .pay_list_content {
    font-weight: normal;
    font-size: 14px;
    color: #666666;
  }

  .payable {
    font-size: 24px;
    color: #DF2321;
  }

  .commit_order_btn {
    background-color: #DF2321;
    color: #ffffff;
    border-radius: 0px;
    width: 158px;
    height: 46px;
    border: 1px solid #DF2321;
  }
  .commit_order_btn_disable{
    background-color: #CCCCCC;
    color: #ffffff;
    border-radius: 0px;
    width: 158px;
    height: 46px;
  }

  .red_box {
     border: 1px solid #DF2321;
   }
   .gray_box{
     border: 1px solid lightgrey;
   }
  .prompt_info{
    color: #666666;
    font-size: 12px;
  }
  .prompt_img {
    vertical-align: middle;
    height: 17px;
    width: 17px;
  }
  /*满减*/
  .full_reduction{
    font-size: 12px;
    color: #ffffff;
  }
  .hr_color{
    color: #EEEEEE;
    margin-right: 5px;
    /*height: 0.5px;*/
  }
  /*库存不足*/
  .red_font{
    color: red;
  }
  .delete_num{
    text-decoration:line-through
  }
</style>
