<template>    
  <div class="padding_left_right_percent19 all_category padding_top10">
    <div class="category">
      <div class="div_bottom">
        <el-row>
          <el-col :span="2" class="statistics_font">
            <div class="btn_bg_color">所在地区</div>
          </el-col>
          <el-col :span="19" class="region_font cursor_pointer" ref="areaKindsWidth">
            <div>
              <ul class="ul_list_style ul_row" :class="{'ul_show':!foldFlag}">
                <li v-for="(item,index) in areaType" class="padding_left10 padding_right10" :key="index">
                  <a v-if="foldFlag === true" v-text="item.value" @click="selectRegion(item)"
                     v-bind:class="{'bgColor':item.whether }"></a>
                  <a v-if="foldFlag === false" v-text="item.value" @click="selectRegion(item)"
                     v-bind:class="{'bgColor':item.whether }"></a>
                </li>
                <!--<li  v-for="(value,key) in areaType"-->
                <!--:key="key"-->
                <!--:label="value"-->
                <!--:value="key">-->
                <!--&emsp;<a v-text="value " v-on:click="selectType(value,key)" v-bind:class="{'bgColor':selectCity}"></a>&emsp;-->
                <!--</li>-->
              </ul>
            </div>
          </el-col>
          <el-col :span="2">
            <div v-on:click="changeFoldState" v-if="areaKindsLength > areaWidth">
              <el-button size="mini">{{foldFlag?'展开':'收起'}}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="div_bottom">
        <el-row>
          <el-col :span="2" class="statistics_font">
            <div class="btn_bg_color">机构类型</div>
          </el-col>
          <el-col :span="22" class="region_font cursor_pointer">
            <div>
              <ul class="ul_list_style">
                <li v-for="ins in institutionType" class="padding_left10 padding_right10">
                  <a v-text="ins.insName" v-on:click="selectType(ins)"
                     v-bind:class="{'bgColor':ins.whether }"></a>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="suit_list">
      <el-row class="region_font">
        <el-col :span="2">
          <div class="suit_btn cursor_pointer">
            <span v-bind:class="{'bgColor':overAllWhether}" @click="clickOverAll()">综合</span>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="cursor_pointer">
            <span v-bind:class="{'bgColor':distanceWhether}" @click="clickDistance()"> 距离↓</span>
          </div>
        </el-col>
        <el-col :span="20" class="text_align_right padding_right10">
          <div class="statistics_font">共<span class="eligible_number">{{eligibleNumber}}</span>个符合条件的套餐</div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row :gutter="40">

        <el-col :span="18" v-if="institutionList.length !== 0" class="padding_bottom10">
          <el-row :gutter="40">
            <el-col :span="8" v-for="(o, index) in institutionList" :key="index" :class="{'marginTop10':index>2}">
              <div @click="institutionDetail(o.CatalogManufacturer.id)" class="cursor_pointer">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="set_bg_img">
                    <img :src=o.institutionImgUrl class="width_height_100">
                  </div>
                  <div class="card_content card_align">
                    <p class="card_title card_title_p">{{o.CatalogManufacturer.name}}</p>
                    <span class="card_subtitle">共{{o.packages}}个体检套餐</span>
                    <el-row>
                      <el-col :span="12">
                        <span class="discount_price">¥</span><span
                        class="discount_price">{{o.convertLowerPrice === null?'0.00':o.convertLowerPrice}}</span>
                        <!--<span class="origin_price">起</span>-->
                      </el-col>
                      <el-col :span="12" class="text_align_right padding_right10">
                        <span v-if="o.county !== null" class="origin_price padding_right10">{{o.county}}</span>
                      </el-col>
                    </el-row>
                    <!--<p class="margin_top0_bottom0"><span class="discount_price">¥</span><span-->
                    <!--class="discount_price">{{o.convertLowerPrice === null?'0.00':o.convertLowerPrice}}</span><span-->
                    <!--class="origin_price">起</span>&emsp;&emsp;&emsp;<span v-if="o.county !== null"-->
                    <!--class="origin_price padding_right10">{{o.county}}</span>-->
                    <!--</p>-->
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="18" v-else>
          <el-row :gutter="40">
            <el-col :span="24">
              <div class="institute_div">
                <img src="../../assets/personal/wudingdan_icon@2x.png" height="88" width="" style="margin-top: 20px"/>
                <p class="prompt_placeholder">暂时没有相关机构</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <div class="text_align_left region_font">
            推荐套餐
          </div>
          <el-row>
            <div v-if="recommendData.length !== 0">
              <el-col :span="20" v-for="(recommend, index) in recommendData" :key="index" class="margin_bottom5">
                <div @click="suitDetail(recommend.CatalogProduct.id)" class="cursor_pointer">
                  <el-card :body-style="{ padding: '0px' }">
                    <div class="recommend_image">
                      <img :src=recommend.imgUrl class="width_height_100" alt="推荐套餐图片">
                    </div>
                    <div class="card_content card_align">
                      <p class="card_title card_title_p">{{recommend.CatalogProduct.name}}</p>
                      <p class="card_subtitle card_title_p margin_top5 margin_bottom5">{{recommend.CatalogProduct.simpleDescription}}</p>
                      <p class="margin_top0_bottom0"><span class="discount_price">¥</span><span
                        class="discount_price">{{recommend.convertSalePrice}}</span>
                        <!--<span class="origin_price">起</span>&emsp;&emsp;&emsp;-->
                        <span class="origin_price line"
                              v-if="recommend.CatalogProduct.marketPrice !== null">¥</span><span
                          class="origin_price line">{{recommend.convertMarketPrice}}</span></p>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </div>
            <div v-else class="recommend_space_div">
              <img src="../../assets/personal/wudingdan_icon@2x.png" height="88" width="" style="margin-top: 20px"/>
              <p class="prompt_placeholder">暂时没有相关推荐套餐</p>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Verify from '../../utils/utils'
  import {mapGetters} from 'vuex'
  import swal from 'sweetalert2'; //alert框

  export default {
    data() {
      return {
        period: '',
        selectTypeName: '不限',
        areaType: [{key: '', value: '不限', whether: true}],
        selectCity: false,
        institutionType: [{'key': '', 'insName': '不限', whether: true}, {
          'key': 'publicHospital',
          'insName': '公立医院',
          whether: false
        }, {'key': 'privateHospital', 'insName': '民营医院', whether: false}, {
          'key': 'center',
          'insName': '专业体检中心',
          whether: false
        }],
        eligibleNumber: 0,
        institutionList: [],
        recommendData: [],
        foldFlag: true,
        instituteType: '',//选中的机构类型
        regionCode: '',//选中的地区编码
        overAllWhether: true,//默认是'综合'状态，且选中
        overAll: true,//'综合'对应的参数，默认是true
        distanceWhether: false,//'距离'是否是选中状态
        distance: 'asc',// 	距离 desc 或者 asc,默认asc
        areaWidth: '',
        areaKindsLength: 0,
      }
    },
    mounted() {
      this.$nextTick(() => {
        //计算分类所占的屏幕宽
        const eWidth = this.$refs.areaKindsWidth.$el.clientWidth;
        this.areaWidth = eWidth;
      })
    },
    created() {
      //获取机构列表
      this.getInstitutionList();
      //获取城市区域
      this.getRelateRegion();
      //获取推荐列表
      this.getRecommendList();
    },
    watch: {
      //监听城市编码的变化
      provinceCode(newValue, oldValue) {
        if (newValue !== oldValue) {
          // localStorage.setItem("setProvinceCode",newValue);
          this.getRelateRegion();
        }
      },
      deep: true
    },
    computed: {
      ...mapGetters(['provinceCode'])
    },
    methods: {
      //获取机构列表
      getInstitutionList() {
        let institutionUrl = '/api/medical/centers';
        let data = {
          overAll: this.overAll
        };

        if (Verify.validateIsNull(localStorage.getItem("setProvinceCode"))) {
          data['province'] = localStorage.getItem("setProvinceCode");
        } else {
          data['province'] = 110000;
        }
        if (Verify.validateIsNull(this.regionCode)) {
          if (this.regionCode !== 0) {
            data['county'] = this.regionCode;
          }
        }
        if (Verify.validateIsNull(this.instituteType)) {
          if (this.instituteType !== 0 && this.instituteType !== "0") {
            data['type'] = this.instituteType;
          }
        }
        if (Verify.validateIsNull(this.distance)) {
          data['distance'] = this.distance;
        }

        this.$get(institutionUrl, data).then(res => {
          if (res.data.code === 200) {
            if (Verify.validateIsNull(res.data.data.items)) {
              this.institutionList = res.data.data.items;
              this.eligibleNumber = res.data.data.total;
              const config = require('../../../static/region.json');
              for (let i = 0; i < res.data.data.items.length; i++) {
                this.institutionList[i]['convertLowerPrice'] = Verify.toDecimal(res.data.data.items[i].productLowerPrice);
                if (Verify.validateIsNull(res.data.data.items[i].CatalogManufacturer.File)) {
                  this.institutionList[i]['institutionImgUrl'] = "http://" + res.data.data.items[i].CatalogManufacturer.File.manufacturer;
                  this.institutionList[i]['county'] = config[res.data.data.items[i].city][res.data.data.items[i].county];
                }
              }
            }
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //选择了某个区域，进行状态切换
      selectRegion(items) {
        // console.log("params===" + items.key,items.value,items.whether);
        for (let i in this.areaType) {
          // debugger
          //重复点击（2次）当前选项，状态改为未选中，且当前选中是"不限"
          if (this.areaType[i].key === items.key) {
            this.areaType[i].whether = !this.areaType[i].whether;
            if (this.areaType[i].whether === false) {
              this.areaType[0].whether = true;
            }
            this.regionCode = this.areaType[i].key;
          } else {
            this.areaType[i].whether = false;
          }
        }
        this.getInstitutionList();
      },
      //选择机构
      selectType(items) {
        // this.institutionType[0].whether = false;
        // items.whether = !items.whether;
        if (items.whether === false) {
          this.instituteType = items.key;
        } else {
          this.instituteType = '';
        }
        //筛选出当前选中的索引，让其他处于未选中状态（单选）
        const index = this.institutionType.findIndex(val => val.insName === items.insName);
        // console.log('text=='+this.projectType[index].productName+'index='+index+this.projectType[index].id);
        for (let i = 0; i < this.institutionType.length; i++) {
          //重复点击（2次）当前选项，状态改为未选中，且当前选中是"不限"
          if (this.instituteType === '') {
            this.institutionType[0].whether = true;
            this.institutionType[i].whether = false;
          } else {
            if (i === index) {
              this.institutionType[i].whether = true;
            } else {
              this.institutionType[i].whether = false;
            }
          }
        }
        this.getInstitutionList();
      },
      //套餐详情
      suitDetail(id) {
        this.$router.push({path: '/MedicalProductDetail', query: {productId: id}})
      },
      //点击综合按钮
      clickOverAll() {
        this.overAllWhether = !this.overAllWhether;
        if (this.overAllWhether === false) {
          this.overAll = false;
        } else {
          this.overAll = true;
        }
        this.distanceWhether = false;
        //默认是升序，选中是降序
        this.distance = 'asc';
        this.getInstitutionList();
      },
      //点击'距离'事件
      clickDistance() {
        this.overAllWhether = false;//选中距离的按钮，综合是未选中状态
        this.overAll = false;
        this.distanceWhether = !this.distanceWhether;
        //默认是升序，选中是降序
        if (this.distanceWhether === false) {
          this.distance = 'asc';
        } else {
          this.distance = 'desc';
        }
        this.getInstitutionList();
      },
      //获取省份对应的区
      getRelateRegion() {
        const config = require('../../../static/region.json');
        //选择了除北京以外的省，首先读取Vuex的传值，为空读缓存，默认是北京
        if (Verify.validateIsNull(this.provinceCode)) {
          this.areaType = [{key: 0, value: '不限', whether: true}];
          for (let val in config[this.provinceCode]) {
            for (let region in config[val]) {
              let obj = {
                key: region,
                value: config[val][region],
                whether: false,
              }
              this.areaType.push(obj);
            }
          }
        } else if (Verify.validateIsNull(localStorage.getItem('setProvinceCode'))) {
          this.areaType = [{key: 0, value: '不限', whether: true}];
          for (let val in config[localStorage.getItem('setProvinceCode')]) {
            for (let region in config[val]) {
              // console.log(' config[region]=='+JSON.stringify(config[val][region]));
              let obj = {
                key: region,
                value: config[val][region],
                whether: false,
              }
              this.areaType.push(obj);
            }
          }
        } else {
          //北京
          this.areaType = [{key: 0, value: '不限', whether: true}];
          for (let val in config['110000']) {
            // console.log(' config[value]=='+JSON.stringify(config[val]));
            for (let region in config[val]) {
              // console.log(' config[region]=='+JSON.stringify(config[val][region]));
              let obj = {
                key: region,
                value: config[val][region],
                whether: false,
              }
              this.areaType.push(obj);
            }
          }
        }
        for(let item of this.areaType) {
          //计算地区分类占的长度
          this.areaKindsLength +=(item.value.length*14+20);
        }
      },
      // 推荐套餐广告位
      getRecommendList() {
        // let userId = localStorage.getItem("userId");
        // let product = '/api/user/products';
        let product = '/api/ad/products/recommendMedicalExaminationPackage';
        this.$get(product, {}).then(res => {
          if (res.data.code === 200) {
            // console.log("test" + JSON.stringify(res.data.data));
            this.recommendData = res.data.data;
            for (let i = 0; i < this.recommendData.length; i++) {
              this.recommendData[i]['convertSalePrice'] = Verify.toDecimal(this.recommendData[i].CatalogProduct.salePrice);
              this.recommendData[i]['convertMarketPrice'] = Verify.toDecimal(this.recommendData[i].CatalogProduct.marketPrice);
              if (Verify.validateIsNull(this.recommendData[i].CatalogProduct.File)) {
                this.recommendData[i]['imgUrl'] = "http://" + this.recommendData[i].CatalogProduct.File.url;
              }
            }
          } else {
            if (res.data.code === 401) {
              swal({
                title: "token过期,请重新登录",
                // text: "You will not be able to recover this imaginary file!",
                type: "question",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
              }).then((result) => {
                if (result.value) {
                  this.$router.push({path: '/Login'})
                } else {
                  swal("提示", res.data.msg, "error");
                }
              });
            } else {
              alert(res.data.msg);
            }
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      institutionDetail(id) {
        console.log("111=" + id);
        this.$router.push({path: '/MedicalInstitutionDetail', query: {institutionId: id}})
      },
      //地区折叠展开的标志
      changeFoldState() {
        this.foldFlag = !this.foldFlag;
      }
    }
  }
</script>
<style>
  @import "../../styles/personal/personal-center.scss";

  .all_category {
    line-height: 38px;
  }

  .category {
    border: 1px solid #EEEEEE;
    background-color: #ffffff;
  }

  .region_font {
    color: #333333;
    font-size: 14px;
  }

  .btn_bg_color {
    background-color: #f8f8f8;
    /*height: 38px;*/
  }

  div.category ul {
    list-style: none; /* 去掉ul前面的符号 */
    margin: 0px; /* 与外界元素的距离为0 */
    padding: 0px; /* 与内部元素的距离为0 */
    width: auto; /* 宽度根据元素内容调整 */
  }

  /* 所有class为menu的div中的ul中的li样式 */
  div.category ul li {
    float: left; /* 向左漂移，将竖排变为横排 */
  }

  .div_bottom {
    border-bottom: 1px solid #EEEEEE;
  }

  /*筛选条件的样式*/
  .suit_list {
    background-color: white;
    margin-top: 10px;
    margin-bottom: 10px;
    height: 38px;
  }

  .suit_btn {
    height: 38px;
  }

  .eligible_number {
    color: #33B2E8;
    font-size: 14px;
  }

  .statistics_font {
    color: #666666;
    font-size: 14px;
    /*line-height: 35px;*/
  }

  .marginTop10 {
    margin-top: 10px;
    /*margin-bottom: 5px;*/
  }

  /*.margin_bottom10 {*/
  /*margin-bottom: 10px;*/
  /*}*/

  .card_align {
    text-align: left;
    padding-left: 10px;
    line-height: 30px;
  }

  .recommend_image {
    width: 100%;
    /*height: 198px;*/
  }

  .bgColor {
    background-color: rgb(51, 178, 232);
    border-radius: 3px;
    color: white;
    padding-left: 5px;
    padding-right: 5px;
  }

  .institute_div {
    height: 660px;
    background-color: white;
    text-align: center;
  }

  .set_bg_img {
    /*background-color: lightgrey;*/
    height: 157px;
    /*width: 191px;*/
  }
  .el-button--primary:focus, .el-button--primary:hover {
    border-width: 1px;
  }

</style>
