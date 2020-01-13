<template>
  <div>
    <div class="white_bg_color">
      <p class="title_font padding_left10 text_align_left">我的企业</p>
      <el-row>
        <el-col :span="6">
          <div class="firm_img_div">
            <img src="../../assets/logo_login@2x.png" class="logo_img"/>
          </div>
        </el-col>
        <el-col :span="10" class="text_align_left margin_left20">
          <p class="firm_name_font">{{firmName}}</p>
          <el-row>
            <el-col :span="8">
              <p class="firm_content_title margin_top_left7">所属部门</p>
            </el-col>
            <el-col :span="14">
              <p class="firm_content margin_top_left7">{{departmentName}}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <p class="firm_content_title margin_top_left7">状态</p>
            </el-col>
            <el-col :span="14">
              <!--0默认员工待确认待处理 1员工已确认正常状态-->
              <p class="firm_content margin_top_left7">{{status===0?"待确认":"正常"}}</p>
            </el-col>
          </el-row>
          <el-row :class="{displayClass:agreeFlag}">
            <el-col :span="8">
              <p class="firm_content_title margin_top_left7">加入时间</p>
            </el-col>
            <el-col :span="14">
              <p class="firm_content margin_top_left7">{{joinTime}}</p>
            </el-col>
          </el-row>
          <el-row :class="{displayClass:!agreeFlag}" v-if="firmName !== ''&& firmName !== '无' ">
            <p class="firm_content_title margin_top_left7">该企业正添加您为企业员工，您是否同意</p>
          </el-row>
        </el-col>
        <el-col :span="8" v-if="firmName !== ''&& firmName !== '无' ">
          <div class="margin_top35" :class="{displayClass:agreeFlag}">
            <el-button class="unbind_relate" @click="unbindRelate()">解除关系</el-button>
          </div>
          <div :class="{displayClass:!agreeFlag}">
            <el-row :gutter="10">
              <el-col :span="12" class="margin_top35">
                <el-button class="refuse_btn" size="small" @click="agreeOrRefuseClick('2')">拒绝</el-button>
              </el-col>
              <el-col :span="12" class="margin_top35">
                <el-button class="agree_btn" size="small" @click="agreeOrRefuseClick('1')">同意</el-button>
              </el-col>
            </el-row>
          </div>


        </el-col>
      </el-row>
      <!--<compent :is="modelCode"></compent>-->
    </div>
    <div class="white_bg_color margin_top15">
      <p class="title_font padding_left10 text_align_left">企业体检</p>
      <el-row :gutter="10">
        <el-col :span="8" v-for="(o, index) in inviteBasicInfo" :key="o" :class="{'marginTop10':index>2}">
          <div class="padding10">
            <el-card :body-style="{ padding: '0px' }">
              <div slot="header" class="text_align_left">
                <span>2月体检</span>
              </div>
              <div class="card_content">
                <el-row>
                  <el-col :span="8">
                    <p class="firm_content_title margin_top_left7">时间</p>
                  </el-col>
                  <el-col :span="14" class="text_align_left">
                    <p class="firm_content margin_top_left7">{{o.creatTime}}</p>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <p class="firm_content_title margin_top_left7">体检额度</p>
                  </el-col>
                  <el-col :span="14" class="text_align_left">
                    <p class="firm_content margin_top_left7">¥{{o.money}}</p>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <p class="firm_content_title margin_top_left7">体检项目</p>
                  </el-col>
                  <el-col :span="14" class="text_align_left">
                    <p class="firm_content margin_top_left7">{{o.palnName}}</p>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <p class="firm_content_title margin_top_left7">体检报告</p>
                  </el-col>
                  <el-col :span="14" class="text_align_left">
                    <p class="upload margin_top_left7 "><u>{{o.status===1?'上传':'查看'}}</u></p>
                  </el-col>
                </el-row>

              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import Verify from '../../utils/utils'

  export default {
    name: 'MyBusiness',
    props: ['selectTitle'],
    data() {
      return {
        inviteBasicInfo: [],
        inviteNum: 0,
        firmName: '',//企业名
        departmentName: '研发',//部门名称
        status: 0,
        joinTime: '2018-12-12',//加入时间
        time: '2019-02',
        medicalLimit: '300.00',//体检额度
        medicalProject: '血常规、尿常规、肝功能',
        reportFlag: 1,//上传还是查看的标记
        agreeFlag: true
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      this.getFirmInfo();
    },
    methods: {
      //同意事件
      agreeOrRefuseClick(str) {
        this.agreeFlag = false;
        let userId = localStorage.getItem("userId");
        // let userInfo = '/api/user/employee/enterpriseRelation/' + userId;
        let url = '/api/personal/'+userId+'/'+str +'/employee/enterpriseRelation';
        this.$put(url, {
          // status:state
        }).then(res => {
          if (res.data.code === 200) {
            console.log("同意" + JSON.stringify(res.data.data));
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //拒绝事件
      refuseClick() {
        this.agreeFlag = true;
        let userId = localStorage.getItem("userId");
        let userInfo = '/api/user/employee/enterpriseRelation/' + userId;
        this.$put(userInfo, {
          status:0
        }).then(res => {
          if (res.data.code === 200) {
            console.log("同意" + JSON.stringify(res.data.data));
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //解除关系
      unbindRelate() {
        this.agreeFlag = true;
        let userId = localStorage.getItem("userId");
        // let userInfo = '/api/user/employee/enterpriseRelation/' + userId;
        let url = '/api/personal/'+userId+ '/employee/enterpriseRelation';
        this.$del(url, {}).then(res => {
          if (res.data.code === 200) {
            console.log("解绑==" + JSON.stringify(res.data.data));
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      getFirmInfo() {
        let userId = localStorage.getItem("userId");
        // let userInfo = '/api/user/employee/enterpriseProfile/' + userId;
        let firmInfoUrl = '/api/personal/'+ userId + '/employee/enterpriseProfile';
        this.$get(firmInfoUrl, {}).then(res => {
          if (res.data.code === 200) {
            if (Verify.validateIsNull(res.data.data)) {
              this.firmName = res.data.data.employeeEntProfile.enterpriseName;
              this.departmentName = res.data.data.employeeEntProfile.departmentName;
              this.status = res.data.data.employeeEntProfile.employeeStatus;
              // this.inviteNum = res.data.data.inviteBasic.inviteNumber;
              // this.inviteBasicInfo = res.data.data.inviteBasic.items;
              // this.joinTime = Verify.convertDate(res.data.data.createdAt);
              this.inviteNum = res.data.data.examiantionPlans.length;
              this.inviteBasicInfo = res.data.data.examiantionPlans;
              for (var i=0;i< this.inviteBasicInfo.length;i++){
                this.inviteBasicInfo[creatTime]=Verify.convertDate(this.inviteBasicInfo[i].createdAt);
              }
              this.joinTime = Verify.convertDate(res.data.data.createdAt);
              console.log("test" + JSON.stringify(res.data.data));
            }else{
              alert(res.data.msg);
              this.firmName = '无';
              this.departmentName = '无';
              this.status = '无';
              this.inviteNum = '';
              this.inviteBasicInfo = '';
            }

          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style>
  @import "../../styles/personal/personal-center.scss";

  /*'我的企业'的字体样式*/
  .title_font {
    font-size: 18px;
    color: #333333;
    margin-top: 0px;
    line-height: 55px;
  }

  .firm_img_div {
    margin-left: 15px;
    border: 1px silver solid;
  }

  .logo_img {
    text-align: left;
    height: 60px;
    margin-top: 0.75rem;
  }

  .firm_name_font {
    font-size: 16px;
    color: #333333;
  }

  .firm_content_title {
    font-size: 14px;
    color: #666666;
  }

  .firm_content {
    font-size: 14px;
    color: #333333;
  }

  .margin_top_left7 {
    margin-top: 7px;
    margin-bottom: 7px;
  }

  .unbind_relate {
    width: 180px;
    background-color: #33B2E8;
    color: #ffffff;
    font-size: 17px;
  }

  .refuse_btn {
    width: 80px;
    border: 1px solid #33B2E8;
    color: #33B2E8;
    font-size: 17px
  }

  .agree_btn {
    width: 80px;
    background-color: #33B2E8;
    color: #ffffff;
    font-size: 17px;
  }

  .margin_top35 {
    margin-top: 35%;
  }

  .padding10 {
    padding: 10px;
  }

  .upload {
    color: #009BDD;
    font-size: 14px;
    text-decoration: #009BDD;
  }

  .displayClass {
    display: none;
  }

</style>



