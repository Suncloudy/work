<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{asideNavTitle[0] === '' ||asideNavTitle[0] === undefined ?'费用管理':asideNavTitle[0]}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{asideNavTitle[1] === '' ||asideNavTitle[1] === undefined ?'订单列表':asideNavTitle[1]}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="white_bg_color margin_top15">
      <p class="p_title text_align_left padding_left10 padding_top10">订单列表</p>
      <el-row>
        <el-col :span="6">
          <el-row>
            <el-col :span="7">
              <p class="order_font">状态</p>
            </el-col>
            <el-col :span="17">
              <el-select v-model="formInline.orderType" placeholder="所有类型">
                <el-option
                  v-for="item in orderTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="14">
          <el-row>
            <el-col :span="4"><p class="order_font">日期</p></el-col>
            <el-col :span="9">
              <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date1"
                              style="width: 100%;"  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
            </el-col>
            <el-col :span="2"><p class="order_font">至</p></el-col>
            <el-col :span="9">
              <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date2"
                              style="width: 100%;"  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-col>
      </el-row>
      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<p class="p_title text_align_left padding_left10">作废订单</p>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<p class="export_font">导出</p>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <div class="padding_left10 padding_right10 padding_top10">
        <el-row class="text-center order_price gray_bg">
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
        <div class="div_border margin_top5" v-for="(order,index) in tableData" :key="index">
          <el-row class="gray_bg pay_method">
            <el-col :span="7">
              <p class="margin_top5">订单号：<span class="order_price">{{order.orderNumber}}</span></p>
            </el-col>
            <el-col :span="5">
              <p class="margin_top5">{{order.orderDate}}</p>
            </el-col>
          </el-row>
          <el-row class="text-center vertical-container special_border" v-for="(product,index) in order.OrderItems" :key="index">
            <el-col :span="13">
              <el-col class="special_right_border" :key="index">
                <el-col :span="10" class="margin_top5 margin_left5">
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
                <el-col :span="6" class="margin_top5">
                  <p class="order_title">¥{{product.goodPrice}}</p>
                </el-col>
                <el-col :span="6" class="margin_top5">
                  <p>x{{product.quantity}}</p>
                </el-col>
              </el-col>
            </el-col>
            <el-col :span="3">
              <!--<div class="vertical-container">-->
              <p class="margin_top5 order_price vertical-container">¥{{product.priceTotal}}</p>
              <p class="pay_method vertical-container">{{order.payMethods === 1 ?'支付宝':(order.payMethods === 3
                ?'账户额度':(order.payMethods === 2?'微信':'在线支付'))}}</p>
              <!--</div>-->
            </el-col>
            <el-col :span="3">
              <!--10.待支付。20.已支付。30.交易完成。40.已退款。50.支付无效作废-->
              <p class="margin_top5 unPay_btn">{{order.paymentStatus=== 20 ? '已支付':(order.paymentStatus=== 10 ?
                '待支付':(order.paymentStatus=== 30 ? '交易完成':(order.paymentStatus=== 40 ? '已退款': '支付无效作废')))}}</p>
              <el-button type="text" @click="orderDetail(order.id)">查看详细</el-button>
<!--v-if="order.orderState !== 0"-->
            </el-col>
            <el-col :span="5">
              <!--订单状态为40时表示已取消，此时不再显示"取消"操作-->
              <!--先判断支付方式（1.微信支付 2.线下汇款）再判断付款状态--付款成功--判断物流状态（已收货40或无需发货50的状态）--再判断订单状态-->
              <div v-if="order.paymentMethod=== 'wxpay'">
                <div v-if="order.paymentStatus === 10">
                  <el-button type="btn" size="small" class="pay_btn">去支付</el-button>
                  <el-button type="text" v-if="order.orderStatus !== 40" @click="cancelOrderEvent(order.id)">取消</el-button>
                </div>
                <div v-else-if="order.paymentStatus === 20">
                  <!--已支付-->
                  <div v-if="order.shippingStatus === 40 || order.shippingStatus === 50">
                    <el-button type="btn" size="small" v-if="order.orderStatus === 30" @click="againBuyEvent(product.productId)">再次购买</el-button>
                    <el-button type="text" size="small" v-if="order.orderStatus === 30" @click="applyAfterSales(product.id,order.id)">申请售后</el-button>
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
                      width="220"
                      trigger="hover">
                      <p class="remittance_prompt">户名：<span class="info_content">{{beneficiary}}</span></p>
                      <p class="remittance_prompt">账号：<span class="info_content">{{payeeAccount}}</span></p>
                      <p class="remittance_prompt">开户行：<span class="info_content">{{payeeAccountBank}}</span></p>
                      <p class="remittance_prompt">订单号：<span class="info_content">{{order.orderNumber}}</span></p>
                      <el-button slot="reference" type="text" class="cancel_order">付款信息</el-button>
                    </el-popover>
                  </div>
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
                      <el-button type="text" size="small" v-if="order.orderStatus === 30" @click="applyAfterSales(product.id,order.id)">申请售后</el-button>
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
</template>

