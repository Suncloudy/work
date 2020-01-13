<template>
  <div>
    <el-container>
      <el-header class="header_bg">
        <el-breadcrumb separator-class="el-icon-arrow-right">

          <el-breadcrumb-item :to="{ path: '/' }" v-if="selectTitle[0] != null">{{selectTitle[0]}}</el-breadcrumb-item>
          <el-breadcrumb-item v-else>账号管理</el-breadcrumb-item>
          <el-breadcrumb-item v-if="selectTitle[1] != null">{{selectTitle[1]}}</el-breadcrumb-item>
          <el-breadcrumb-item v-else>安全设置</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>

      <el-main>
        <div class="safe_setting_tab">
          <el-tabs type="border-card">
            <el-tab-pane>
              <span slot="label" class="pane_font">修改登录密码</span>
              <!--我的行程-->
              <modify-login-pwd></modify-login-pwd>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" class="pane_font">修改绑定手机</span>
              <!--<div>-->
              <!--<p class="float-left">当前绑定手机号：<span v-model="telNumber">{{telNumber}}</span></p>-->
              <!--</div>-->
              <modify-bind-tel></modify-bind-tel>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
    <!--<home-footer></home-footer>-->
  </div>

</template>

<script>

  import ModifyLoginPwd from '../components/personal/accountmanage/ModifyLoginPwd'
  import ModifyBindTel from '../components/personal/accountmanage/ModifyBindTel'

  export default {
    name: "SafeSetting",
    props: ['selectTitle'],
    components:{
      'modify-login-pwd':ModifyLoginPwd,
      'modify-bind-tel':ModifyBindTel,
    },
    data() {
      return {}
    },
    methods: {
    }
  }
</script>

<style>
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

  .pane_font{
    font-size: 16px;
    color: #404040;
  }
  /*设置tab选中的样式*/
  .safe_setting_tab .el-tabs__item.is-active {
    border-bottom: 2px solid #009BDD !important;
  }


</style>
