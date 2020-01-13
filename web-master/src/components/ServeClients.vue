<template>
  <div class="serve_client padding_left_right_percent19">
    <p class="padding_top15">服务客户</p>
    <el-row :gutter="15" class="cursor_pointer">
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <div class="outside_div">
          <div class="serve_client_img">
            <img src="../assets/customerImg/58tc@2x.png" class="width_height_100"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
        <div>
          &emsp;
        </div>
      </el-col>
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <div class="outside_div">
          <div class="serve_client_img">
            <!--49-->
            <img src="../assets/customerImg/ali@2x.png" class="width_height_100"/>
          </div>
        </div>

      </el-col>
      <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
        <div>
          &emsp;
        </div>
      </el-col>
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <div class="outside_div">
          <div class="serve_client_img">
            <!--52-->
            <img src="../assets/customerImg/dzdpa_logo_img@2x.png" class="width_height_100"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
        <div>
          &emsp;
        </div>
      </el-col>
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <div class="outside_div">
          <div class="serve_client_img">
            <!--50-->
            <img src="../assets/customerImg/jsyh@2x.png" class="width_height_100"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
        <div>
          &emsp;
        </div>
      </el-col>
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <div class="outside_div">
          <div class="serve_client_img">
            <!--52-->
            <img src="../assets/customerImg/xyyh@2x.png" class="width_height_100"/>
          </div>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "ServeClient"
  }
</script>

<style scoped>
  @import "../styles/personal/personal-center.scss";
  .serve_client {
    height: 170px;
    text-align: center;
    /*width: 100%;*/
    font-size: 22px;
    color: #333333;
    background-color: white;
  }
  .outside_div{
    width: 134px;
    height: 64px;
    background: #FFF;
  }
  .serve_client_img {
    width: 104px;
    height: 34px;
    padding: 15px;
    /*margin: 0 auto;*/
  }
</style>
