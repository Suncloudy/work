<template>
  <!--<el-footer>-->
    <div class="footer">
      <div class="padding_left_right_percent19">
        <el-row :gutter="20">
          <!--<el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">-->
          <!--<div class="grid-content font_related">-->
          <!--&emsp;&emsp;-->
          <!--</div>-->
          <!--</el-col>-->
          <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <div class="grid-content font_related foot_font">
              <router-link to="/PrivacyPolicy">关于我们</router-link>
            </div>
          </el-col>
          <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <div class="grid-content font_related foot_font">
              <router-link to="/PrivacyPolicy">服务介绍</router-link>
            </div>
          </el-col>
          <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <div class="grid-content font_related foot_font">
              <router-link to="/PrivacyPolicy">企业合作</router-link>
            </div>
          </el-col>
          <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <div class="grid-content font_related foot_font">
              <router-link to="/ContactUs">联系我们</router-link>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="font_related">
              京ICP备 13028091号 | 京卫网审[2012]第0077号 Copyright ©
            </div>
          </el-col>
        </el-row>
      </div>

    </div>
  <!--</el-footer>-->
</template>

<script>
  export default {
    name: "Footer",
    data() {
      return {
      }
    }
  }
</script>

<style scoped>
  @import "../styles/personal/personal-center.scss";
  .footer {
    height: 154px;
    background: #F6F6F6;
    margin-top: -20px;
    color: #A9A9A9;
    font-size: 0.75rem;
    line-height: 154px;
    /*固定footer在底部*/
    bottom: 0px;
    position: absolute;
    width: 100%;
  }

  .grid-content {
    text-align: right;
  }

  .font_related {
    color: #A9A9A9;
    font-size: 13px;
  }

  .font_related a {
    text-decoration: none;
    color: #A9A9A9;
  }
  .foot_font :hover{
    color: #33B2E8;
  }

</style>
