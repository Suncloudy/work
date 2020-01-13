<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{helpCenterTitle.length!=0?helpCenterTitle[0]:""}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{helpCenterTitle.length!=0?helpCenterTitle[1]:""}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div>品牌介绍</div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "BrandIntroduce",
    props: ['selectTitle'],
    data() {
      return {}
    },
    computed: {
      ...mapGetters(['helpCenterTitle'])
    },
    created() {
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
  }
  .content{
    font-size:12px;
    font-weight:normal;
    color:#333333;
    line-height:24px;
  }
</style>
