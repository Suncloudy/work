<template>
  <div class="coop_institution padding_left_right_percent19">
    <p class="coop_title text_align_center">合作机构</p>
    <el-row :gutter="15">
      <div v-for="(p, index) in imgUrlArr" :key="index" class="cursor_pointer">
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"
                :class="{'marginTop30':index>4}">
          <div class="outside_div">
            <div class="coop_img">
              <img :src=p.url class="width_height_100"/>
            </div>
          </div>

        </el-col>
        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" v-if="index !==4">
          <div>
            &emsp;
          </div>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "CooperativeInstitution",
    data() {
      return {
        imgUrlArr: [{'url': require('@/assets/coopImage/p1@2x.png')}, {'url': require('@/assets/coopImage/p2@2x.png')}, {'url': require('@/assets/coopImage/p3@2x.png')}, {'url': require('@/assets/coopImage/p4@2x.png')}, {'url':require('@/assets/coopImage/huajian@2x.png')}, {'url':require('@/assets/coopImage/hexie@2x.png')}, {'url': require('@/assets/coopImage/kanghua@2x.png')}, {'url': require('@/assets/coopImage/puhui@2x.png')}]
      }

    }
  }
</script>

<style scoped>
  @import "../styles/personal/personal-center.scss";

  .coop_title {
    /*padding-top: 15px;*/
    font-size: 22px;
    color: #333333;
  }

  .marginTop30 {
    margin-top: 30px;
  }

  .coop_institution {
    /*height: 221px;*/
    text-align: center;
    /*background: #F6F6F6;*/
    /*width: 100%;*/
  }
  .outside_div{
    width: 136px;
    height: 63px;
    background: #FFF;
  }
  .coop_img {
    width: 104px;
    height: 36px;
    padding: 15px;
    /*margin: 0 auto;*/
  }
</style>
