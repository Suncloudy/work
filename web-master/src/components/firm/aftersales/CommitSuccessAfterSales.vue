<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>申请售后</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="gray_bg_color">
      <p class="prompt_font padding_top10">
        <img class="img_vertical" src="../../../assets/order/dzfdd_fy_zhzl@2x.png" height="38"
                                                width="38"/>
        售后申请提交成功，请耐心等待系统审核</p>
      <el-button size="small" class="margin_bottom15" @click="salesDetailEvent()">查看详细</el-button>
    </div>
  </div>

</template>

<script>
  export default {
    name: "AfterSalesCommitSuccess",
    data() {
      return {

      }
    },
    methods: {
      //售后详细
      salesDetailEvent() {
        this.$router.push({path: '/AfterSalesDetail', query: {returnedOrderNo: this.$route.query.salesTableId}});
      },
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
  .prompt_font{
    font-size: 14px;
    color: #404040;
  }
  .gray_bg_color {
    background-color: lightgray;
  }
  .img_vertical{
    vertical-align: middle;
  }

  .gray_bg {
    background-color: #eeeeee;
  }
</style>


