<template>
  <div>
    <div class="bg_color_gray">
      <el-row :gutter="20" style="margin-left: 0px;margin-right: 0px">
        <el-col :span="15" class="white_bg_color height148">
          <el-row class="text_align_left">
            <el-col :span="5" class="user_img">
              <img src="../../assets/personal/touxiang_bg@2x.png" height="90" width="90"/>
            </el-col>
            <el-col :span="18">
              <p class="menu_font">{{userName}}&emsp;&emsp;&emsp;<span class="setting_nickname cursor_pointer"  @click="modifyPersonData()"> 设置昵称</span> </p>
              <p class="personal_info">欢迎您加入爱惠康～</p>
              <p class="yuan margin_bottom5" v-model="tel">{{tel}}&emsp;&emsp;&emsp;<span class="change_tel cursor_pointer" @click="modifyTel()">更换</span></p>
              <p class="change_personal_info cursor_pointer margin_top0 padding_right10" @click="modifyPersonData()">修改个人资料>></p>
            </el-col>
            <el-col :span="1" class="space_div">
            </el-col>
          </el-row>

        </el-col>
        <!--<div :span="1" class="space_div">-->

        <!--</div>-->
        <el-col :span="9" class="white_bg_color height148" >
          <el-row class="text_align_center">
            <el-col :span="8">
              <p><span class="remaining_sum">{{accountBalance}}</span><span class="yuan">元</span></p>
              <img class="coupon_img" src="../../assets/personal/zhanghuyue_icon@2x.png" height="28" width="28">
              <span class="personal_info">账户余额</span>
            </el-col>
            <el-col :span="8">
              <p><span class="coin_sum">{{coinNumber}}</span><span class="yuan">个</span></p>
              <img class="coupon_img" src="../../assets/medicalproduct/jinbi@2x.png" height="28" width="28"/>
              <!--<img class="coupon_img" src="../../assets/personal/zhanghuyue_icon@2x.png" height="28" width="28">-->
              <span class="personal_info">金币</span>
            </el-col>
            <el-col :span="8">
              <p><span class="coupon_sheet">{{coupons}}</span><span class="yuan">张</span></p>
              <img class="coupon_img" src="../../assets/personal/youhuiquan_icon@2x.png" height="28" width="28"/>
              <span class="personal_info">优惠券</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="margin_top10 white_bg_color">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                 active-text-color="#33B2E8">
          <el-menu-item index="1" class="menu_font">全部订单</el-menu-item>
          <el-menu-item index="2" class="menu_font">未付款</el-menu-item>
          <el-menu-item index="3" class="menu_font">已完成</el-menu-item>
        </el-menu>
        <div v-if="activeIndex === '1'">
          <el-row class="text-center order_price">
            <el-col :span="13">
              <el-row>
                <el-col :span="10">
                  <p>商品</p>
                </el-col>
                <el-col :span="6">
                  <p>单价</p>
                </el-col>
                <el-col :span="6">
                  <p>数量</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3">
              <p>订单总额</p>
            </el-col>
            <el-col :span="3">
              <p>状态</p>
            </el-col>
            <el-col :span="5">
              <p>操作</p>
            </el-col>
          </el-row>
          <div class="div_border" v-for="(order,index) in tableData" :key="index">
            <el-row class="gray_bg pay_method">
              <el-col :span="7">
                <p class="margin_top5">订单号：<span class="order_price">{{order.orderNumber}}</span></p>
              </el-col>
              <el-col :span="5">
                <p class="margin_top5">{{order.orderDate}}</p>
              </el-col>
            </el-row>
            <el-row class="text-center vertical-container"  v-for="(product,index) in order.OrderItems" :key="index">
              <el-col :span="13">
                <el-col class="special_border">
                  <el-col :span="10" class="margin_top5 margin_left5">
                    <div style="float: left">
                      <img :src=product.goodsImg height="64" width="64"/>
                    </div>
                    <div>
                      <p class="order_title">{{product.name}}</p>
                    </div>
                  </el-col>
                  <el-col :span="6" class="margin_top5">
                    <p class="order_title">¥{{product.goodPrice}}</p>
                  </el-col>
                  <el-col :span="6" class="margin_top5">
                    <p>x{{product.quantity}}</p>
                  </el-col>
                </el-col>
              </el-col>
              <el-col :span="3" class="">
                <!--<div class="vertical-container">-->
                <p class="margin_top5 order_price vertical-container">¥{{order.priceTotal}}</p>
                <p class="pay_method vertical-container">{{order.payMethods === 1 ?'支付宝':(order.payMethods === 3 ?'账户额度':(order.payMethods === 2?'微信':'在线支付'))}}</p>
                <!--</div>-->
              </el-col>
              <el-col :span="3" class="del_goods">
                <!--10.待支付。20.已支付。30.交易完成。40.已退款。50.支付无效作废-->
                <p class="margin_top5 unPay_btn">{{order.paymentStatus=== 20 ? '已支付':(order.paymentStatus=== 10 ? '待支付':(order.paymentStatus=== 30 ? '交易完成':(order.paymentStatus=== 40 ? '已退款': '支付无效作废')))}}</p>
                <el-button type="text" @click="orderDetail(order.id)">查看详细</el-button>

              </el-col>
              <el-col :span="5" class="del_goods">
                <!--订单状态为40时表示已取消，此时不再显示"取消"操作-->
                <!--先判断支付方式（1.微信支付 2.线下汇款）再判断付款状态--付款成功--判断物流状态（已收货40或无需发货50的状态）--再判断订单状态-->
                <div v-if="order.paymentMethod=== 'wxpay'">
                  <div v-if="order.paymentStatus === 10">
                    <el-button type="btn" size="small" class="pay_btn">去支付</el-button>
                    <el-button type="text" class="operate_font" v-if="order.orderStatus !== 40" @click="cancelOrderEvent(order.id)">取消</el-button>
                  </div>
                  <div v-else-if="order.paymentStatus === 20">
                    <!--已支付-->
                    <div v-if="order.shippingStatus === 40 || order.shippingStatus === 50">
                      <el-button type="btn" size="small" v-if="order.orderStatus === 30" @click="againBuyEvent(product.productId)">再次购买</el-button>
                      <el-button type="text" class="operate_font" v-if="order.orderStatus === 30" @click="applyAfterSales(product.id,order.id)">申请售后</el-button>
                    </div>
                    <div v-else-if="order.shippingStatus === 10">
                      <el-button type="btn" size="small">未发货</el-button>
                    </div>
                    <div v-else-if="order.shippingStatus === 20">
                      <el-button type="btn" size="small">部分发货</el-button>
                    </div>
                    <div v-else-if="order.shippingStatus === 30">
                      <el-button type="btn" size="small">全部发货</el-button>
                    </div>
                  </div>
                  <div v-else-if="order.paymentStatus === 30">
                    <el-button type="btn" size="small">支付失败</el-button>
                  </div>
                  <div v-else-if="order.paymentStatus === 40">
                    <el-button type="btn" size="small">已退款</el-button>
                  </div>
                </div>
                <!--线下汇款paymentMethod：transfer-->
                <div v-else>
                  <div v-if="order.paymentStatus === 10">
                    <el-button type="btn" size="small" class="pay_btn">上传汇款单</el-button>
                    <div class="pay_method">付款信息</div>
                    <el-button type="text" v-if="order.orderStatus !== 40" @click="cancelOrderEvent(order.id)">取消</el-button>
                  </div>
                  <div v-else-if="order.paymentStatus === 20">
                    <!--已支付-->
                    <div v-if="order.shippingStatus === 40 || order.shippingStatus === 50">
                      <!--orderStatus：10 待确认-->
                      <div v-if="order.orderStatus === 10">
                        <el-button type="btn" size="small">重传汇款单</el-button>
                        <div class="pay_method">汇款确认中</div>
                        <el-button type="text">汇款单</el-button>
                      </div>
                      <div v-if="order.orderStatus === 30">
                        <el-button type="btn" size="small" v-if="order.orderStatus === 30" @click="againBuyEvent(product.productId)">再次购买</el-button>
                        <el-button type="text" class="operate_font" v-if="order.orderStatus === 30" @click="applyAfterSales(product.id,order.id)">申请售后</el-button>
                      </div>
                    </div>

                    <div v-else-if="order.shippingStatus === 10">
                      <el-button type="btn" size="small">待发货</el-button>
                    </div>
                    <div v-else-if="order.shippingStatus === 20">
                      <el-button type="btn" size="small">部分发货</el-button>
                    </div>
                    <div v-else-if="order.shippingStatus === 30">
                      <el-button type="btn" size="small">全部发货</el-button>
                    </div>
                  </div>
                  <div v-else-if="order.paymentStatus === 30">
                    <!--支付失败-->
                    <el-button type="btn" size="small" v-if="order.orderStatus === 10">重传汇款单</el-button>
                    <div class="pay_method">汇款存在问题</div>
                    <el-button type="text" v-if="order.orderStatus === 10" >汇款单</el-button>
                  </div>
                  <div v-else-if="order.paymentStatus === 40">
                    <el-button type="btn" size="small">已退款</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="order_div" v-if="tableData.length === 0">

          <img src="../../assets/personal/wudingdan_icon@2x.png" height="88" width="" style="margin-top: 20px"/>
          <p class="prompt_placeholder">暂时没有相关订单</p>
        </div>
        <!--<compent :is="modelCode"></compent>-->
      </div>
      <div style="margin-top: 10px" v-if="discountType === 'coupon'">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                 active-text-color="#33B2E8">
          <el-menu-item index="1">优惠券</el-menu-item>
        </el-menu>
        <div class="coupon_div">
          <el-row :gutter="50">
            <el-col :span="2">
              &emsp;
            </el-col>
            <el-col :span="5">
              <img src="../../assets/personal/yhq_img1@2x.png" height="177" width=""/>
            </el-col>
            <el-col :span="5">
              <img src="../../assets/personal/yhq_img1@2x.png" height="177" width=""/>
            </el-col>
            <el-col :span="5">
              <img src="../../assets/personal/yhq_img1@2x.png" height="177" width=""/>
            </el-col>
            <el-col :span="5">
              <img src="../../assets/personal/yhq_img1@2x.png" height="177" width=""/>
            </el-col>
            <el-col :span="2">
              &emsp;
            </el-col>
          </el-row>
        </div>
        <!--<compent :is="modelCode"></compent>-->
      </div>
    </div>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex';
  import Verify from '../../utils/utils';
  export default {
    props: ['selectTitle'],
    data() {
      return {
        userName:'',
        tel: '',
        activeIndex: '1',
        accountBalance:0.00,
        coinNumber: 0,
        coupons:0,
        tableData:[],
        discountType:'',
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created(){
      this.getPersonInfo();
      this.getOrderListData('ALL');
      if (this.$route.query.orderFlag === 'personOrder') {
        this.$router.push({ path: '/PersonOrderManage'});
      }
    },
    //监听route，解决当默认是个人中心首页时，点击'我的订单'页面不跳转
    watch: {
      $route(to,from){
        if (to.query.orderFlag === 'personOrder') {
          this.$router.push({ path: '/PersonOrderManage'});
        }
        // console.log('to==',to);
        // console.log('from==',from);
        // console.log(to.path);
      }
    },
    methods: {
      //状态切换
      handleSelect(key, keyPath) {
        if (key === '1'){
          this.getOrderListData('ALL');
        } else if (key === '3'){
          this.getOrderListData('COMPLETE');
        } else{
          this.getOrderListData('UNPAID');
        }
      },
      //修改个人手机号
      modifyTel(){
        this.$router.push({ path: '/SafeSetting'});
      },
      //修改个人资料
      modifyPersonData(){
        this.$router.push({ path: '/PersonalData'});
      },
      getPersonInfo(){
        let userId = localStorage.getItem("userId");
        let userInfo = '/api/personal/'+ userId;
        this.$get(userInfo, {}).then(res => {
          debugger
          if (res.data.code === 200) {
            if (Verify.validateIsNull(res.data.data.name)){
              // this.userName = localStorage.getItem("nickname");
              this.userName  = res.data.data.name;
            }
            if (Verify.validateIsNull(res.data.data.Account.phoneNumber)){
              this.tel = res.data.data.Account.phoneNumber;
              // this.tel = localStorage.getItem("phoneNumber");
            }
            this.accountBalance = Verify.toDecimal(res.data.data.Account.balance);
            this.discountType = res.data.data.Account.discountType;
            this.coinNumber = res.data.data.Account.coin;
            // console.log("PersonalPage==" + JSON.stringify(res.data.data));
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //获取订单列表
      getOrderListData(para) {
        let _self = this;
        let userId = localStorage.getItem("userId");
        let url = '/api/personal/'+ userId +'/orders';
        _self.tableData = [];
        _self.$get(url, {
          status:para
        }).then(res => {
          if (res.data.code === 200) {
            _self.tableData = [];
            for (var i = 0; i < 3; i++) {
              if (Verify.validateIsNull(res.data.data.items[i])){
                _self.tableData.push(res.data.data.items[i]);
                let orderDate = Verify.convertDate(res.data.data.items[i].createdAt);
                this.tableData[i]['orderDate'] = orderDate;
                // console.log('catch1:', JSON.stringify(_self.tableData[i].OrderItems))
                let orderItems = res.data.data.items[i].OrderItems;
                for (let j = 0;j<orderItems.length;j++){
                  orderItems[j]['goodPrice'] = Verify.toDecimal(orderItems[j].price);
                  this.tableData[i]['priceTotal'] = Verify.toDecimal(orderItems[j].total);
                  if (Verify.validateIsNull(orderItems[j].File)) {
                    orderItems[j]['goodsImg'] = 'https://'+orderItems[j].File.url;
                  }
                }
              }

            }
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //再次购买
      againBuyEvent(productId){
        this.$router.push({path: '/MedicalProductDetail', query: {productId: productId}})
      },
      //申请售后
      applyAfterSales(productId,orderId){
        this.$router.push({ path: '/AfterSalesApplication',query:{productNo:productId,orderNo:orderId}});
      },
      //查看详细
      orderDetail(orderId){
        this.$router.push({ path: '/PersonalOrderDetail',query:{orderNo:orderId}});
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
            let url = '/api/personal/'+id +'/orders';
            this.$del(url, {}).then((res) => {
              // alert(JSON.stringify(res.data.message))
              if (res.data.code === 200) {
                if (this.activeName === 'third'){
                  this.getOrderListData('ALL');
                } else if (this.activeName === 'second'){
                  this.getOrderListData('COMPLETE');
                } else{
                  this.getOrderListData('UNPAID');
                }
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
    }
  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";

  .menu_font{
    font-size:16px;
    color: #404040;
  }
  .height148 {
    height: 148px;
  }
  .margin_left0 {
    margin-left: 0px;
  }

  /*个人信息*/
  .text_align_left {
    text-align: left;
  }

  .user_img {
    text-align: center;
    margin-top: 20px;
  }

  .personal_info {
    color: #404040;
    font-size: 14px;
  }

  .change_tel {
    color: #33B2E8;
    font-size: 14px;
  }

  .change_personal_info {
    float: right;
    color: #33B2E8;
    font-size: 14px;
  }

  /*账户余额*/
  .remaining_sum {
    color: #33B2E8;
    font-size: 28px;
  }

  .yuan {
    font-size: 14px;
    color: #666666;
  }

  .coupon_sheet {
    color: #FA6A5A;
    font-size: 28px;
  }

  .coupon_img {
    vertical-align: middle
  }
  .order_div{
    height: 300px;background-color: white;text-align: center;
  }
  .coupon_div{
    height: auto;
    background-color: white;
  }
  /*列表*/
  .gray_bg {
    background-color: #eeeeee;
  }

  .margin_top5 {
    margin-top: 0.65rem;
  }

  .margin_left5 {
    margin-left: 5px;
  }

  .div_border {
    border: 1px solid #eeeeee;
  }

  .special_border {
    /*border-top: 1px solid #eeeeee;*/
    border-right: 1px solid #eeeeee;
  }

  .special_top_border {
    border-top: 1px solid #eeeeee;
  }

  .order_title {
    color: #404040;
    font-size: 14px;
  }

  .unPay_btn {
    color: #5BC146;
    font-size: 14px;
  }

  .order_price {
    font-size: 14px;
    color: #404040;
  }

  .pay_method {
    color: #666666;
    font-size: 14px;
  }

  .pay_btn {
    /*width:42px;*/
    /*height:14px;*/
    font-size: 14px;
    font-weight: normal;
    color: rgba(255, 255, 255, 1);
    background-color: #DF2321;
  }

  .vertical-container {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }

  .redColor {
    color: red;
  }
  .padding_left_right10{
    padding-left: 10px;
    padding-right: 10px;
  }
  .operate_font {
    /*color: #409EFF;*/
    color: #404040;
    font-size: 12px;
  }
  .setting_nickname{
    padding-left: 10px;
    padding-right: 10px;
    font-size:14px;
    font-weight:normal;
    color:white;
    width:84px;
    height:22px;
    background:#33B2E8;
    border-radius:10px;
  }
  /*公共样式这里引用无效果*/
  .cursor_pointer{
    cursor: pointer;
  }
  .el-menu--horizontal>.el-menu-item{
    color: #404040;
  }

  .space_div{
    height: 148px;
    width: 10px;
    padding-left: 0px;
    padding-right: 0px;
    background-color: #F6f6f6;
  }
  /*金币的字体样式*/
  .coin_sum{
    font-size:28px;
    font-weight:400;
    color:#F39800;
  }
</style>



