<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{(asideNavTitle[0] === '' || asideNavTitle[0] === undefined )?
          '费用管理':asideNavTitle[0]}}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{(asideNavTitle[1] === '' || asideNavTitle[1] === undefined )?
          '账户总览':asideNavTitle[1]}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="firm_detail margin_top15">
      <el-row :gutter="10">
        <el-col :span="6">
          <p class="number_font"><span class="number_people">{{outstandingOrder}}</span>个</p>
          <img class="balance_img" src="../../../assets/firm/dzfdd_fy_zhzl@2x.png" height="28" width="28"/>
          <span class="account_balance">待支付订单</span>
        </el-col>

        <el-col :span="9" class="left_box">
          <p class="balance_font">¥{{balance}}</p>
          <el-row>
            <el-col :span="16">
              <img class="balance_img" src="../../../assets/firm/zhanghuyue_icon@2x.png" height="28" width="28"/>
              <span class="account_balance">账户余额</span>
            </el-col>
            <el-col :span="8">
              <p class="top_up">充值</p>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="8" class="left_box">
          <p class="invoice_font">¥{{invoicing}}</p>
          <el-row>
            <el-col :span="16">
              <img class="balance_img" src="../../../assets/firm/fapiao_icon_green@2x.png" height="28" width="28"/>
              <span class="invoice">可开具发票</span>
            </el-col>
            <el-col :span="8">
              <p class="request_invoice" @click="askForBill()">索要发票</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="white_bg_color margin_top15">
      <el-row>
        <el-col :span="12" class="text_align_left padding_left10">
          <p class="account_balance">最近订单</p>
        </el-col>
        <el-col :span="12" class="text_align_right padding_right10">
          <p class="more_font" @click="moreOrderList()">更多</p>
        </el-col>
      </el-row>
      <div class="padding_left10 padding_right10">
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange" :header-cell-style="tableHeaderColor"
          class="padding_left10 padding_right10">
          <el-table-column
            prop="orderNumber"
            label="订单号">
          </el-table-column>
          <el-table-column
            prop="orderName"
            label="产品"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="convertPaymentAmount"
            label="订单金额"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="paymentStatus"
            label="状态"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="special_color" v-if="scope.row.paymentStatus === 20">已支付</span>
              <span class="special_color" v-else-if="scope.row.paymentStatus === 10">待支付</span>
              <span class="special_color" v-else-if="scope.row.paymentStatus === 30">支付失败</span>
              <span class="special_color" v-else-if="scope.row.paymentStatus === 40">已退款</span>
              <span class="special_color" v-else>———</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderDate"
            label="创建时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="payTime"
            label="支付时间"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.payTime !== '' && scope.row.payTime !== null && scope.row.payTime !== undefined ">{{scope.row.payTime}}</span>
              <span v-else>———</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <!--先判断支付方式（1.微信支付 2.线下汇款）再判断付款状态--付款成功--判断物流状态（已收货40或无需发货50的状态）--再判断订单状态-->
              <div v-if="scope.row.paymentMethod === 'wxpay'">
                <div v-if="scope.row.paymentStatus === 10">
                  <el-button type="btn" size="small" class="pay_btn">去支付</el-button>
                  <el-button class="operate_font" type="text" v-if="scope.row.orderStatus !== 40"
                             @click="cancelOrderEvent(scope.row.id)">取消
                  </el-button>
                </div>
                <div v-else-if="scope.row.paymentStatus === 20">
                  <!--已支付-->
                  <div v-if="scope.row.shippingStatus === 40 || scope.row.shippingStatus === 50">
                    <div class="operate_button">
                      <el-button type="btn" size="small" v-if="scope.row.orderStatus === 30" @click="againBuyEvent(scope.row.goodId)">再次购买</el-button>
                      <el-button type="btn" size="small" v-if="scope.row.orderStatus === 30" @click="againBuyEvent(scope.row.goodId)">再次购买</el-button>
                    </div>
                   <div class="del_goods">
                     <el-button class="operate_font" type="text" v-if="scope.row.orderStatus === 30"
                                @click="applyAfterSales(scope.row.productId,scope.row.id)">申请售后
                     </el-button>
                   </div>

                  </div>
                  <div v-else-if="scope.row.shippingStatus === 10">
                    <el-button type="btn" size="small">未发货</el-button>
                  </div>
                  <div v-else-if="scope.row.shippingStatus === 20">
                    <el-button type="btn" size="small">部分发货</el-button>
                  </div>
                  <div v-else-if="scope.row.shippingStatus === 30">
                    <el-button type="btn" size="small">全部发货</el-button>
                  </div>
                </div>
                <div v-else-if="scope.row.paymentStatus === 30">
                  <el-button type="btn" size="small">支付失败</el-button>
                </div>
                <div v-else-if="scope.row.paymentStatus === 40">
                  <el-button type="btn" size="small">已退款</el-button>
                </div>
              </div>
              <!--线下汇款paymentMethod：transfer-->
              <div v-else>
                <div v-if="scope.row.paymentStatus === 10">
                  <el-button type="btn" size="small" class="pay_btn">上传汇款单</el-button>
                  <div class="more_font">
                    <el-popover
                      placement="top"
                      width="220" trigger="hover">
                      <p class="remittance_prompt">户名：<span class="info_content">{{beneficiary}}</span></p>
                      <p class="remittance_prompt">账号：<span class="info_content">{{payeeAccount}}</span></p>
                      <p class="remittance_prompt">开户行：<span class="info_content">{{payeeAccountBank}}</span></p>
                      <p class="remittance_prompt">订单号：<span class="info_content">{{scope.row.orderNumber}}</span></p>
                      <el-button slot="reference" type="text" size="small" class="operate_font">付款信息</el-button>
                    </el-popover>
                  </div>
                  <el-button class="operate_font" type="text" size="small" v-if="scope.row.orderStatus !== 40"
                             @click="cancelOrderEvent(scope.row.id)">取消
                  </el-button>
                </div>
                <div v-else-if="scope.row.paymentStatus === 20">
                  <!--已支付-->
                  <div v-if="scope.row.shippingStatus === 40 || scope.row.shippingStatus === 50">
                    <!--orderStatus：10 待确认-->
                    <div v-if="scope.row.orderStatus === 10">
                      <el-button type="btn" size="small">重传汇款单</el-button>
                      <div class="more_font">汇款确认中</div>
                      <el-button type="text">汇款单</el-button>
                    </div>
                    <div v-if="scope.row.orderStatus === 30">
                      <el-button type="btn" size="small" @click="againBuyEvent(scope.row.goodId)">再次购买</el-button>
                      <el-button type="text" class="operate_font" @click="applyAfterSales(scope.row.productId,scope.row.id)">
                        申请售后
                      </el-button>
                    </div>
                  </div>

                  <div v-else-if="scope.row.shippingStatus === 10">
                    <el-button type="btn" size="small">待发货</el-button>
                  </div>
                  <div v-else-if="scope.row.shippingStatus === 20">
                    <el-button type="btn" size="small">部分发货</el-button>
                  </div>
                  <div v-else-if="scope.row.shippingStatus === 30">
                    <el-button type="btn" size="small">全部发货</el-button>
                  </div>
                </div>
                <div v-else-if="scope.row.paymentStatus === 30">
                  <!--支付失败-->
                  <el-button type="btn" size="small" v-if="scope.row.orderStatus === 10">重传汇款单</el-button>
                  <div class="pay_method">汇款存在问题</div>
                  <el-button type="text" v-if="scope.row.orderStatus === 10">汇款单</el-button>
                </div>
                <div v-else-if="scope.row.paymentStatus === 40">
                  <el-button type="btn" size="small">已退款</el-button>
                </div>
              </div>
              <!--<el-button @click="handleClick(scope.row)" type="text" size="small">支付详细</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import VerifyUtils from '../../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  export default {
    name: "FirmPage",
    props: ['selectTitle'],
    data() {
      return {
        outstandingOrder: 0,
        balance: '0.00',
        invoicing: '0.00',
        staffNumber: '0',
        departNumber: '0',
        tableData: [],
        beneficiary: '', //收款公司名
        payeeAccount: '',
        payeeAccountBank: '',
      }
    },
    created() {
      this.getFirmAccountInfo();
      this.getOrderList();
      //待完善
      // this.getRecentOrderList();
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    methods: {
      //账户的订单、余额信息
      getFirmAccountInfo() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let firmAccountInfo = '/api/enterprise/account/' + enterpriseId;
        this.$get(firmAccountInfo, {
          enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            if (VerifyUtils.validateIsNull(res.data.data.orderBasic.waitPayNumber)) {
              this.outstandingOrder = res.data.data.orderBasic.waitPayNumber;
            }
            if (VerifyUtils.validateIsNull(res.data.data.invoiceBasic.money)) {
              this.invoicing = VerifyUtils.toDecimal(res.data.data.invoiceBasic.money);
            }
            if (VerifyUtils.validateIsNull(res.data.data.accountBasic.balance)) {
              this.balance = VerifyUtils.toDecimal(res.data.data.accountBasic.balance);
            }
            // console.log("test" + JSON.stringify(res.data));
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //最新订单
      getRecentOrderList() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let firmAccountInfo = '/api/enterprise/order/' + enterpriseId + '/lately';
        this.$get(firmAccountInfo, {
          enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            console.log("order==" + JSON.stringify(res.data));
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //订单列表
      getOrderList() {
        let _self = this;
        let enterpriseId = localStorage.getItem("enterpriseId");
        let url = '/api/enterprise/orders/' + enterpriseId;
        _self.$get(url, {}).then(res => {
          if (res.data.code === 200) {
            _self.tableData = [];
            //收款信息
            _self.beneficiary = res.data.data.receiverInfo.enterprise;
            _self.payeeAccountBank = res.data.data.receiverInfo.bank;
            _self.payeeAccount = res.data.data.receiverInfo.account;
            for (var i = 0; i < 5; i++) {
              _self.tableData.push(res.data.data.items[i]);
              let orderDate = VerifyUtils.convertDate(res.data.data.items[i].createdAt);
              if (VerifyUtils.validateIsNull(res.data.data.items[i].paidAt)) {
                let payTime = VerifyUtils.convertDate(res.data.data.items[i].paidAt);
                this.tableData[i]['payTime'] = payTime;
              }
              this.tableData[i]['orderDate'] = orderDate;
              this.tableData[i]['convertPaymentAmount'] = VerifyUtils.toDecimal(res.data.data.items[i].paymentAmount);
              let orderItems = res.data.data.items[i].OrderItems;
              for (let j = 0; j < orderItems.length; j++) {
                this.tableData[i]['orderName'] = orderItems[j].name;
                this.tableData[i]['productId'] = orderItems[j].id;
                this.tableData[i]['goodId'] = orderItems[j].productId;
                if (VerifyUtils.validateIsNull(orderItems[j].File)) {
                  orderItems[j]['goodsImg'] = 'https://' + orderItems[j].File.url;
                }
              }
            }
            // console.log("order==" + JSON.stringify(_self.tableData))
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      cancelOrderEvent(id) {
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
            let url = '/api/enterprise/orders/' + id;
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
      //更多的点击事件
      moreOrderList() {
        this.$router.push({path: '/FirmOrderManage'});
      },
      //订单详情
      orderDetail(orderId) {
        this.$router.push({path: '/FirmOrderDetail', query: {orderNo: orderId}});
      },
      // @click="againBuyEvent(product.productId)
      //再次购买
      againBuyEvent(productId){
        debugger
        this.$router.push({path: '/MedicalProductDetail', query: {productId: productId}})
      },
      //申请售后
      applyAfterSales(productId, orderId) {
        this.$router.push({path: '/AfterSalesApplication', query: {productNo: productId, orderNo: orderId}});
      },
      //索要发票
      askForBill() {
        this.$router.push({path: '/InvoiceManagement'});
      },
      handleSelectionChange(val) {

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

  .firm_detail {
    background-color: #FFFFFF;
    height: 124px;
  }

  /*分割线*/
  .left_box {
    margin-top: 5px;
    border-left: 1px solid #666666;
  }

  /*订单个数的数字样式*/
  .number_people {
    color: #009BDD;
    font-size: 30px;
  }
  .operate_font{
    color: #404040;
    /*color: #409EFF;*/
    font-size: 12px;
  }
  /*个数的'个'字样式*/
  .number_font {
    color: #666666;
    font-size: 14px;
  }

  /*'更多'的字体样式*/
  .more_font {
    color: #409EFF;
    font-size: 14px;
  }

  /* 账户余额的字体*/
  .balance_font {
    color: #FA6A5A;
    font-size: 30px;
    margin-top: 14px;
    margin-bottom: 14px;
  }

  .balance_img {
    vertical-align: middle;
  }

  /*'充值'的字体样式*/
  .top_up {
    color: #FA6A5A;
    font-size: 14px;
    margin-top: 2px;
  }

  .account_balance {
    color: #404040;
    font-size: 14px;
  }

  /*发票相关样式*/
  .invoice_font {
    color: #5BC146;
    font-size: 30px;
    margin-top: 14px;
    margin-bottom: 14px;
  }

  .request_invoice {
    color: #5BC146;
    font-size: 14px;
    margin-top: 2px;
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
    border: 0px solid #DF2321;
  }
  .operate_button .el-button:hover {
    color: #089EDE;
    border-width: 1px;
  }
  .operate_button .el-button:focus,.el-button:hover {
    color: #089EDE;
    border-color: #089EDE;
  //border-width: 1px;
  }
  .operate_button .el-button--primary:focus, .el-button--primary:hover {
    border-color: #089EDE;
    color: #089EDE;
  }
</style>
