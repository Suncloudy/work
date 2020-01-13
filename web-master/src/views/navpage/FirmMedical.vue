<template>
  <div class="padding">
    <div class="commit_apply">
      <div class="width350 white_bg_color">
        <el-row class="margin_top30">
          <el-col :span="3">
            <img src="../../assets/firmmedical/qymc_icon@2x.png" height="30" width="30"/>
          </el-col>
          <el-col :span="21" class="width280">
            <el-input v-model="firmName" placeholder="企业名称"></el-input>
          </el-col>
        </el-row>
        <el-row class="margin_top15">
          <el-col :span="3">
            <img src="../../assets/firmmedical/qyszd_icon@2x.png" height="30" width="30"/>
          </el-col>
          <el-col :span="21" class="width280">
            <el-row>
              <el-col :span="12">
                <el-select v-model="selectedProvince" placeholder="请选择省" @change="selectProvinceEvent(selectedProvince)">
                  <el-option
                    v-for="(value,key) in firmAddress['86']"
                    :key="key"
                    :label="value"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select v-model="selectedCity" placeholder="请选择市">
                  <el-option
                    v-for="(value,key) in firmAddress[selectedProvince]"
                    :key="key"
                    :label="value"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <!--<el-input v-model="firmAddress" placeholder="企业所在地"></el-input>-->
          </el-col>
        </el-row>
        <el-row class="margin_top15">
          <el-col :span="3">
            <img src="../../assets/firmmedical/qylxr_icon@2x.png" height="30" width="30"/>
          </el-col>
          <el-col :span="21" class="width280">
            <el-input v-model="firmContact" placeholder="企业联系人"></el-input>
          </el-col>
        </el-row>
        <el-row class="margin_top15 margin_bottom15">
          <el-col :span="3">
            <img src="../../assets/firmmedical/qylxdh_icon@2x.png" height="30" width="30"/>
          </el-col>
          <el-col :span="21" class="width280">
            <el-input v-model="firmContactTel" placeholder="联系人电话"></el-input>
          </el-col>
        </el-row>
        <el-button class="apply_btn" @click="commitApply()">提交申请</el-button>
      </div>
    </div>
    <div class="margin_top15 padding_left_right_percent19">
      <el-row class="margin_top15">
        <el-col :span="12" class="firm_img">
          <img src="../../assets/firmmedical/qytj_img_1.png" height="300" width=""/>
        </el-col>
        <el-col :span="12" class="text_align_right">
          <div class="introduce">
            <!--<div class="title">多元化套餐</div>-->
            <!--<div class="subTitle">解决众口难调的问题</div>-->
          </div>
          <div class="title">多元化套餐</div>
          <div class="subTitle">解决众口难调的问题</div>
          <div class="content">多种类型的套餐，以及合理的预算分配，员工自行选择额定内套餐，解决员工众口难调，套餐不适用等问题。</div>
        </el-col>
      </el-row>
    </div>
    <div class="padding_left_right_percent19">
      <el-row class="margin_top15">
        <el-col :span="12" class="">
          <div class="left_introduce"></div>
          <div class="left_title">解放人力资源</div>
          <div class="left_subTitle">价格优惠 统一预定 统一服务</div>
          <div class="left_content">众多品牌合作商，价格特殊优惠，统一的管理系统，导入员工，快速生产体检方案，解放人力资源的时间。便捷易用。</div>
        </el-col>
        <el-col :span="12" :pull="0" class="right_img">
          <img src="../../assets/firmmedical/qytj_img_2.png" height="300" width=""/>
        </el-col>
      </el-row>
    </div>
    <div class="padding_left_right_percent19">
      <el-row class="margin_top15">
        <el-col :span="12" class="firm_img">
          <img src="../../assets/firmmedical/qytj_img_3.png" height="300" width=""/>
        </el-col>
        <el-col :span="12" class="text_align_right">
          <div class="introduce">
            <!--<div class="title">多元化套餐</div>-->
            <!--<div class="subTitle">解决众口难调的问题</div>-->
          </div>
          <div class="title">专业服务</div>
          <div class="subTitle">一对一顾问咨询</div>
          <div class="content">一对一顾问咨询、专业高效。快速帮您找到符合企业的专属套餐，高效解决企业健康管理。</div>
        </el-col>
      </el-row>
    </div>
    <cooper-institution></cooper-institution>
    <serve-client></serve-client>
  </div>
</template>

