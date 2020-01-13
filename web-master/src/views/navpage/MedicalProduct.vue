<template>    
  <div class="padding_left_right_percent19 padding_top10">
    <div class="line_height38 mouse_pointer">
      <div class="category">
        <div class="div_bottom">
          <el-row>
            <el-col :span="3" class="statistics_font">
              <div class="btn_bg_color">套餐类别：</div>
            </el-col>
            <el-col :span="19" class="category_font">
              <div ref="suitWidth">
                <ul class="ul_list_style category_ul ul_row" :class="{'ul_show':!packageFold}">
                  <li v-for="(item,index) in suitType" class="padding_left10 padding_right10" :key="index"
                      v-model="packageId">
                    <a v-if="packageFold === true" v-text="item.packageName"
                       @click="selectPackageType(item)"
                       v-bind:class="{'bgColor':item.whetherSelect }"></a>
                    <a v-if="packageFold === false" v-text="item.packageName" @click="selectPackageType(item)"
                       v-bind:class="{'bgColor':item.whetherSelect }"></a>
                  </li>
                </ul>
              </div>
            </el-col>
            <el-col :span="2">
              <div v-on:click="changePackageFoldState" v-if="suitKinds > divWidth">
                <el-button size="mini">{{packageFold?'展开':'收起'}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="div_bottom">
          <el-row>
            <el-col :span="3" class="statistics_font">
              <div class="btn_bg_color">检查项目：</div>
            </el-col>
            <el-col :span="19" class="category_font">
              <div>
                <ul class="ul_list_style ul_row" :class="{'ul_show':!projectFold}">
                  <li v-for="(item,index) in projectType" class="padding_left10 padding_right10" :key="index"
                      v-model="projectId">
                    <a v-if="projectFold === true" v-text="item.productName"
                       @click="selectProductType(item)"
                       v-bind:class="{'bgColor':item.whetherSelect }"></a>
                    <a v-if="projectFold === false" v-text="item.productName" @click="selectProductType(item)"
                       v-bind:class="{'bgColor':item.whetherSelect }"></a>
                  </li>
                </ul>
              </div>
            </el-col>
            <el-col :span="2">
              <!--v-if="projectType.length > projectKinds"-->
              <div  v-on:click="changeProductFoldState" v-if="projectKinds > divWidth">
                <el-button size="mini">{{projectFold?'展开':'收起'}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="div_bottom">
          <el-row>
            <el-col :span="3" class="statistics_font">
              <div class="btn_bg_color">年龄：</div>
            </el-col>
            <el-col :span="21" class="category_font">
              <div>
                <ul class="ul_list_style">
                  <li v-for="item in ageCategory" class="padding_left10 padding_right10">
                    <a v-text="item.period" @click="selectAgePeriod(item)"
                       v-bind:class="{'bgColor':item.whetherSelect}"></a>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="div_bottom">
          <el-row>
            <el-col :span="3" class="statistics_font">
              <div class="btn_bg_color">性别：</div>
            </el-col>
            <el-col :span="21" class="category_font">
              <div>
                <ul class="ul_list_style">
                  <ul class="ul_list_style">
                    <li v-for="item in genderType" class="padding_left10 padding_right10">
                      <a v-text="item.gender" @click="selectGender(item)"
                         v-bind:class="{'bgColor':item.whetherSelect}"></a>
                    </li>
                  </ul>
                  <!--<li class="padding_left10 padding_right10" @click="selectAgePeriod(item)" v-bind:class="{'bgColor':selectGender}>-->
                  <!--男-->
                  <!--</li>-->
                  <!--<li class="padding_left10 padding_right10">-->
                  <!--女-->
                  <!--</li>-->
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>

      </div>
      <div class="suit_list">
        <el-row class="category_font">
          <el-col :span="2">
            <div class="suit_btn">
              <span v-bind:class="{'bgColor':comprehensive}" @click="comprehensiveOrder()">综合</span></div>
          </el-col>
          <el-col :span="2">
            <!--↓-->
            <div>
              <span v-bind:class="{'bgColor':salesFlag}" @click="salesOrder()">销量⇅</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div>
              <span v-bind:class="{'bgColor':priceFlag}" @click="priceOrder()">价格⇅</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div>
              <el-dropdown @command="handleCommand">
                 <!--<el-button type="text" size="mini" class="el-dropdown-link" v-bind:class="{'bgColor':priceRangeFlag}">{{allPrice}}<i-->
                   <!--class="el-icon-arrow-down el-icon&#45;&#45;right"></i></el-button>-->
                <div class="el-dropdown-link line_height21" v-bind:class="{'bgColor':priceRangeFlag}">{{allPrice}}<i
                  class="el-icon-arrow-down el-icon--right"></i></div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="0">不限</el-dropdown-item>
                  <el-dropdown-item command="0-300">0-300</el-dropdown-item>
                  <el-dropdown-item command="300-500">300-500</el-dropdown-item>
                  <el-dropdown-item command="500-800">500-800</el-dropdown-item>
                  <el-dropdown-item command="800-10000">800-10000</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
          <el-col :span="14" class="text_align_right padding_right10">
            <div class="statistics_font">共<span class="eligible_number">{{eligibleNumber}}</span>个符合条件的套餐</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <el-row :gutter="40">
        <el-col :span="18" v-if="productData.length !== 0" class="padding_bottom10">
          <el-row :gutter="40">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-for="(p, index) in productData" :key="index"
                    :class="{'marginTop10':index>2}">
              <div @click="productDetail(p.id)" class="cursor_pointer">
                <el-card :body-style="{ padding: '0px' }">
                  <!--v-lazy="p.imgUrl"-->
                  <!--{{ p.imgUrl}}-->
                  <div class="set_bg_img">
                    <img :src=p.imgUrl class="width_height_100">
                  </div>
                  <!--<img :src=p.imgUrl class="product_image" alt="产品图">-->
                  <div class="card_content left_style">
                    <p class="card_title card_title_p">{{p.name}}</p>
                    <p class="card_subtitle margin_top_bottom5 card_title_p">{{p.simpleDescription}}</p>
                    <el-row class="line_height30">
                      <el-col :span="12">
                        <span class="discount_price">¥</span><span
                        class="discount_price">{{p.convertSalePrice}}</span>
                        <!--<span class="origin_price">起</span>&emsp;-->
                      </el-col>
                      <el-col :span="12">
                        <span class="origin_price line" v-if="p.marketPrice !== null">¥</span>
                        <span class="origin_price line">{{p.convertMarketPrice}}</span>
                      </el-col>
                    </el-row>
                    <div v-if= "p.isSupportCoin">
                      <div class="padding_bottom10">
                        <div class="coin_setting">
                          <span class="coin_font padding_right5">¥{{p.payAmount}}+</span>
                          <img class="coin_img" src="../../assets/medicalproduct/jinbi@2x.png" height="40" width="44"/>
                          <span class="coin_font padding_left5">{{p.coinNumber}}金币</span>
                        </div>
                      </div>
                    </div>
                    <div v-else= "!p.isSupportCoin">
                      <div class="padding_bottom10 height_21">
                      </div>
                    </div>
                    <!--<el-row class="line_height30">-->
                      <!--<el-col :span="12">-->
                        <!--<span class="discount_price">¥</span><span-->
                        <!--class="discount_price">{{p.coinNumber}}</span>-->
                      <!--</el-col>-->
                    <!--</el-row>-->
                    <!--<p class="margin_top0_bottom0"><span class="discount_price">¥</span><span-->
                    <!--class="discount_price">{{p.convertSalePrice}}</span><span-->
                    <!--class="origin_price">起</span>&emsp;&emsp;&emsp;<span-->
                    <!--class="origin_price line" v-if="p.marketPrice !== null">¥</span><span-->
                    <!--class="origin_price line">{{p.convertMarketPrice}}</span></p>-->
                  </div>
                </el-card>
              </div>

            </el-col>
          </el-row>
        </el-col>
        <el-col :span="18" v-else>
          <el-row :gutter="40">
            <el-col :span="24">
              <div class="product_div">
                <img src="../../assets/personal/wudingdan_icon@2x.png" height="88" width="" style="margin-top: 20px"/>
                <p class="prompt_placeholder">暂时没有相关产品</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <div class="text_align_left category_font">
            推荐套餐
          </div>
          <el-row>
            <div v-if="recommendData.length !== 0">
              <el-col :span="20" v-for="(recommend, index) in recommendData" :key="index" class="margin_top10 margin_bottom10">
                <div @click="productDetail(recommend.CatalogProduct.id)" class="cursor_pointer">
                  <el-card :body-style="{ padding: '0px' }">
                    <div class="recommend_image">
                      <img :src=recommend.imgUrl class="width_height_100">
                    </div>
                    <div class="card_content card_align">
                      <p class="card_title card_title_p">{{recommend.CatalogProduct.name}}</p>
                      <p class="card_subtitle card_title_p margin_top5 margin_bottom5">{{recommend.CatalogProduct.simpleDescription}}</p>
                      <p class="margin_top0_bottom0"><span class="discount_price">¥</span><span
                        class="discount_price">{{recommend.convertSalePrice}}</span>&emsp;&emsp;
                        <!--<span class="origin_price">起</span>&emsp;-->
                        <span class="origin_price line" v-if="recommend.CatalogProduct.marketPrice !== null">¥</span><span
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
  import Verify from '../../utils/utils';
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        currentPage: 1,
        period: '',
        packageId: '',//套餐类型id
        suitType: [{'id': '', 'packageName': '不限', 'whetherSelect': true}],
        packageFold: true,
        projectId: '',//体检项目id
        projectType: [{'id': '', 'productName': '不限', 'whetherSelect': true}],
        projectFold: true,
        //适用年龄：'0_18'、'18_35'、'35_45'、'45_60'、'60_100'
        ageCategory: [{'id': '', 'period': '不限', 'whetherSelect': true}, {
          'id': 1,
          'period': '0-18',
          'whetherSelect': false
        }, {
          'id': 2, 'period': '18-35', 'whetherSelect': false
        }, {'id': 3, 'period': '35-45', 'whetherSelect': false}, {'id': 4, 'period': '45-60', 'whetherSelect': false}, {
          'id': 5,
          'period': '60-100', 'whetherSelect': false
        }],
        agePeriod: '',
        genderType: [{'id': '', 'gender': '不限', 'whetherSelect': true}, {
          'id': 1,
          'gender': '男',
          'whetherSelect': false
        }, {'id': 2, 'gender': '女', 'whetherSelect': false}],
        gender: '',
        eligibleNumber: 0,//符合条件的个数
        productData: [],
        recommendData: [],
        comprehensive: true,//综合
        salesFlag: false,//销量
        sales: '',//销量，价格排序的入参字段
        priceFlag: false,//价格
        allPrice: '所有价格',
        priceRange: '',//价格区间
        priceRangeFlag: false,
        divWidth:'',
        suitKinds:0,
        projectKinds:0,
      }
    },
    created() {
      //筛选条件
      this.getProductFilterList();
      //产品列表
      this.searchAndList();
      //推荐套餐
      this.getRecommendList();
    },
    mounted(){
      this.$nextTick(() => {
        const eWidth = this.$refs.suitWidth.clientWidth;
        this.divWidth = eWidth;
      })
    },
    computed: {
      ...mapGetters(['searchContent'])
    },
    methods: {
      searchAndList(){
        if (Verify.validateIsNull(this.searchContent)) {
          if (Verify.validateIsNull(this.searchContent.data)){
            if (this.searchContent.data.data.items.length !== 0) {
              this.productData = this.searchContent.data.data.items;
              this.eligibleNumber = this.searchContent.data.data.total;
              for (let i = 0; i < this.searchContent.data.data.items.length; i++) {
                this.productData[i]['convertSalePrice'] = Verify.toDecimal(this.searchContent.data.data.items[i].salePrice);
                this.productData[i]['convertMarketPrice'] = Verify.toDecimal(this.searchContent.data.data.items[i].marketPrice);
                if (Verify.validateIsNull(this.searchContent.data.data.items[i].File)) {
                  this.productData[i]['imgUrl'] = "http://" + this.searchContent.data.data.items[i].File.url;
                }
                this.productData[i]['payAmount'] = Verify.toDecimal(this.searchContent.data.data.items[i].salePrice) - this.searchContent.data.data.items[i].coinNumber;
              }
            }
          }else {
            this.getProductList();
          }
        } else {
          this.getProductList();
        }
      },
      // 体检套餐筛选器加载
      getProductFilterList() {
        let filter = '/api/catalog/product/filter';
        this.$get(filter, {}).then(res => {
          if (res.data.code === 200) {
            // console.log("test" + JSON.stringify(res.data.data));
            //套餐类别data.packageTypes
            for (let i = 0; i < res.data.data.packageTypes.length; i++) {
              let obj = {
                id: res.data.data.packageTypes[i].id,
                packageName: res.data.data.packageTypes[i].name,
                whetherSelect: false
              };
              this.suitKinds += (res.data.data.packageTypes[i].name.length*14+20);
              this.suitType.push(obj);
            }
            // console.log(this.suitKinds)
            // for (let j = 0; j <  this.suitType.length; j++) {
            //   this.suitKinds += (this.suitType[j].packageName.length*14+20);
            // }

            // 检查项目，examinationItems列表
            for (let i = 0; i < res.data.data.examinationItems.length; i++) {
              let obj = {
                id: res.data.data.examinationItems[i].id,
                productName: res.data.data.examinationItems[i].name,
                whetherSelect: false
              };
              this.projectKinds += (res.data.data.examinationItems[i].name.length*14 +20);
              this.projectType.push(obj);
            }
            // for (let j = 0; j <  this.projectType.length; j++) {
            //   this.projectKinds += (this.projectType[j].productName.length*14 +20);
            // }
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //商品分页查询
      getProductList() {
        // let userId = localStorage.getItem("userId");
        // let product = '/api/user/products';
        let product = '/api/catalog/products';
        let data = {
          page: this.currentPage,
        };
        //套餐类型id
        if (Verify.validateIsNull(this.packageId)) {
          data['type'] = this.packageId;
        }
        //体检项目id
        if (Verify.validateIsNull(this.projectId)) {
          data['item'] = this.projectId;
        }
        //适用年龄
        if (Verify.validateIsNull(this.agePeriod)) {
          if (this.agePeriod !== '不限') {
            data['age'] = this.agePeriod;
          }
        }
        //性别
        if (Verify.validateIsNull(this.gender)) {
          data['gender'] = this.gender;
        }
        //销量&价格排序
        if (Verify.validateIsNull(this.sales)) {
          data['sort'] = this.sales;
        }
        //价格范围排序
        if (Verify.validateIsNull(this.priceRange)) {
          data['price'] = this.priceRange;
        }
        this.$get(product, data).then(res => {
          if (res.data.code === 200) {
            // console.log("test" + JSON.stringify(res.data.data));
            this.productData = res.data.data.items;
            this.eligibleNumber = res.data.data.total;
            for (let i = 0; i < res.data.data.items.length; i++) {
              this.productData[i]['convertSalePrice'] = Verify.toDecimal(res.data.data.items[i].salePrice);
              this.productData[i]['convertMarketPrice'] = Verify.toDecimal(res.data.data.items[i].marketPrice);
              if (Verify.validateIsNull(res.data.data.items[i].File)) {
                this.productData[i]['imgUrl'] = "http://" + res.data.data.items[i].File.url;
              }
              this.productData[i]['payAmount'] = Verify.toDecimal(res.data.data.items[i].salePrice) - res.data.data.items[i].coinNumber;
            }
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });

      },
      // 推荐套餐广告位
      getRecommendList() {
        // let userId = localStorage.getItem("userId");
        // let product = '/api/user/products';
        let product = '/api/ad/products/recommendMedicalExaminationPackage';
        this.$get(product, {}).then(res => {
          if (res.data.code === 200) {
            this.recommendData = res.data.data;
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
      productDetail(id) {
        this.$router.push({path: '/MedicalProductDetail', query: {productId: id}})
      },
      //选择套餐的选择状态
      selectPackageType(params) {
        params.whetherSelect = !params.whetherSelect;
        if (params.whetherSelect === true) {
          this.packageId = params.id;
        } else {
          this.packageId = '';
        }
        //筛选出当前选中的索引，让其他处于未选中状态（单选）
        const index = this.suitType.findIndex(val => val.packageName === params.packageName);
        // console.log('text=='+this.projectType[index].productName+'index='+index+this.projectType[index].id);
        for (let i = 0; i < this.suitType.length; i++) {
          //重复点击（2次）当前选项，状态改为未选中，且当前选中是"不限"
          if (this.packageId === '') {
            this.suitType[0].whetherSelect = true;
            this.suitType[i].whetherSelect = false;
          } else {
            if (i === index) {
              this.suitType[i].whetherSelect = true;
            } else {
              this.suitType[i].whetherSelect = false;
            }
          }
        }
        this.getProductList();
      },
      //选择套餐的展开收起
      changePackageFoldState() {
        this.packageFold = !this.packageFold;
      },
      //选择项目的选择状态
      selectProductType(params) {
        params.whetherSelect = !params.whetherSelect;
        // this.projectType[0].whetherSelect = false;
        if (params.whetherSelect === true) {
          this.projectId = params.id;
        } else {
          this.projectId = '';
        }
        //筛选出当前选中的索引，让其他处于未选中状态（单选）
        const index = this.projectType.findIndex(val => val.productName === params.productName);
        for (let i = 0; i < this.projectType.length; i++) {
          //重复点击（2次）当前选项，状态改为未选中，且当前选中是"不限"
          if (this.projectId === '') {
            this.projectType[0].whetherSelect = true;
            this.projectType[i].whetherSelect = false;
          } else {
            if (i === index) {
              this.projectType[i].whetherSelect = true;
            } else {
              this.projectType[i].whetherSelect = false;
            }
          }

        }
        this.getProductList();
      },
      //选择产品展开、收起
      changeProductFoldState() {
        // this.projectFold= false;
        this.projectFold = !this.projectFold;
      },
      //  选择年龄段
      selectAgePeriod(params) {
        params.whetherSelect = !params.whetherSelect;
        if (params.whetherSelect === true) {
          this.agePeriod = params.period;
        } else {
          this.agePeriod = '';
        }
        // console.log("123=="+this.agePeriod);
        //筛选出当前选中的索引，让其他处于未选中状态（单选）
        const index = this.ageCategory.findIndex(val => val.period === params.period);
        for (let i = 0; i < this.ageCategory.length; i++) {
          //重复点击（2次）当前选项，状态改为未选中，且当前选中是"不限"
          if (this.agePeriod === '') {
            this.ageCategory[0].whetherSelect = true;
            this.ageCategory[i].whetherSelect = false;
          } else {
            if (i === index) {
              this.ageCategory[i].whetherSelect = true;
            } else {
              this.ageCategory[i].whetherSelect = false;
            }
          }
        }
        this.getProductList();
      },
      //  选择性别
      selectGender(params) {
        params.whetherSelect = !params.whetherSelect;
        if (params.whetherSelect === true) {
          this.gender = params.id;
        } else {
          this.gender = '';
        }
        // console.log("selectGender=="+this.gender);
        //筛选出当前选中的索引，让其他处于未选中状态（单选）
        const index = this.genderType.findIndex(val => val.gender === params.gender);
        for (let i = 0; i < this.genderType.length; i++) {
          if (this.gender === '') {
            this.genderType[0].whetherSelect = true;
            this.genderType[i].whetherSelect = false;
          } else {
            if (i === index) {
              this.genderType[i].whetherSelect = true;
            } else {
              this.genderType[i].whetherSelect = false;
            }
          }
        }
        this.getProductList();
      },
      //综合排序
      comprehensiveOrder() {
        this.comprehensive = true;
        this.salesFlag = false;
        this.priceFlag = false;
        this.priceRangeFlag = false;
        this.sales = '';
        this.getProductList();
      },
      //销量排序
      salesOrder() {
        this.comprehensive = false;
        this.salesFlag = !this.salesFlag;
        this.priceFlag = false;
        this.priceRangeFlag = false;
        if (this.sales === '') {
          this.sales = 'sales-asc'; //升序
        } else if (this.sales === 'sales-asc') {
          this.sales = 'sales-desc'; //降序
        } else if (this.sales === 'sales-desc') {
          this.sales = 'sales-asc'; //升降序
        }
        this.getProductList();
      },
      //价格排序
      priceOrder() {
        this.comprehensive = false;
        this.salesFlag = false;
        this.priceFlag = !this.priceFlag;
        this.priceRangeFlag = false;

        if (this.sales === '') {
          this.sales = 'price-asc'; //升序
        } else if (this.sales === 'price-desc') {
          this.sales = 'price-asc'; //升序
        } else if (this.sales === 'price-asc') {
          this.sales = 'price-desc'; //降序
        }
        this.getProductList();
      },
      handleCommand(command) {
        this.comprehensive = false;
        this.salesFlag = false;
        this.priceFlag = false;
        this.priceRangeFlag = !this.priceRangeFlag;
        if (command === "0"){
          this.allPrice = '不限';
          this.priceRange = '';
        } else{
          this.priceRange = command;
          this.allPrice = command;
        }
        // this.priceRange = command;
        this.getProductList();
      }
    },
    watch:{
      'searchContent'(newValue,oldValue){
        console.log(newValue)
        this.searchAndList();
        /*写一些函数调用方法，比如分页*/
      },
    }
  }
</script>
<style>
  @import "../../styles/personal/personal-center.scss";

  .line_height38 {
    line-height: 38px;
  }
  .line_height21{
    line-height: 21px;
  }

  .category {
    border: 1px solid #EEEEEE;
    background-color: #ffffff;
  }

  .category_font {
    color: #333333;
    font-size: 14px;
    /*line-height: 35px;*/
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
  /*写全局不太好使，于是写了内样式*/
  .ul_row{
    white-space: nowrap;
    height: 30px;
    overflow: hidden;
  //text-overflow: ellipsis;
  }
  .ul_show{
    height: auto;
    overflow: initial;
  }

  /* 所有class为menu的div中的ul中的li样式 */
  div.category ul li {
    float: left; /* 向左漂移，将竖排变为横排 */
  }

  .div_bottom {
    border-bottom: 1px solid #EEEEEE;
  }

  .margin_top5 {
    margin-top: 5px;
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
    margin-top: 8px;
    margin-bottom: 5px;
  }

  .card_align {
    text-align: left;
    padding-left: 10px;
    line-height: 30px;
  }

  .set_bg_img {
    /*background-color: lightgrey;*/
    height: 143px;
    width: 191px;
  }

  .recommend_image {
    width: 100%;
  }

  .bgColor {
    background-color: rgb(51, 178, 232);
    border-radius: 3px;
    color: white;
    padding-left: 5px;
    padding-right: 5px;
  }

  .product_div {
    height: 660px;
    background-color: white;
    text-align: center;
  }

  .margin_top_bottom5 {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .left_style {
    text-align: left;
    padding-left: 12px;
  }

  .mouse_pointer {
    cursor: pointer;
  }

  .el-button--primary:focus, .el-button--primary:hover {
    border-width: 1px;
  }
  .height_21{
    height: 21px;
  }

</style>
