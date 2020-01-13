<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{helpCenterTitle.length!=0?helpCenterTitle[0]:"关于我们"}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{helpCenterTitle.length!=0?helpCenterTitle[1]:"隐私政策"}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="white_bg_color height300">
      <p class="title text_align_left">隐私政策</p>
      <p class="content">{{policy}}</p>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "PrivacyPolicy",
    props: ['selectTitle'],
    data() {
      return {
        policy:'如果长时间收不到激活邮件，请检查一下你的垃圾邮件夹，或者重新尝试一下。如果连续尝试都无法收到激活邮件，如果长时间收不到激活邮件，请检查一下你的垃圾邮件夹，或者重新尝试一下。如果连续尝试都无法收到激活邮件，如果长时间收不到激活邮件，请检查一下你的垃圾邮件夹，或者重新尝试一下。如果连续尝试都无法收到激活邮件。',

      }
    },
    computed: {
      ...mapGetters(['helpCenterTitle'])
    },
    created() {
      // alert('selectTitle==='+this.selectTitle);
      console.log('help selectTitle', this.selectTitle)
    },
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
  .el-breadcrumb {
    line-height: 3.5;
    font-size: 18px;
  }
  .title{
    font-size:16px;
    font-weight:normal;
    color:#404040;
    padding-left: 10px;
    padding-top: 10px;
  }
  .content{
    font-size:12px;
    font-weight:normal;
    color:#333333;
    line-height:24px;
  }
  .height300{
    height: 300px;
  }
</style>
