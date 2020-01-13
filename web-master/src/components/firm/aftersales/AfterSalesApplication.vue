<template> 
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{asideNavTitle[0] === '' ||asideNavTitle[0] === undefined ?'售后服务':asideNavTitle[0]}}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{asideNavTitle[1] === '' ||asideNavTitle[1] === undefined ?'售后申请':asideNavTitle[1]}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="white_bg_color">
      <!--商品列表-->
      <div class="margin_top10 padding10">
        <el-row class="text-center list_header">
          <el-col :span="8">
            <p class="margin_top10">商品</p>
          </el-col>
          <el-col :span="4">
            <p class="margin_top10">单价</p>
          </el-col>
          <el-col :span="4">
            <p class="margin_top10">数量</p>
          </el-col>
        </el-row>
        <div class="border_all">
          <el-row class="text-center vertical-container">
            <el-col class="special_right_border">
              <el-col :span="8" class="margin_top5 margin_left5">
                <div style="float: left">
                  <img :src=goodsImg height="64" width="64"/>
                </div>
                <div>
                  <p class="order_title">{{goodName}}</p>
                </div>
              </el-col>
              <el-col :span="4" class="margin_top5">
                <p class="order_title">¥{{price}}</p>
              </el-col>
              <el-col :span="4" class="margin_top5">
                <p>x{{quantity}}</p>
              </el-col>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="border_all margin_top10 white_bg_color">
      <el-row class="form_title">
        <el-col :span="3">
          <p ><span class="red_color">*</span>服务类型：</p>
        </el-col>
        <el-col :span="21" class="margin_top10 text_align_left">
          <el-button size="small" @click="returnedPurchase()">退货</el-button>
          <el-button size="small">换货/返修</el-button>
        </el-col>
      </el-row>
    </div>
  </div>

</template>
<script>
  import {mapGetters} from 'vuex'
  import Verify from '../../../utils/utils'

  export default {
    data() {
      return {
        goodsImg: '',
        goodName: '',
        price: '',
        quantity: 1,
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      this.getAfterSalesList();
    },
    methods: {
      returnedPurchase() {
        this.$router.push({path: '/ReturnedPurchase', query: {itemId: this.$route.query.productNo,orderId:this.$route.query.orderNo}});
      },
      //售后列表
      getAfterSalesList() {
        let listUrl = "/api/service/item";
        this.$get(listUrl, {
          itemId: this.$route.query.productNo,
        }).then(res => {
          if (JSON.stringify(res.data.code) == 200) {
            this.goodName = res.data.data.name;
            this.price = Verify.toDecimal(res.data.data.salePrice);
            this.quantity = res.data.data.quantity;
            if (Verify.validateIsNull(res.data.data.File)) {
              this.goodsImg = 'http://'+res.data.data.File.url;
            }
            console.log("售后列表==" + JSON.stringify(res.data));
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
  .padding10{
    padding: 10px;
  }

  .red_color {
    color: red;
  }

  .border_all {
    border: 1px solid lightgrey;
  }

  .margin_top5 {
    margin-top: 5px;
  }

  .margin_top10 {
    margin-top: 10px;
  }

  .margin_top15 {
    margin-top: 15px;
  }

  .margin_left5 {
    margin-left: 5px;
  }

  .white_bg_color {
    background-color: white;
  }
  .list_header{
    background: #F6F6F6;
    font-size:14px;
  }
  .form_title{
    font-size: 14px;
    color: #404040;
  }
</style>


