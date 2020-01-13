<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>售后服务详细</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="margin_top10 white_bg_color">
      <div class="margin_top15 margin_left10">
        <el-row>
          <el-col :span="12">
            <div class="text_align_left ">
              <el-row class="service_num">
                <el-col :span="6">
                  <img
                    style="width: 100px; height: 100px"
                    :src="goodUrl">
                </el-col>
                <el-col :span="18">
                  <p>{{serveNumber}}</p>
                  <p>{{goodsName}}</p>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12" class="border_left padding_left10">
            <div class="text_align_left">
              <p class="audit_status">{{auditStatus}}</p>
              <p class="audit_prompt">{{auditPrompt}}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="white_bg_color">　
      <div class="margin_top15 ">
        <el-steps :active=active align-center class="padding_top15">
          <el-step title="提交申请" description=""></el-step>
          <el-step title="客服审核" description=""></el-step>
          <el-step title="商品回寄" description=""></el-step>
          <el-step title="售后处理" description=""></el-step>
          <el-step title="完成" description=""></el-step>
        </el-steps>
      </div>
      <div class="padding10">
        <div class="border_all serve_content">
          <div class="text_align_left padding10 serve_info table_header_bgColor">服务单信息</div>
          <el-row class="line_height38">
            <el-col :span="3">
              <span>服务类型</span>
            </el-col>
            <el-col :span="21" class="text_align_left">
              {{serveType}}
            </el-col>
          </el-row>
          <el-row class="line_height38">
            <el-col :span="3">
              申请原因
            </el-col>
            <el-col :span="21" class="text_align_left">
              {{applyReason}}
            </el-col>
          </el-row>
          <el-row class="line_height38">
            <el-col :span="3">
              问题描述
            </el-col>
            <el-col :span="21" class="text_align_left">
              {{problemDescription}}
            </el-col>
          </el-row>
          <el-row class="line_height38 ">
            <el-col :span="3" >
              寄回地址
            </el-col>
            <el-col :span="21" class="text_align_left">
              {{returnAddress}}
            </el-col>
          </el-row>
          <el-row class="line_height38 ">
            <el-col :span="3" >
              收货地址
            </el-col>
            <el-col :span="21" class="text_align_left">
              {{receiverAddress}}
            </el-col>
          </el-row>
          <el-row class="line_height38">
            <el-col :span="3">
              联系人
            </el-col>
            <el-col :span="21" class="text_align_left">
              {{contact}}
            </el-col>
          </el-row>
          <el-row class="line_height38 ">
            <el-col :span="3" >
              商品价格
            </el-col>
            <el-col :span="21" class="text_align_left">
              {{goodsPrice}}
            </el-col>
          </el-row>
          <el-row class="line_height38">
            <el-col :span="3">
              申请件数
            </el-col>
            <el-col :span="21" class="text_align_left">
              {{applyNumber}}
            </el-col>
          </el-row>
          <el-row class="line_height38">
            <el-col :span="3">
              退款总额
            </el-col>
            <el-col :span="21" class="text_align_left">
              {{refundAmount}}
            </el-col>
          </el-row>
          <el-row class="line_height38">
            <el-col :span="3">
              货物状态
            </el-col>
            <el-col :span="21" class="text_align_left">
              {{logisticsStatus}}
            </el-col>
          </el-row>
        </div>
      </div>

    </div>
    <div class="white_bg_color padding10">
      <div class="border_all margin_top15">
        <div class="text_align_left padding10 serve_info table_header_bgColor">处理历史</div>
        <!--<hr class="hr_dot">-->
        <div v-for="dealing in dealingArr">
          <el-row  class="audit_prompt text_align_left padding_left10">
            <el-col :span="5">
              <p>处理人：{{dealing.people}}</p>
            </el-col>
            <el-col :span="19">
              <p>{{dealing.time}}</p>
            </el-col>
          </el-row>
          <p class="serve_info text_align_left padding_left10">
            {{dealing.desc}}
          </p>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import Verify from '../../../utils/utils'
  export default {
    name: "AfterSalesDetail",
    data() {
      return {
        serveNumber: '',//服务单号
        goodUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        goodsName: '',//售后订单名称
        auditStatus: '',
        auditPrompt: '您的售后服务单已提交成功，请耐心等待客服审核',
        active: 1,
        serveType: '申请处理方式“退货”，最终处理方式“退货”',
        applyReason: '商品质量问题',
        problemDescription: '用户输入的问题描述',
        returnAddress: 'XXXX',
        receiverAddress: 'XXXXx',
        contact: ' 张三15734567899',
        goodsPrice: '39*1',
        applyNumber: 2,
        refundAmount: '29.00',
        logisticsStatus: '未回寄',
        dealingArr:[],
        dealingPeople:'系统',
        dealingTime:'2019-05-20'
      }
    },
    created(){
      this.getSalesDetail();
      this.getHistoryList();
    },
    methods: {
      //售后详细
      getSalesDetail() {
        console.log(this.$route.query.returnedOrderNo);
        let listUrl = "/api/service";
        this.$get(listUrl, {
          id: this.$route.query.returnedOrderNo,
        }).then(res => {
          if (JSON.stringify(res.data.code) == 200) {
            this.serveNumber = res.data.data.number;
            this.goodsName = res.data.data.OrderItem.name;
            // this.price = Verify.toDecimal(res.data.data.salePrice);
            // this.quantity = res.data.data.quantity;
            if (Verify.validateIsNull(res.data.data.OrderItem.File)) {
              this.goodUrl = 'http://'+res.data.data.OrderItem.File.url;
            }
            //服务类型----待完善
            if (res.data.data.type === 'refund') {
              this.serveType = '退款';
            }else if (res.data.data.type === 'repair') {
              this.serveType = '换货';
            }
            //审核状态
            if (res.data.data.status === 'pending') {
              this.auditStatus = '待审核';
              this.auditPrompt = '您的售后服务单已提交成功，请耐心等待客服审核';
              this.active = 1;
            }else if (res.data.data.status === 'resolve'){
              this.auditStatus = '客服审核';
              this.auditPrompt = '您的售后服务单已审核通过，请将商品、增品及原包装回寄至指定地址';
              this.active = 2;
            }else if(res.data.data.status === 'rejected'){
              this.auditStatus = '审核拒绝';
              this.auditPrompt = '您的商品回寄商品已收到，正在进行相关售后处理';
              this.active = 2;
            }else if(res.data.data.status === 'mail'){
              this.auditStatus = '待邮寄';
              this.auditPrompt = '您的售后服务单已审核通过，请将商品、增品及原包装回寄至指定地址';
              this.active = 3;
            }else if(res.data.data.status === 'unreceived'){
              this.auditStatus = '待收货';
              this.auditPrompt = '您的商品正在物流配送中，我们将收到回寄商品后立即进行相关处理';
              this.active = 3;
            }else if(res.data.data.status === 'abnormal'){
              this.auditStatus = '货物异常';
              this.auditPrompt = '您的商品回寄商品已收到，正在进行相关售后处理';
              this.active = 4;
            }else if(res.data.data.status === 'serving'){
              this.auditStatus = '售后中';
              this.auditPrompt = '您的商品回寄商品已收到，正在进行相关售后处理';
              this.active = 4;
            }else if(res.data.data.status === 'serviced'){
              this.auditStatus = '售后完成中';
              this.auditPrompt = '本次售后服务已完成，期待再次为您服务';
              this.active = 5;
            }else if(res.data.data.status === 'final'){
              this.auditStatus = '已完成';
              this.auditPrompt = '本次售后服务已完成，期待再次为您服务';
              this.active = 5;
            }
            //申请原因
            this.applyReason = res.data.data.reason;
            this.applyNumber = res.data.data.quantity;
            this.problemDescription = res.data.data.description;
            //退款总额
            this.refundAmount = Verify.toDecimal(res.data.data.refundedAmount);
            this.goodsPrice = Verify.toDecimal(res.data.data.OrderItem.salePrice);
            this.returnAddress = res.data.data.returnShippingAddress;
            this.receiverAddress = res.data.data.OrderShipping.address;
            this.contact =  res.data.data.OrderShipping.receiver;
            if (res.data.data.shippingStatus === 10) {
              this.logisticsStatus = '未发货';
            }else if (res.data.data.shippingStatus === 20) {
              this.logisticsStatus = '部分发货';
            }else if (res.data.data.shippingStatus === 30) {
              this.logisticsStatus = '全部发货';
            }else if (res.data.data.shippingStatus === 40) {
              this.logisticsStatus = '已收货';
            }else if (res.data.data.shippingStatus === 50) {
              this.logisticsStatus = '无需发货';
            }
            console.log("售后详情==" + JSON.stringify(this.goodsName));
          } else {
            swal("提示", res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });

      },
      getHistoryList(){
        this.$get('/api/service/repairProcessingHistory', {
          id: this.$route.query.returnedOrderNo,
        }).then(res => {
          if (JSON.stringify(res.data.code) == 200) {
            for (let i=0;i<res.data.data.length;i++){
              if (res.data.data[i].operatorId == -1) {
                this.dealingPeople = '系统';
              }else{
                this.dealingPeople = '用户';
              }
              this.dealingTime = Verify.convertDate(res.data.data[i].createdAt);
              let data = {
                people:this.dealingPeople,
                time:this.dealingTime,
                desc:res.data.data[i].description
              }
              this.dealingArr.push(data);
            }

            // console.log("售后历史==" + JSON.stringify(res.data));
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
<style>
  @import "../../../styles/personal/personal-center.scss";

  .white_bg_color {
    background-color: white;
  }
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

  .border_all {
    border: 1px solid #cccccc;
  }

  .border_all {
    border: 1px solid lightgray;
  }

  .border_top_bottom {
    border: 1px solid lightgray;
    /*border-top: none; */
    border-left: none;
    border-right: none;
  }

  .border_top {
    border-top: 1px solid lightgray;
  }

  .border_right {
    border-right: 1px solid lightgray;
  }

  .border_left {
    border-left: 1px solid lightgray;
  }
  /*服务单号*/
  .service_num {
    color: #404040;
    font-size: 12px;
  }
  /*审核提示语*/
  .audit_prompt {
    color: #666666;
    font-size: 12px;
  }
  /*审核状态*/
  .audit_status {
    color: #FF7327;
    font-size: 24px;
  }
  /*table_title*/
  .serve_info {
    color: #404040;
    font-size: 14px;
  }
  .table_header_bgColor{
    background-color: #F6F6F6;
    /*height: 36px;*/
  }
  /*服务信息*/
  .serve_content {
    color: #666666;
    font-size: 14px;
  }
  .padding_top15{
    padding-top: 15px;
  }
  .padding10{
    padding: 10px;
  }
  .red_color {
    color: red;
  }
  .el-breadcrumb {
    font-size: 18px;
    line-height: 3.5;
    color: #333333;
  }

  .line_height38{
    line-height: 38px;
  }
  .hr_dot{
    border:1px dotted #e6e6e6;
    /*height: 1px;*/
  }


</style>


