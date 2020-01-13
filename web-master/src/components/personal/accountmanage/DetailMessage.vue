<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{asideNavTitle.length!=0?asideNavTitle[0]:"消息提醒"}}</el-breadcrumb-item>
        <!--<el-breadcrumb-item>{{asideNavTitle.length != 0?asideNavTitle[1]:"收货地址"}}</el-breadcrumb-item>-->
        <!--<el-button @click="addShippingAddress()" class="addBtn">添加收货地址</el-button>-->
      </el-breadcrumb>
    </el-header>
    <div class="white_bg_color" style="height: 420px">
      <p class="message_title">{{messageTitle}}</p>
      <p>{{time}}</p>
      <hr align="center" style= "border:1px dashed #f3f3f3;" />
      <p>{{messageContent}}</p>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import swal from 'sweetalert2'; //alert框
  import Verify from "../../../utils/utils";

  export default {
    name: "DetailMessage",
    data() {
      return {
        messageTitle: '体检计划"1月员工关爱体检" 已生效，额度已划拨至员工帐户',
        messageContent:'体检计划"1月员工关爱体检" 已生效，额度已划拨至员工帐户',
        time:'2019-04-12'
      }
    },
    created() {
      this.getMessageInfo('unread');
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    methods: {
      //获取消息信息
      getMessageInfo(str) {
        let userId = localStorage.getItem("userId");
        let givenUrl = '/api/personal/' + userId + '/messages';
        this.$get(givenUrl, {
          status: str,
        }).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.items;
            for (var i = 0; i < this.tableData.length; i++) {
              let createdDate = Verify.convertDate(this.tableData[i].createdAt);
              this.tableData[i]['createdDate'] = createdDate;
            }
            console.log("消息==" + JSON.stringify(res.data.data))
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
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
  }

  .address_table {
    margin-top: 15px;
    width: 100%;
  }

  .el-form-item {
    /*margin-bottom: 22px;*/
    width: 80%;
  }

  .margin_top10 {
    margin-top: 10px;
    margin-left: 10px;
  }
  .message_title{
    font-size: 20px;
    color: #333333;
    padding-top: 10px;
  }

  .text-right {
    text-align: right !important;
  }
</style>
