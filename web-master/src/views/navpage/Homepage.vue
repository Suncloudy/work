<template>
  <div>
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-carousel height="285px">
          <el-carousel-item v-for="(img,index) in imgList" :key="index">
            <div class="width_height_100">
              <img v-bind:src="img.url" class="width_height_100">
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <!--推荐套餐-->
    <health-checkup></health-checkup>
    <cooper-institution></cooper-institution>
    <serve-client></serve-client>
  </div>

</template>

<script>
  import HealthCheckup from "../../components/HealthCheckup"
  import CooperativeInstitution from "../../components/CooperativeInstitution"
  import ServeClient from "../../components/ServeClients"
    export default {
      name:'homePage',
      components:{
        'health-checkup':HealthCheckup,
        'cooper-institution':CooperativeInstitution,
        ServeClient
        },
        data() {
            return {
              imgList:[
                {url:require('../../assets/banner_index@2x.png')},
                {url:require('../../assets/banner_index@2x.png')}
              ]
            }
        },
      created(){
      },
      methods:{

      }
    }
</script>

<style>
  @import "../../styles/personal/personal-center.scss";
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  /*.img{*/
    /*height: 100%;*/
    /*width: 100%;*/
  /*}*/
</style>