<script>
  import CooperativeInstitution from "../../components/CooperativeInstitution"
  import ServeClient from "../../components/ServeClients"
  import swal from 'sweetalert2'; //alert框

  export default {
    components: {
      'cooper-institution': CooperativeInstitution,
      'serve-client': ServeClient,
    },
    data() {
      return {
        firmName: '',
        firmAddress: '',
        firmContact: '',
        firmContactTel: '',
        selectedProvince:null,
        selectedCity:null,
      }

    },
    created() {
      this.getCityData();
    },
    methods: {
      //选择省份的事件
      selectProvinceEvent(key){
        var numReg = /^[0-9]+$/;
        var numRe = new RegExp(numReg);
        if (key !== undefined && numRe.test(key)) {
          var arr = [];
          for(let i in this.firmAddress[key]){
            arr.push(i)
          }
          this.selectedCity = arr[0];
        }
      },
      firmApply(){
        this.$post('/api/enterprise/apply', {
          enterpriseName: this.firmName,
          province: this.selectedProvince,
          city:this.selectedCity,
          phoneNumber:this.firmContactTel,
          contact:this.firmContact
        }).then(res => {
          // console.log("test" + JSON.stringify(res));
          if (res.data.code === 200) {
            // alert(res.data.msg);
            swal('提示',res.data.msg,'success');
            // console.log("test" + JSON.stringify(res.data.data));
          } else {
            swal('提示',res.data.msg,'error');
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      getCityData() {
        const config = require('../../../static/region.json');
        // this.firmAddress = config['86'];
        this.firmAddress = config;
      },
      //提交申请
      commitApply(){
        this.firmApply();
      }
    }
  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";

  .padding {
    padding: 0px;
    background-color: #F6F6F6;
  }

  .width350 {
    width: 350px;
    float: right;
    margin-right: 12%;
    margin-top: 1%;
  }

  .width280 {
    width: 280px;
  }

  .commit_apply {
    background: url('../../assets/firmmedical/qytj_banner1.png');
    /*background-size: auto 100%;*/
    backgroundRepeat: "no-repeat";
    width: auto;
    height: 366px;
  }

  .apply_btn {
    width: 306px;
    background-color: #33B2E8;
    font-size: 17px;
    color: #FFFFFF;
    margin-top: 15px;
    margin-bottom: 30px;
  }

  .introduce {
    background-color: white;
    height: 210px;
    margin-top: 10%;
    filter: alpha(opacity=70);
    -moz-opacity: 0.7;
    -khtml-opacity: 0.7;
    opacity: 0.7;
    z-index: 10;
    /*float: right;*/
  }

  .title {
    color: #333333;
    font-size: 34px;
    /*margin-top: -68%;*/
    z-index: 100;
    top: 22%;
    position: absolute;
    width: 45%;
  }

  .subTitle {
    color: #666666;
    font-size: 28px;
    z-index: 100;
    width: 45%;
    top: 37%;
    position: absolute;
  }

  .content {
    font-size: 16px;
    color: #666666;
    z-index: 100;
    top: 52%;
    /*width: 35%;*/
    position: absolute;
    width: 43%;
    margin-left: 17px;
    /*margin-top: -21%;*/
  }

  .right_img {
    z-index: 1;
    /*margin-left: -14%;*/
    position: relative;
    left: -6%;
    /*position: absolute;*/
  }

  .left_introduce {
    background-color: white;
    height: 210px;
    margin-top: 10%;
    filter: alpha(opacity=70);
    -moz-opacity: 0.7;
    -khtml-opacity: 0.7;
    opacity: 0.7;
    z-index: 99;
    position: relative;
    /*width: 30%;*/
    /*float: right;*/
  }

  .left_title {
    color: #333333;
    font-size: 34px;
    /*margin-top: -68%;*/
    z-index: 100;
    top: 22%;
    position: absolute;
    margin-left: 45px;
    /*width: 28%;*/
  }

  .left_subTitle {
    color: #666666;
    font-size: 28px;
    z-index: 100;
    margin-left: 45px;
    /*width: 39%;*/
    top: 37%;
    position: absolute;
  }

  .left_content {
    font-size: 16px;
    color: #666666;
    z-index: 100;
    top: 52%;
    width: 41%;
    /*width: 400px;*/
    margin-left: 45px;
    text-align: left;
    /*padding-left: 6%;*/
    position: absolute;
    /*margin-top: -21%;*/
  }


</style>
