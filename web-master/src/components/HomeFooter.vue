<template>
  <el-footer>
    <div class="footer">
      <div class="padding_left_right_percent19">
        <el-row :gutter="10" class="cursor_pointer">
          <el-col :xs="5" :sm="4" :md="3" :lg="4" :xl="3">
            <div class="grid-content">
              <ul class="small_title">
                <router-link to="/PrivacyPolicy" tag="li" class="title_font">关于我们</router-link>
                <router-link to="/BrandIntroduce" tag="li">品牌介绍</router-link>
                <router-link to="/PrivacyPolicy" tag="li">隐私政策</router-link>
                <router-link to="/ContactUs" tag="li">联系我们</router-link>
              </ul>

            </div>
          </el-col>
          <el-col :xs="5" :sm="4" :md="3" :lg="4" :xl="3">
            <div class="grid-content font_related">
              <!--<a href="#">服务介绍</a>-->
              <ul class="small_title">
                <router-link to="/PrivacyPolicy" tag="li" class="title_font">服务介绍</router-link>
                <router-link to="/PrivacyPolicy" tag="li">购物流程</router-link>
                <router-link to="/PrivacyPolicy" tag="li">预约流程</router-link>
              </ul>
            </div>
          </el-col>
          <el-col :xs="5" :sm="4" :md="3" :lg="4" :xl="3">
            <div class="grid-content font_related">
              <ul class="small_title">
                <router-link to="/PrivacyPolicy" tag="li" class="title_font">企业合作</router-link>
                <router-link to="/PrivacyPolicy" tag="li">企业服务</router-link>
                <router-link to="/PrivacyPolicy" tag="li">企业入驻</router-link>
                <router-link to="/PrivacyPolicy" tag="li">机构合作</router-link>
                <router-link to="/PrivacyPolicy" tag="li">机构加盟</router-link>
              </ul>
            </div>
          </el-col>
          <el-col :xs="5" :sm="4" :md="3" :lg="4" :xl="3">
            <div class="grid-content font_related">
              <ul class="small_title">
                <router-link to="/PrivacyPolicy" tag="li" class="title_font">售后服务</router-link>
                <router-link to="/PrivacyPolicy" tag="li">常见问题</router-link>
                <router-link to="/PrivacyPolicy" tag="li">服务指南</router-link>
              </ul>

            </div>
          </el-col>
          <el-col :xs="4" :sm="5" :md="9" :lg="8" :xl="9">
            <div class="public_img">
              <ul>
                <li>
                  <img src="../assets/erweima@2x.png" style="height: 120px;width: 120px"/>
                </li>
                <li class="public_font">
                  微信公众号
                </li>
              </ul>

              <!--<span>微信公众号</span>-->
            </div>
          </el-col>
        </el-row>
        <el-row>
          <div class="firm_info">
            Copyright ©2019 健康关爱管理顾问（北京）有限公司 版权所有 京ICP备-11111111号 京公网安备31010602002387号
          </div>
        </el-row>
      </div>
    </div>
  </el-footer>
</template>

<script>
    export default {
        name: "HomeFooter"
    }
</script>

<style scoped>
  @import "../styles/personal/personal-center.scss";
  .footer {
    width: 100%;
    height: 318px;
    background: #F6F6F6;
    /*margin-top: 20px;*/
    /*margin-left: -20px;*/
    /*margin-right: -20px;*/
  }
  .el-footer {
    padding: 0px;
  }

  .grid-content {
    text-align: left;
    padding-left: 15px;
  }

  li{
    list-style:none;
  }
  .title_font{
    color: #333333;
    font-size: 16px;
    margin-top: 27px;
  }
  .small_title{
    color: #666666;
    font-size: 14px;
    /*text-align: center;*/
    line-height: 2.2;
    padding-left: 0px;
  }
  .firm_info{
    color: #666666;
    font-size: 12px;
    text-align: center;
    margin-top: 5%;
  }
  /*公众号图片*/
  .public_img{
    margin-top: 35px;
    /*text-align: right;*/
  }
  .public_font{
    /*text-align: center;*/
    font-size: 12px;
    color: #333333;
  }
  .cursor_pointer{
    cursor:pointer;
  }
  ul li:hover{
    color: #33B2E8;
  }

</style>
