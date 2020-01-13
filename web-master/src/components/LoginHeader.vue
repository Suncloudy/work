<template>
  <header>
    <el-header class="padding_left_right_percent19">
      <div class="logo_img_div">
        <img src="../assets/logo_login@2x.png" class="logo_img" @click="returnLoginPage()"/>
      </div>
    </el-header>
  </header>

</template>

<script>
  export default {
    name: 'Header',
    data() {
      return {
      };
    },
    methods:{
      returnLoginPage(){
        this.$router.push({ path: '/Login'});
      },
    }
  }
</script>

<style>
  @import "../styles/personal/personal-center.scss";
  header{
    background-color: white;
  }
  .logo_img_div {
    /*margin-left: 6.75rem;*/
    text-align: left;
  }

  .logo_img {
    text-align: left;
    height: 60px;
    margin-top: 0.75rem;
  }
</style>
