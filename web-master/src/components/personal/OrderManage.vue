<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!--{{asideNavTitle.length!=0?asideNavTitle[0]:""}}-->
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="margin_top15">
      <el-tabs id="person_order_tab" v-model="activeName" @tab-click="handleClick" class="white_bg_color padding_left_right10">
        <el-tab-pane label="未付款" name="first" class="tab_title_font">
          <div>
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
              <el-row class="text-center vertical-container">
                <el-col :span="13">
                  <el-col v-for="(product,index) in order.OrderItems" class="special_border" :key="index">
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
                  <p class="pay_method vertical-container">{{order.payMethods === 1 ?'支付宝':(order.payMethods === 3
                    ?'账户额度':(order.payMethods === 2?'微信':'在线支付'))}}</p>
                  <!--</div>-->
                </el-col>
                <el-col :span="3" class="del_goods">
                  <!--10.待支付。20.已支付。30.交易完成。40.已退款。50.支付无效作废-->
                  <p class="margin_top5 unPay_btn">{{order.paymentStatus=== 20 ? '已支付':(order.paymentStatus=== 10 ?
                    '待支付':(order.paymentStatus=== 30 ? '交易完成':(order.paymentStatus=== 40 ? '已退款': '支付无效作废')))}}</p>
                  <!--<el-button type="text" v-if="order.orderState !== 0">查看详细</el-button>-->

                </el-col>
                <el-col :span="5" class="del_goods">
                  <el-button type="text" @click="cancelOrderEvent(order.id)">取消</el-button>
                  <el-button type="btn" size="small" class="pay_btn" v-if="order.paymentStatus=== 10">去支付</el-button>
                </el-col>
              </el-row>
            </div>
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
        </el-tab-pane>
        <el-tab-pane label="已完成" name="second" class="tab_title_font">
          <div class="margin_bottom15">
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
              <el-row class="text-center vertical-container">
                <el-col :span="13">
                  <el-col v-for="(product,index) in order.OrderProducts" class="special_border" :key="index">
                    <el-col :span="10" class="margin_top5 margin_left5">
                      <div style="float: left">
                        <img src="../../assets/customerImg/58tc@2x.png" height="64" width="64"/>
                      </div>
                      <div>
                        <p class="order_title">{{product.name}}</p>
                      </div>
                    </el-col>
                    <el-col :span="6" class="margin_top5">
                      <!--goodPrice-->
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
                  <p class="pay_method vertical-container">{{order.payMethods === 1 ?'支付宝':(order.payMethods === 3
                    ?'账户额度':(order.payMethods === 2?'微信':'在线支付'))}}</p>
                  <!--</div>-->
                </el-col>
                <el-col :span="3" class="del_goods">
                  <!--10.待支付。20.已支付。30.交易完成。40.已退款。50.支付无效作废-->
                  <p class="margin_top5 unPay_btn">{{order.paymentStatus=== 20 ? '已支付':(order.paymentStatus=== 10 ?
                    '待支付':(order.paymentStatus=== 30 ? '交易完成':(order.paymentStatus=== 40 ? '已退款': '支付无效作废')))}}</p>
                  <!--<el-button type="text" v-if="order.orderState !== 0">查看详细</el-button>-->

                </el-col>
                <el-col :span="5" class="del_goods">
                  <el-button type="text" @click="cancelOrderEvent(order.id)">取消</el-button>
                  <el-button type="btn" size="small" class="pay_btn" v-if="order.paymentStatus=== 10">去支付</el-button>
                </el-col>
              </el-row>
            </div>
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
        </el-tab-pane>
        <el-tab-pane label="全部" name="third">
          <div>
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
              <el-row class="text-center vertical-container" v-for="(product,index) in order.OrderItems" :key="index">
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
                  <p class="pay_method vertical-container">{{order.payMethods === 1 ?'支付宝':(order.payMethods === 3
                    ?'账户额度':(order.payMethods === 2?'微信':'在线支付'))}}</p>
                  <!--</div>-->
                </el-col>
                <el-col :span="3" class="del_goods">
                  <!--10.待支付。20.已支付。30.交易完成。40.已退款。50.支付无效作废-->
                  <p class="margin_top5 unPay_btn">{{order.paymentStatus=== 20 ? '已支付':(order.paymentStatus=== 10 ?
                    '待支付':(order.paymentStatus=== 30 ? '交易完成':(order.paymentStatus=== 40 ? '已退款': '支付无效作废')))}}</p>
                  <el-button type="text" @click="orderDetail(order.id)">查看详细</el-button>

                </el-col>
                <el-col :span="5" class="del_goods">
                  <!--订单状态为40时表示已取消，此时不再显示"取消"操作-->
                  <!--先判断支付方式（1.微信支付 2.线下汇款）再判断付款状态--付款成功--判断物流状态（已收货40或无需发货50的状态）--再判断订单状态-->
                  <div v-if="order.paymentMethod=== 'wxpay'">
                    <div v-if="order.paymentStatus === 10">
                      <el-button type="btn" size="small" class="pay_btn">去支付</el-button>
                      <el-button type="text" class="operate_font" v-if="order.orderStatus !== 40"
                                 @click="cancelOrderEvent(order.id)">取消
                      </el-button>
                    </div>
                    <div v-else-if="order.paymentStatus === 20">
                      <!--已支付-->
                      <div v-if="order.shippingStatus === 40 || order.shippingStatus === 50">
                        <el-button type="btn" size="small" v-if="order.orderStatus === 30" @click="againBuyEvent(product.productId)">再次购买</el-button>
                        <el-button type="text" class="operate_font" v-if="order.orderStatus === 30"
                                   @click="applyAfterSales(product.id,order.id)">申请售后
                        </el-button>
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
                      <div class="pay_method">
                        <el-popover
                          placement="top"
                          width="220" trigger="hover">
                          <p class="remittance_prompt">户名：<span class="info_content">{{beneficiary}}</span></p>
                          <p class="remittance_prompt">账号：<span class="info_content">{{payeeAccount}}</span></p>
                          <p class="remittance_prompt">开户行：<span class="info_content">{{payeeAccountBank}}</span></p>
                          <p class="remittance_prompt">订单号：<span class="info_content">{{order.orderNumber}}</span>
                          </p>
                          <el-button slot="reference" type="text" size="small" class="operate_font">付款信息</el-button>
                        </el-popover>
                      </div>
                      <el-button type="text" class="operate_font" v-if="order.orderStatus !== 40"
                                 @click="cancelOrderEvent(order.id)">取消
                      </el-button>
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
                          <el-button type="text" size="small" v-if="order.orderStatus === 30"
                                     @click="applyAfterSales(product.id,order.id)">申请售后
                          </el-button>
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
                      <el-button type="text" v-if="order.orderStatus === 10">汇款单</el-button>
                    </div>
                    <div v-else-if="order.paymentStatus === 40">
                      <el-button type="btn" size="small">已退款</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
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
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
  // import tableDate from '../../../mock/tableData2.js'
  import {mapGetters} from 'vuex'
  import swal from 'sweetalert2'; //alert框
  import Verify from '../../utils/utils';

  export default {
    name: 'OrderManage',
    // props: ['selectTitle'],
    data() {
      return {
        activeName: 'third',
        tableData: [],
        currentPage: 1,
        total: 0,
        beneficiary: '', //收款公司名
        payeeAccount: '',
        payeeAccountBank: '',
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      this.getOrderListData('ALL');
    },
    methods: {
      //获取订单列表
      getOrderListData(para) {
        let _self = this;
        let userId = localStorage.getItem("userId");
        let url = '/api/personal/' + userId + '/orders';
        _self.tableData = [];
        _self.$get(url, {
          status: para
        }).then(res => {
          if (res.data.code === 200) {
            _self.currentPage = 1;
            _self.total = 0;
            // console.log("订单列表"+'sta==' + JSON.stringify(res.data.data));
            _self.tableData = res.data.data.items;
            _self.total = res.data.data.total;
            _self.currentPage = res.data.data.page;
            //收款信息
            _self.beneficiary = res.data.data.receiverInfo.enterprise;
            _self.payeeAccountBank = res.data.data.receiverInfo.bank;
            _self.payeeAccount = res.data.data.receiverInfo.account;
            for (var i = 0; i < _self.tableData.length; i++) {
              let orderDate = Verify.convertDate(_self.tableData[i].createdAt);
              this.tableData[i]['orderDate'] = orderDate;
              // console.log('catch1:', JSON.stringify(_self.tableData[i].OrderItems))
              let orderItems = _self.tableData[i].OrderItems;
              for (let j = 0; j < orderItems.length; j++) {
                orderItems[j]['goodPrice'] = Verify.toDecimal(orderItems[j].price);
                this.tableData[i]['priceTotal'] = Verify.toDecimal(orderItems[j].total);
                if (Verify.validateIsNull(orderItems[j].File)) {
                  orderItems[j]['goodsImg'] = 'https://' + orderItems[j].File.url;
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
      clear() {

      },
      //再次购买
      againBuyEvent(productId){
        this.$router.push({path: '/MedicalProductDetail', query: {productId: productId}})
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        if (this.activeName === 'third') {
          this.getOrderListData('ALL');
        } else if (this.activeName === 'second') {
          this.getOrderListData('COMPLETE');
        } else {
          this.getOrderListData('UNPAID');
        }
      },
      handleClick(tab, event) {
        console.log(tab, event);
        // console.log(tab.name);
        if (this.activeName === 'third') {
          this.getOrderListData('ALL');
        } else if (this.activeName === 'second') {
          this.getOrderListData('COMPLETE');
        } else {
          this.getOrderListData('UNPAID');
        }
      },
      //申请售后
      applyAfterSales(productId, orderId) {
        this.$router.push({path: '/AfterSalesApplication', query: {productNo: productId, orderNo: orderId}});
      },
      //查看详细
      orderDetail(orderId) {
        this.$router.push({path: '/PersonalOrderDetail', query: {orderNo: orderId}});
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
            let url = '/api/personal/' + id + '/orders';
            this.$del(url, {}).then((res) => {
              // alert(JSON.stringify(res.data.message))
              if (res.data.code === 200) {
                if (this.activeName === 'third') {
                  this.getOrderListData('ALL');
                } else if (this.activeName === 'second') {
                  this.getOrderListData('COMPLETE');
                } else {
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

<style>
  @import "../../styles/personal/personal-center.scss";

  .header_bg {
    background-color: white;
    text-align: right;
    font-size: 18px;
    color: #333333;
  }
  .el-breadcrumb {
    line-height: 3.5;
    font-size: 18px;
  }

  .marginTop10 {
    margin-top: 0.6rem;
  }

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

  .padding_left_right10 {
    padding-left: 10px;
    padding-right: 10px;
  }

  .operate_font {
    color: #409EFF;
    font-size: 12px;
  }
  /*.el-tabs__item{*/
    /*width: 100px;*/
  /*}*/
  .el-button--text {
    color: #404040;
  }


</style>
