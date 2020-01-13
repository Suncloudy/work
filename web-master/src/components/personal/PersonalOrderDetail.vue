<template>
  <div>
    <div class="white_bg_color">
      <el-header class="header_bg">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <!--订单状态-->
      <!--<el-divider></el-divider>-->
      <div class="margin_top15 border_top_bottom">
        <el-row>
          <el-col :span="6" class="border_right">
            <div>
              <p class="pay_status">{{payStatus}}</p>
              <div id="payButton">
                <el-button size="small" class="pay_btn">{{payBtnText}}</el-button>
              </div>
              <p class="countdown">{{countdownPayment}}</p>
              <el-row>
                <el-col :span="12">
                  &emsp;
                  <!--<el-popover-->
                    <!--placement="top"-->
                    <!--width="160"-->
                    <!--v-model="visible2">-->
                    <!--<p>这是一段内容这是一段内容确定删除吗？</p>-->
                    <!--<div style="text-align: right; margin: 0">-->
                      <!--<el-button size="mini" type="text" @click="visible2 = false">取消</el-button>-->
                      <!--<el-button type="primary" size="mini" @click="visible2 = false">确定</el-button>-->
                    <!--</div>-->
                    <!--<el-button slot="reference" type="text" class="cancel_order">付款信息</el-button>-->
                  <!--</el-popover>-->
                </el-col>
                <el-col :span="12">
                  <el-button type="text" class="cancel_order">取消订单</el-button>
                </el-col>
              </el-row>
            </div>

          </el-col>
          <el-col :span="18">
            <p class="timeout_prompt">
              请在下单后24小时内完成支付，24小时后如果还未付款，系统将自动取消该订单
            </p>
            <el-steps :active="0" align-center>
              <el-step title="提交订单" description="2019-02-18 08:43:00" class="timeout_prompt"></el-step>
              <el-step title="支付订单" description=""></el-step>
              <el-step title="订单发货" description=""></el-step>
              <el-step title="完成订单" description=""></el-step>
            </el-steps>
          </el-col>
        </el-row>
      </div>
      <!--物流信息-->
      <div class="margin_top15 border_top_bottom">
        <el-row>
          <el-col :span="6" class="timeout_prompt margin_top15">
            <el-row>
              <el-col :span="12">
                <img
                  style="width: 100px; height: 100px"
                  :src="goodUrl">
              </el-col>
              <el-col :span="12">
                <p>{{expressDelivery}}</p>
                <p>{{waybillNumber}}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12" class="border_left courier_company margin_top15">
            <!--<div v-for="(t,index) in logisticsTime" :key="index">-->
            <!--<p>{{t}}</p>-->
            <!--</div>-->
            <el-timeline :reverse="reverse">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp">
                {{activity.content}}
              </el-timeline-item>
            </el-timeline>
          </el-col>
          <el-col :span="12" class="courier_company">
            <!--<div v-for="(t,index) in logisticsInfo" :key="index" class="text_align_left padding_left10">-->
            <!--<p>{{t}}</p>-->
            <!--</div>-->
          </el-col>
        </el-row>
      </div>
      <!--订单信息-->
      <div class="">
        <div class="margin_top15 margin_left10 border_top_bottom">
          <el-row>
            <el-col :span="12">
              <div class="text_align_left info_content">
                <p class="info_title">订单信息</p>
                <p>订单编号：{{orderNo}}</p>
                <p>下单时间：{{orderTime}}</p>
                <p>收货人：{{receiver}}</p>
                <p>手机号：{{phoneNumber}}</p>
                <p>地址：{{shippingAddress}}</p>
              </div>
            </el-col>
            <el-col :span="12" class="border_left padding_left10">
              <div class="text_align_left info_content">
                <p class="info_title">付款信息</p>
                <p>支付方式：{{payMethod}}</p>
                <p>商品总额：￥{{totalMerchandise}}</p>
                <p>优惠：-￥{{discountedPrice}}</p>
                <p>金币：-￥{{coinNumber}}</p>
                <p>运费：￥{{freight}}</p>
                <p>应付总额：￥{{totalAmountPayable}}</p>
                <p>账户支付：￥{{accountPayment}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--商品列表-->
      <div class="border_all margin_top15">
        <div class="padding_left10 padding_right10 padding_top10">
          <el-row class="text-center table_header_bgColor">
            <el-col :span="12">
              <p>商品</p>
            </el-col>
            <el-col :span="4">
              <p>单价</p>
            </el-col>
            <el-col :span="4">
              <p>数量</p>
            </el-col>
            <el-col :span="4">
              <p>操作</p>
            </el-col>
          </el-row>
          <div class="div_border">
            <el-row class="text-center vertical-container">
              <el-col v-for="(product,index) in tableData" class="special_right_border" :key="index">
                <el-col :span="12" class="margin_top5 padding_left10">
                  <el-row>
                    <el-col :span="12">
                      <img
                        style="width: 100px; height: 100px"
                        :src="product.goodsImg">
                    </el-col>
                    <el-col :span="12">
                      <p class="order_title">{{product.name}}</p>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="4" class="margin_top5">
                  <p class="order_title">¥{{product.goodPrice}}</p>
                </el-col>
                <el-col :span="4" class="margin_top5">
                  <p>x{{product.quantity}}</p>
                </el-col>
                <el-col :span="4" class="margin_top5 margin_bottom15">
                  <!--订单状态为40时表示已取消，此时不再显示"取消"操作-->
                  <el-button type="text" @click="applyAfterSales(product.id,product.orderId)">申请售后</el-button>
                  <el-button type="btn" size="small" @click="againBuyEvent(product.productId)">再次购买</el-button>
                </el-col>
              </el-col>
            </el-row>
          </div>
          <div class="text_align_right padding_right10 border_top info_content">
            <p>商品总额：￥<span class="timeout_prompt">{{totalMerchandise}}</span></p>
            <p>优惠：-￥<span class="timeout_prompt">{{discountedPrice}}</span></p>
            <p>运费金额：￥<span class="timeout_prompt">{{freight}}</span></p>
            <p class="pay_amount">应付总额：￥<span class="pay_money">{{totalAmountPayable}}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Verify from '../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  export default {
    name: "PersonalOrderDetail",
    data() {
      return {
        active:0,
        payBtnText:'去支付',
        payStatusCode:'',
        payStatus: '等待付款',
        countdownPayment: '剩余1天23时51分',
        stepTime: '2019-02-18 08:43:07',
        expressDelivery: '韵达快递',//快递公司
        waybillNumber: '736837283792',//运单号
        visible2: false,
        goodUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        logisticsTime: [
          '2019-02-18 08:43:07',
          '2019-02-18 08:43:07',
          '2019-02-18 08:43:07',
          '2019-02-18 08:43:07',
          '2019-02-18 08:43:07',
          '2019-02-18 08:43:07',
        ],
        logisticsInfo: [
          '欢迎下次光临',
          '商品发货：韵达快递 7514779376425',
          '拣货完成',
          '您的订单已经打印完成',
          '您的商品已分配给货仓准备出库',
          '您的订单审核通过'
        ],
        //订单信息
        orderStatusCode:'',
        orderNo: '',//订单编号
        orderTime: '2019-02-18 08:43:07',
        receiver: '收货人',
        phoneNumber: '158****1234',
        shippingAddress: '北京市北京市海淀区全区2期4号楼3单元302',//收货地址
        //付款信息
        payMethod: '公司转账',
        totalMerchandise: '0.00',//商品总额
        discountedPrice: '0.00',//优惠金额
        coinNumber: 0,
        freight: '0.00',//运费
        totalAmountPayable: '0.00',//应付总额
        accountPayment: '0.00',//账户支付
        tableData: [],
        reverse: true,
        activities: [{
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-success'
        }, {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        }, {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        }, {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }]
      }
    },
    created(){
      this.getPersonOrderDetailData();
    },
    methods:{
      getPersonOrderDetailData(){
        let url = '/api/personal/'+ this.$route.query.orderNo +'/order';
        this.$get(url, {}).then((res) => {
          if (res.data.code === 200) {
            // console.log('122='+JSON.stringify(res.data.data));
            let orderData = res.data.data;
            this.orderStatusCode = orderData.order.orderStatus;
            //'订单状态：10、20 = 提交订单  20 未发货 = 待发货 30 已完成  无需发货订单 不显示"待发货"
            //30 就是已经完了，这个时候需要判断发货状态，发货了就按完成处理，不需要发货的也按完成处理
            // 支付状态：10.待支付。20.已支付。30.支付失败。40.已退款'
            //  发货状态：10.未发货。20.部分发货。30.全部发货。40.已收货。50.无需发货
            if (orderData.order.paymentStatus === 10) {
              this.active = 1;
              this.payStatus = '等待付款';
              this.payBtnText = '去支付';
            } else if (orderData.order.paymentStatus === 20) {

              if (orderData.order.shippingStatus === 10) {
                this.active = 3;
                this.payStatus = '待发货';
                this.payBtnText = '重传汇款单';
              } else if (orderData.order.shippingStatus === 20 || orderData.order.shippingStatus === 30) {
                if (this.orderStatusCode === 30) {
                  this.active = 4;
                  this.payStatus = '已完成';
                  this.payBtnText = '再次购买';
                } else {
                  this.active = 3;
                  this.payStatus = '已发货';
                }
              } else if (orderData.order.shippingStatus === 40) {
                if (this.orderStatusCode === 30) {
                  this.active = 4;
                  this.payStatus = '已完成';
                  this.payBtnText = '再次购买';
                } else {
                  //orderData.order.shippingStatus === 50 无需发货
                  this.active = 3;
                  this.payStatus = '已收货';
                }

              } else if(orderData.order.shippingStatus === 50) {
                if (this.orderStatusCode === 30) {
                  this.active = 4;
                  this.payStatus = '已完成';
                  this.payBtnText = '再次购买';
                } else {
                  //orderData.order.shippingStatus === 50 无需发货
                  // this.active = 4;
                  this.payStatus = '无需发货';
                }
              } else {
                this.active = 2;
                this.payStatus = '已付款';
                this.payBtnText = '重传汇款单';
              }
            } else if (orderData.order.paymentStatus === 30) {
              this.active = 2;
              this.payStatus = '支付失败';
              this.payBtnText = '重传汇款单';
            }else if (orderData.order.paymentStatus === 40) {
              this.active = 1;
              this.payStatus = '已退款';
              this.payBtnText = '再次购买';
            }

            this.orderNo = orderData.order.orderNumber;
            this.orderTime = Verify.convertDate(orderData.order.createdAt);
            //收货人
            if (Verify.validateIsNull(orderData.shipping)){
              //收货人信息
              this.receiver = orderData.shipping.receiver;
              this.phoneNumber = orderData.shipping.phoneNumber;
              this.shippingAddress = orderData.shipping.address;
            }
            //付款信息
            if (orderData.order.paymentMethod == 'wxpay') {
              this.payMethod = '微信支付';
            } else {
              this.payMethod = '线下汇款';
            }
            //商品总额
            this.totalMerchandise = Verify.toDecimal(orderData.order.total);
            //优惠
            this.discountedPrice = Verify.toDecimal(orderData.order.totalDiscount);
            //运费
            this.freight = Verify.toDecimal(orderData.order.total);
            //金币
            this.coinNumber = orderData.order.coin;
            //应付总额
            this.totalAmountPayable = Verify.toDecimal(orderData.order.paymentAmount);
            //账户支付
            this.accountPayment = Verify.toDecimal(orderData.order.accountAmount);
            //订单商品
            this.tableData = orderData.order.OrderItems;
            for (let i = 0; i < orderData.order.OrderItems.length; i++) {
              this.tableData[i]['goodPrice'] = Verify.toDecimal(orderData.order.OrderItems[i].price);
              this.tableData[i].orderId = orderData.order.id;
              if (Verify.validateIsNull(orderData.order.OrderItems[i].File)) {
                this.tableData[i]['goodsImg'] = 'http://' + orderData.order.OrderItems[i].File.url;
              }
            }
          } else {
            alert(res.data.msg);
          }
        })
      },
      againBuyEvent(productId){
        this.$router.push({path: '/MedicalProductDetail', query: {productId: productId}})
      },
      //取消订单
      cancelOrderEvent(id) {
        swal({
          title: "是否确定取消?",
          text: "",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            let url = '/api/personal/'+this.$route.query.orderNo +'/orders';
            this.$del(url, {}).then((res) => {
              // alert(JSON.stringify(res.data.message))
              if (res.data.code === 200) {
                this.getPersonOrderDetailData();
                swal("Deleted!", "这条数据已被删除", "success");
              } else {
                alert(res.data.msg);
              }
            })
          } else {
            swal("Cancelled", "这条数据还在哦", "error");
          }
        });
      },
      //申请售后
      applyAfterSales(productId,orderId){
        this.$router.push({ path: '/AfterSalesApplication',query:{productNo:productId,orderNo:orderId}});
      },
    }
  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";

  .header_bg {
    background-color: white;
    text-align: right;
    font-size: 18px;
    color: #333333;
  }
  .border_all{
    border: 1px solid lightgray;
  }
  .border_top_bottom{
    border: 1px solid lightgray;
    /*border-top: none; */
    border-left: none;
    border-right: none;
  }
  .border_top{
    border-top: 1px solid lightgray;
  }
  .border_right{
    border-right: 1px solid lightgray;
  }
  .border_left{
    border-left: 1px solid lightgray;
  }
  .red_color {
    color: red;
  }

  .table_header_bgColor {
    background-color: #eeeeee
  }

  .el-breadcrumb {
    font-size: 18px;
    line-height: 3.5;
    color: #333333;
  }
  /*付款状态*/
  .pay_status{
    color: #DF2321;
    font-size: 24px;
  }
  /*去支付按钮*/
  .pay_btn{
    background:#DF2321;
    border-radius:4px;
    color: white;
    font-size: 16px;
  }
  /*支付倒计时*/
  .countdown{
    color: #666666;
    font-size: 12px;
  }
  /*取消订单*/
  .cancel_order{
    color: #666666;
    font-size: 14px;
  }
  /*线下汇款提示语*/
  .timeout_prompt{
    color: #404040;
    font-size: 14px;
  }
  /*快递公司名*/
  /*.courier_company{*/
  /*color: #404040;*/
  /*font-size: 14px;*/
  /*}*/

  .info_content{
    color: #666666;
    font-size: 14px;
  }
  /*信息标题*/
  .info_title{
    color: #404040;
    font-size: 16px;
  }
  /*应付总额字体*/
  .pay_amount{
    color: #DF2321;
    font-size: 14px;
  }
  .pay_money{
    color: #DF2321;
    font-size: 24px;
  }
  .el-step__head.is-finish {
    color: #DF2321;
    border-color: #DF2321;
  }
  .el-step__title.is-finish {
    color: #DF2321;
  }
  .el-step__title {
    font-size: 14px;
    line-height: 38px;
  }
</style>