<script>
  import {mapGetters} from 'vuex'
  import Verify from '../../../utils/utils';
  import swal from 'sweetalert2'; //alert框

  export default {
    name: "OrderManage",
    data() {
      return {
        tableData: [],
        currentPage: 1,
        total: 1,
        formInline: {
          orderType: 'ALL',
          date1: '',
          date2: ''
        },
        orderTypes: [{
          value: 'ALL',
          label: '所有状态'
        }, {
          value: 'COMPLETE',
          label: '已支付'
        }, {
          value: 'UNPAID',
          label: '未支付'
        }, {
          value: 'CANCELLED',
          label: '作废'
        }],
        multipleSelection: [],
        beneficiary:'', //收款公司名
        payeeAccount:'',
        payeeAccountBank:'',
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      this.getOrderList();
    },
    methods: {
      onSubmit() {
        console.log('submit!');
        this.getOrderList();
      },
      //订单列表
      getOrderList() {
        let _self = this;
        let enterpriseId = localStorage.getItem("enterpriseId");
        // let getStaffUrl = '/api/enterprise/employees/' + enterpriseId + '/physicalExamiantionPlan';
        let url = '/api/enterprise/orders/' + enterpriseId;
        let data = {
          status:this.formInline.orderType,
        };
        if (Verify.validateIsNull(this.formInline.date1)){
          data['startDate'] = this.formInline.date1;
        }
        if (Verify.validateIsNull(this.formInline.date2)){
          data['endDate'] = this.formInline.date2;
        }
        _self.$get(url, data).then(res => {
          if (res.data.code === 200) {
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
              let orderItems = _self.tableData[i].OrderItems;
              for (let j = 0; j < orderItems.length; j++) {
                this.tableData[i]['goodId'] = orderItems[j].productId;
                orderItems[j]['goodPrice'] = Verify.toDecimal(orderItems[j].price);
                orderItems[j]['priceTotal'] = Verify.toDecimal(orderItems[j].total);
                if (Verify.validateIsNull(orderItems[j].File)) {
                  orderItems[j]['goodsImg'] = 'https://' + orderItems[j].File.url;
                }
              }
            }
            // console.log("order=="+JSON.stringify(res.data.data.items))
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
        this.getOrderList();
      },
      cancelOrderEvent(id){
        swal({
          title: "是否确定取消订单?",
          text: "",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            let url = '/api/enterprise/orders/'+id;
            this.$del(url, {}).then((res) => {
              // alert(JSON.stringify(res.data.message))
              if (res.data.code === 200) {
                this.getOrderList();
                swal("Deleted!", "已取消订单", "success");
              } else {
                alert(res.data.msg);
              }
            })
          } else {
            swal("Cancelled", "这条数据还在哦", "error");
          }
        });
      },
      orderDetail(orderId){
        this.$router.push({ path: '/FirmOrderDetail',query:{orderNo:orderId}});
      },
      //再次购买
      againBuyEvent(productId){
        this.$router.push({path: '/MedicalProductDetail', query: {productId: productId}})
      },
      //申请售后
      applyAfterSales(productId,orderId){
        this.$router.push({ path: '/AfterSalesApplication',query:{productNo:productId,orderNo:orderId}});
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
  .table_header_bgColor{
    background-color: #eeeeee
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
    border-top: 1px solid #eeeeee;
    /*border-right: 1px solid #eeeeee;*/
  }
  .special_right_border {
    border-right: 1px solid #eeeeee;
  }
  .order_font {
    margin-top: 10px;
    margin-bottom: 10px;
    color: #666666;
    font-size: 14px;
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
  .el-button--text {
    color: #404040;
  }

</style>
