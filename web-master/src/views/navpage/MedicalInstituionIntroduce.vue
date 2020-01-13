<template>
  <div class="margin_left_right white_bg_color">
    <div>
      <hr class="institute_hr_color">
      <el-row>
        <el-col :span="6">
          <div class="detail_img">
            <img :src=introImageUrl class="width_height_100"/>
          </div>

        </el-col>
        <el-col :span="18" class="text_align_left padding_left10">
            <div>
              <p class="stores_name">{{storesName}}</p>
              <p class="regular_font">
                <img class="icon_img" src="../../assets/medicalproduct/didian_tjcp_jgjs@2x.png" height="18"
                     width="18"/>
                <span>{{storesAddress}}</span>
              </p>
              <p class="regular_font">
                <img class="icon_img" src="../../assets/medicalproduct/dianhua_tjcp_jgjs@2x.png" height="18"
                     width="18"/>
                {{storePhone}}</p>
              <p class="regular_font">
                <img class="icon_img" src="../../assets/medicalproduct/shijian_tjcp_jgjs@2x.png" height="18"
                     width="18"/>
                {{businessHours}}
              </p>
              <p class="regular_font">

                <img class="icon_img" src="../../assets/medicalproduct/zhuyi_tjjg_jgxx@2x.png" height="18"
                     width="18" v-if="needingAttention !==null"/>
                {{needingAttention}}
              </p>
              <p class="regular_font">
                <img class="icon_img" src="../../assets/medicalproduct/jianjie_tjjg_jgxx@2x.png" height="18"
                     width="18"/>
                该机构共有<span class="special_font">{{suitNumber}}</span>个体检套餐，<span class="special_font">¥{{suitPrice}}</span>起
              </p>
            </div>
          <el-row class="margin_top15">
            <el-col :span="6" class="add_cart">
              <el-button size="medium" class="select_suit" :class="{clickFont:active}" @click="selectSuit()">选择套餐
              </el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="margin_top15">
      <el-row :gutter="25">
        <el-col :span="19" class="institute_tab">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick" id="tabs">
            <el-tab-pane label="体检套餐" name="first">
              <div>
                <div class="store_info" v-if="medicalPackage.length !== 0">
                  <el-row v-for="(medical,index) in medicalPackage" :key="index" :gutter="15">
                    <el-col :span="6" class="padding_left10">
                      <div class="institution_img">
                        <img :src=medical.packageImgUrl class="width_height_100" alt="体检套餐">
                      </div>
                        <!--<img :src=medical.packageImgUrl class="institution_img" alt="推荐套餐"/>-->
                    </el-col>
                    <el-col :span="18" class="text_align_left">
                      <div>
                        <p class="stores_name">{{medical.name}}<span @click="packageDetailEvent(medical.productId)"><u class="special_font select_detail cursor_pointer">查看详细</u></span>
                        </p>
                        <p class="margin_top0_bottom0"><span class="discount_price">¥</span><span
                          class="discount_price">{{medical.CatalogProduct.salePrice === null ?'0.00':medical.convertSalePrice}}</span><span class="origin_price">起</span>&emsp;&emsp;&emsp;<span
                          class="origin_price line">¥</span><span class="origin_price line">{{medical.CatalogProduct.marketPrice === null?'0.00':medical.convertMarketPrice}}</span></p>
                        <p class="package_introduce">
                          {{medical.description}}
                        </p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div v-else class="recommend_space_div space_border">
                  <img src="../../assets/personal/wudingdan_icon@2x.png" height="88" width="" style="margin-top: 20px"/>
                  <p class="prompt_placeholder">暂时没有相关体检套餐</p>
                </div>
              </div>
              <el-pagination
                background
                layout="prev, pager, next"
                :total=packageTotal v-if="packageTotal>0">
                <el-pagination
                  @size-change="packageHandleSizeChange"
                  @current-change="packageHandleCurrentChange"
                  :current-page.sync="packageCurrentPage"
                  :page-size="5"
                  layout="total, prev, pager, next"
                  :total=packageTotal v-if="packageTotal>0">
                </el-pagination>
              </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="机构介绍" name="second">
              <div>
                <div class="store_info">
                  <el-row>

                  </el-row>
                </div>
                <div class="text_align_left padding_left10">
                  <p class="stores_name">机构简介</p>
                  <p class="stores_introduce">
                   {{description}}
                  </p>
                  <!--<p class="stores_introduce">-->
                    <!--泉州910医院体检中心拥有一栋独立的体检大楼，营业面积达6000平方米，环境宽敞，按照五星级健康休闲会所标准建造，全程数字化管理，医检分离;可为客户提供全程导检等一站式服务。中心分设贵宾区体检部、普检区体检部，实行男、女分检;体检资料私密化管理，多形式导诊，多窗口、大流量快捷优质服务。中心以“品质第一，客户至上”的服务理念，并为客户量身订制近百种个性化体检套餐，为体检异常者，提供专业复检方案;根据客户要求提供各种健康管理服务。-->
                  <!--</p>-->
                </div>
                <div class="text_align_left padding_left10">
                  <p class="stores_name">机构位置</p>
                  <p class="stores_introduce">{{storesAddress}}</p>
                  <div>
                    <img :src=introLocateImageUrl height="402"/></div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="5">
          <div class="text_align_left regular_font">
            推荐套餐
          </div>
          <div v-if="recommendData.length !== 0">
            <el-col :span="20" v-for="(recommend, index) in recommendData" :key="index" class="margin_bottom5 cursor_pointer" style="padding-left: 0px;padding-right: 0px">
              <div @click="suitDetail(recommend.CatalogProduct.id)">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="recommend_image">
                    <img :src=recommend.imgUrl class="width_height_100">
                  </div>
                  <div class="card_content card_align">
                    <p class="card_title card_title_p">{{recommend.CatalogProduct.name}}</p>
                    <p class="card_subtitle card_title_p margin_top5 margin_bottom5">{{recommend.CatalogProduct.simpleDescription}}</p>
                    <p class="margin_top0_bottom0">
                      <el-row :gutter="20">
                        <el-col :span="12" class="padding_left_right0">
                          <span class="suit_discount_price">¥</span><span
                          class="suit_discount_price">{{recommend.convertSalePrice}}</span>
                        </el-col>
                        <el-col :span="12" class="padding_left_right0">
                            <span class="origin_price line"
                                  v-if="recommend.CatalogProduct.marketPrice !== null">¥</span><span
                          class="origin_price line">{{recommend.convertMarketPrice}}</span>
                        </el-col>
                      </el-row>
                    </p>
                  </div>
                </el-card>
              </div>

            </el-col>
          </div>
          <div v-else class="recommend_space_div">
            <img src="../../assets/personal/wudingdan_icon@2x.png" height="88" width="" style="margin-top: 20px"/>
            <p class="prompt_placeholder">暂时没有相关推荐套餐</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
   
</template>
<script>
  import Verify from '../../utils/utils';
  export default {
    data() {
      return {
        introImageUrl:'',
        needingAttention:'空腹检查项目需于上午检查',
        suitNumber:0,
        suitPrice:0,
        suitName:'',
        suitSex: 0,//1男 2女 0男女
        salePrice: '',
        marketPrice: '0',
        medicalCenter:'',
        packageDescription: '身高、体重，血常规、尿常规、血压、肝功能.常规基础体检，适合新入人群。...',//套餐描述
        institutionId: '',//机构id
        active: false,
        activeName: 'first',
        storesName: '慈铭体检中心',
        storesAddress: '东直门店；西直门店',
        storePhone: '4001-1211-00',
        businessHours: '周一至周五，上午8:00-11:30，下午13:00-17:00',
        institutionLocate: '',
        description:'',
        addressData:'',//地址json
        medicalPackage:[],//体检套餐
        packageTotal:0,
        packageCurrentPage:1,
      //  机构简介
        introIntroduce:'',
        introLocateImageUrl:'',//机构地理图片
        recommendData:[],//推荐套餐
      }
    },
    created() {
      this.getInstitutionInfo();//机构信息
      this.getCityData(); //读取城市的json文件
      this.getRecommendList();//推荐套餐列表
    },
    methods: {
      getInstitutionInfo() {
        let url = '/api/medical/centers/' + this.$route.query.institutionId;
        this.$get(url, {}).then(res => {
          if (res.data.code === 200) {
            // console.log("detail==" + JSON.stringify(res.data));
            let institutionDetail = res.data.data;
            let hours = institutionDetail.businessHours.split('-');
            this.businessHours = Verify.convertDate(hours[0])+'—'+ Verify.convertDate(hours[1]);
            this.storePhone = institutionDetail.telephone;
            let introProvince = institutionDetail.province;
            let introCity = institutionDetail.city;
            let introCounty = institutionDetail.county;
            //判断取到的省份是编码还是汉字（处理数据时汉字和编码的两种情况）
            if (introProvince.startsWith('1') || introProvince.startsWith('2') || introProvince.startsWith('3') ||introProvince.startsWith('4')||
              introProvince.startsWith('5')||introProvince.startsWith('6')||introProvince.startsWith('7')||introProvince.startsWith('8')){
              this.storesAddress = this.addressData['86'][introProvince]+ this.addressData[introProvince][introCity]+this.addressData[introCity][introCounty];
            }else{
              this.storesAddress =  introProvince + introCity +introCounty;
            }
            if (Verify.validateIsNull(institutionDetail.CatalogManufacturer.File)) {
              //机构logo图片
              this.introImageUrl = 'http://'+institutionDetail.CatalogManufacturer.File.manufacturer;
            }
            // this.storesAddress = institutionDetail.province + institutionDetail.city;
            this.needingAttention = institutionDetail.note;
            this.suitNumber = institutionDetail.packages;
            //最低价格
            if (Verify.validateIsNull(institutionDetail.productLowerPrice)) {
              this.suitPrice = Verify.toDecimal(institutionDetail.productLowerPrice);
            }
            this.description = institutionDetail.introduce;
            this.institutionLocate = institutionDetail.address;
            let catalogManufacturer = institutionDetail.CatalogManufacturer;
            this.storesName = catalogManufacturer.name; //门店名字

            //体检套餐
            let examinationPackages = institutionDetail.examinationPackages;
            this.medicalPackage = examinationPackages.items;
            this.packageTotal = examinationPackages.total;
            //给体检套餐拼接图片路径
            for(let i=0;i<examinationPackages.items.length;i++){
              this.medicalPackage[i]['convertSalePrice']= Verify.toDecimal(examinationPackages.items[i].CatalogProduct.salePrice);
              this.medicalPackage[i]['convertMarketPrice']= Verify.toDecimal(examinationPackages.items[i].CatalogProduct.marketPrice);
              //每个体检套餐相对应的图片
              if (Verify.validateIsNull(examinationPackages.items[i].CatalogProduct.File)) {
                this.medicalPackage[i]['packageImgUrl'] = 'http://'+examinationPackages.items[i].CatalogProduct.File.productImg;
              }
            }
            //机构介绍
            let institutionIntroduce = institutionDetail.MedicalOrganization;
            this.introIntroduce = institutionIntroduce.description;
            if (Verify.validateIsNull(institutionDetail.LocationFile)) {
              //机构地理图片
              this.introLocateImageUrl = 'http://'+institutionDetail.LocationFile.url;
            }
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      cartHandleChange(value) {
        console.log(value);
      },
      //选择套餐的点击事件
      selectSuit() {
        this.active = true;
        this.activeName = 'first';
        document.getElementById('tabs').scrollIntoView();
      },
      //套餐详细的点击事件（跳转）
      packageDetailEvent(id){
        this.$router.push({ path: '/MedicalProductDetail',query:{productId:id}});
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 修改table header的背景色
      tableHeaderColor({row, column, rowIndex, columnIndex}) {
        if (rowIndex === 0) {
          return 'background-color: #F6F6F6;color: #404040;font-weight: 500;'
        }
      },
      // 推荐套餐广告位
      getRecommendList() {
        let product = '/api/ad/products/recommendMedicalExaminationPackage';
        this.$get(product, {}).then(res => {
          if (res.data.code === 200) {
            this.recommendData = res.data.data;
            debugger
            for (let i = 0; i < this.recommendData.length; i++) {
              this.recommendData[i]['convertSalePrice'] = Verify.toDecimal(this.recommendData[i].CatalogProduct.salePrice);
              this.recommendData[i]['convertMarketPrice'] = Verify.toDecimal(this.recommendData[i].CatalogProduct.marketPrice);
              if (Verify.validateIsNull(this.recommendData[i].CatalogProduct.File)) {
                this.recommendData[i]['imgUrl'] = "http://" + this.recommendData[i].CatalogProduct.File.url;
              }
            }
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //读取城市的本地json
      getCityData(){
        const config = require('../../../static/region.json');
        this.addressData = config;
      },
      //体检套餐的分页
      packageHandleSizeChange(val){
        console.log(`每页 ${val} 条`);
      },
      packageHandleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.packageCurrentPage = val;

      },
      //套餐详情
      suitDetail(id) {
        this.$router.push({path: '/MedicalProductDetail', query: {productId: id}})
      },
    }
  }
</script>
<style>
  @import "../../styles/personal/personal-center.scss";

  .margin_left_right {
    margin-left: 19%;
    margin-right: 19%;
  }

  .institute_hr_color {
    height: 2px;
    background-color: #e6e6e6;
    border: none;
  }

  .border {
    margin-top: 10px;
    border: 1px solid #e6e6e6;
    background-color: #EEEEEE;
    width: 280px;
    height: 220px;
  }

  .title_font {
    color: #333333;
    font-size: 18px;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .special_font {
    color: #009BDD;
    font-size: 14px;
  }

  .sub_font {
    color: #a2a2a2;
    font-size: 14px;
    margin-top: 6px;
    margin-bottom: 6px;
  }

  .second_font {
    color: #666666;
    font-size: 16px;
    margin-top: 6px;
    margin-bottom: 6px;
  }

  .regular_font {
    color: #666666;
    font-size: 14px;
    margin-top: 6px;
    margin-bottom: 6px;
  }

  .select_suit {
    background-color: #33B2E8;
    color: #FFFFFF;
    /*border: 1px solid #DF2321;*/
  }

  .clickFont {
    /*background-color: #DF2321;*/
    color: #ffffff;
  }

  .tab_bg_color {
    border: 1px solid rgba(238, 238, 238, 1);
    background-color: #EEEEEE;
  }

  /*机构介绍的样式*/
  .institution_img {
    margin: 10px;
    /*border: 1px solid #e6e6e6;*/
    /*background-color: #EEEEEE;*/
    /*width: 200px;*/
    /*height: 150px;*/
  }

  .store_info {
    border: 1px solid rgba(238, 238, 238, 1);
  }

  .icon_img {
    vertical-align: middle;
  }

  .stores_name {
    font-size: 16px;
    color: #404040;
    margin-top: 12px;
  }

  .stores_introduce {
    font-size: 12px;
    color: #666666;
  }

  .select_detail {
    float: right;
    padding-right: 10px;
  }
  .package_introduce{
    font-size: 14px;
    color: #a2a2a2;
  }
  .detail_img{
    width:200px;
    height:150px;
    /*background:#EEEEEE;*/
  }
  .recommend_image{
    width:100%;
  }
  .space_border{
    border: 1px solid #e6e6e6;
  }
  /*设置tab选中的样式*/
  .institute_tab .el-tabs__item:hover {
    color: #009BDD;
  }
  .institute_tab .el-tabs__item.is-active {
    color: #009BDD;
  }
  .institute_tab .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
    border-top: 2px solid #009BDD;
    /*border-bottom: 0px solid #009BDD;*/
  }

</style>


