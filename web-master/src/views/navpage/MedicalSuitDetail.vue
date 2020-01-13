<template>
  <div class="margin_left_right white_bg_color">
    <div>
      <hr class="suit_hr_color">
      <el-row>
        <el-col :span="6">
          <div class="suit_border">
            <img :src=imageUrl class="width_height_100" alt="图片">
          </div>

        </el-col>
        <el-col :span="18" class="text_align_left padding_left10">
          <p class="sub_font">由<span class="special_font">{{medicalCenter}}</span>提供</p>
          <p class="title_font">{{productName}}</p>
          <el-row>
            <el-col :span="3">
              <p class="sub_font">适用人群</p>
            </el-col>
            <el-col :span="18">
              <p class="regular_font ">{{suitSex===0?'男性、女性':(suitSex===1?'男性':'女性')}}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <p class="sub_font">套餐特点</p>
            </el-col>
            <el-col :span="18">
              <p class="regular_font">{{packageDescription}}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <p class="sub_font">价格</p>
            </el-col>
            <el-col :span="18">
              <p class="margin_top0_bottom0"><span class="discount_price">¥</span><span
                class="discount_price">{{salePrice}}</span>&emsp;&emsp;&emsp;<span
                class="origin_price line" v-if="marketPrice !== null">¥</span><span class="origin_price line">{{marketPrice}}</span>
              </p>
            </el-col>
          </el-row>
          <!--<span class="origin_price">起</span>-->
          <!--金币-->
          <el-row v-if= "isSupportCoin">
            <el-col :span="3">
              <p class="sub_font">兑换价</p>
            </el-col>
            <el-col :span="18">
              <div>
                <div class="padding_bottom10">
                  <div class="coin_setting">
                    <span class="coin_font padding_right5">¥{{payAmount}}+</span>
                    <img class="coin_img" src="../../assets/medicalproduct/jinbi@2x.png" height="40" width="44"/>
                    <span class="coin_font padding_left5">{{coinNumber}}金币</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <p class="sub_font">数量</p>
            </el-col>
            <el-col :span="18">
              <el-input-number v-model="shoppingCart" @change="cartHandleChange" :min="1" :max="100"
                               label="描述文字"></el-input-number>
            </el-col>
          </el-row>
          <el-row class="margin_top15">
            <el-col :span="6" class="add_cart">
              <el-button size="medium" :style="[defaultFont]" class="default_font" :class="{clickFont:active}" @click="addCart($event)">加入购物车
              </el-button>
              <shop-cart-balls ref="shopCartBalls"></shop-cart-balls>
              <i class="box iconfont icon-shangpinguanli" ref="cart"></i>
            </el-col>
            <el-col :span="12" class="add_cart">
              <el-button size="medium" class="default_font" :class="{clickFont:active}">立即购买</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="margin_top15">
      <el-row :gutter="25">
        <el-col :span="19" class="suit_tab">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="套餐详细" name="first">
              <div class="text_align_left padding_left10">
                <p class="second_font">套餐属性</p>
                <el-row>
                  <el-col :span="3">
                    <p class="sub_font">适用人群</p>
                  </el-col>
                  <el-col :span="18">
                    <p class="regular_font ">{{suitSex===0?'男性、女性':(suitSex===1?'男性':'女性')}}</p>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="3">
                    <p class="sub_font">套餐特点</p>
                  </el-col>
                  <el-col :span="18">
                    <p class="regular_font">{{packageDescription}}</p>
                  </el-col>
                </el-row>
                <p class="second_font">套餐项目</p>
                <div class="">
                  <el-table
                    :data="packageItems"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :header-cell-style="tableHeaderColor" class="padding_left10">
                    <el-table-column
                      prop="id"
                      label="ID">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="基础检查项目">
                    </el-table-column>
                    <el-table-column
                      prop="description"
                      label="检查目的">
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="机构介绍" name="second">
              <div>
                <div class="store_info">
                  <el-row>
                    <el-col :span="6" >
                      <div class="padding10">
                        <img :src=introImageUrl class="width_height_100"/>
                      </div>

                    </el-col>
                    <el-col :span="18" class="text_align_left">
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
                      </div>
                    </el-col>
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
                  <p class="stores_introduce">{{institutionLocate}}</p>
                  <div>
                    <img :src=introLocateImageUrl height="402" alt="位置图"/></div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="更多产品" name="third">
              <div>
                <div class="store_info" v-if="moreInstitute.length !== 0">
                  <el-row v-for="(institute,index) in moreInstitute" :key=index>
                    <el-col :span="6" class="padding10">
                      <div class="">
                        <img :src=institute.imageUrl class="width_height_100" alt="机构图片"/>
                      </div>

                    </el-col>
                    <el-col :span="18" class="text_align_left">
                      <div>
                        <p class="stores_name">{{institute.name}}<span
                          @click="selectOrganization(institute.MedicalExaminationPackage.MedicalCenter.manufacturerId)"
                          v-if="institute.MedicalExaminationPackage !== null"><u
                          class="special_font select_institution cursor_pointer">选择该机构</u></span>
                        </p>
                        <p class="regular_font">
                          <img class="icon_img" src="../../assets/medicalproduct/didian_tjcp_jgjs@2x.png" height="18"
                               width="18"/>
                          <span>{{institute.joiningAddress}}</span>
                        </p>
                        <p class="regular_font"
                           v-if="institute.MedicalExaminationPackage">
                          <img class="icon_img" src="../../assets/medicalproduct/dianhua_tjcp_jgjs@2x.png" height="18"
                               width="18"/>
                          {{institute.MedicalExaminationPackage.MedicalCenter.phoneNumber}}</p>
                        <p class="regular_font" v-if="institute.MedicalExaminationPackage !== null">
                          <img class="icon_img" src="../../assets/medicalproduct/shijian_tjcp_jgjs@2x.png" height="18"
                               width="18"/>
                          {{institute.businessHours}}
                        </p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div v-else class="more_div">
                  <img src="../../assets/personal/wudingdan_icon@2x.png" height="88" width="" style="margin-top: 20px"/>
                  <p class="prompt_placeholder">暂时没有相关产品</p>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="5">
          <div class="text_align_left regular_font">
            推荐套餐
          </div>
          <el-row>
            <div v-if="recommendData.length !== 0">
              <el-col :span="20" v-for="(recommend, index) in recommendData" :key="index"
                      class="margin_top10 padding_left_right0 cursor_pointer">
                <div @click="suitDetail(recommend.CatalogProduct.id)">
                  <el-card :body-style="{ padding: '0px' }">
                    <div class="recommend_image">
                      <img :src=recommend.imgUrl class="width_height_100" alt="套餐图片">
                    </div>
                    <div class="card_content card_align">
                      <p class="card_title card_title_p">{{recommend.CatalogProduct.name}}</p>
                      <p class="card_subtitle card_title_p margin_top5 margin_bottom5">
                        {{recommend.CatalogProduct.simpleDescription}}</p>
                      <p class="margin_top0_bottom0">
                        <el-row :gutter="20">
                          <el-col :span="12">
                            <span class="suit_discount_price">¥</span><span
                            class="suit_discount_price">{{recommend.convertSalePrice}}</span>
                          </el-col>
                          <el-col :span="12">
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
          </el-row>
        </el-col>
      </el-row>

    </div>
  </div>
   
</template>
<script>
  import Verify from '../../utils/utils';
  import Cookies from 'js-cookie';
  import {mapGetters} from 'vuex';
  import ShopCartBalls from '../../../src/components/cart/ShopCartBalls'

  export default {
    components: {ShopCartBalls},
    data() {
      return {
        defaultFont:'default_font',
        goodsDetail: '',
        imageUrl: '',
        medicalCenter: '',//体检中心
        productName: '',//名称
        suitSex: 0,//1男 2女 0男女
        salePrice: '',//销售价
        coinNumber: 0,//金币
        payAmount:0,// 金币兑换价
        isSupportCoin: false, // 是否支持使用金币
        marketPrice: 0,
        packageDescription: '',//套餐描述
        institutionId: '',//机构id
        packageItems: [],//体检项目
        shoppingCart: 1,
        active: false,
        activeName: 'first',
        tableData: [],
        storesName: '慈铭体检中心',
        storesAddress: '',
        storePhone: '4001-1211-00',
        businessHours: '',
        description: 'XXXX',//机构简介
        introImageUrl: '',// 机构图片
        introLocateImageUrl: '',//机构位置图片
        institutionLocate: '地址：福建泉州市丰泽区清源山下第910医院',
        recommendData: [],
        moreInstitute: [],
        addressData: '',
        cartList: {},//存购物List车基本信息
        goodsId: '',
        productInfo: [],
        total: 0,
        saveTotal: 0,

      }
    },
    created() {
      this.getDetailInfo();
      this.getRecommendList();//推荐套餐列表
      this.getCityData();
      //获取更多体检机构
      // this.getMoreInstitution();
    },
    methods: {
      //获取产品信息详情
      getDetailInfo() {
        let self = this;
        let url = '/api/catalog/product/' + this.$route.query.productId;
        self.$get(url, {}).then(res => {
          if (res.data.code === 200) {
            // console.log("detail==" + JSON.stringify(res.data));
            let productDetail = res.data.data;
            self.goodsDetail = productDetail;
            if (Verify.validateIsNull(productDetail.File)) {
              self.imageUrl = 'http://' + productDetail.File.url;
            }
            self.medicalCenter = productDetail.MedicalExaminationPackage.MedicalCenter.CatalogManufacturer.name;
            self.productName = productDetail.name;
            self.salePrice = Verify.toDecimal(productDetail.salePrice);
            // 金币
            self.coinNumber = productDetail.coinNumber;
            self.isSupportCoin = productDetail.isSupportCoin;
            self.payAmount = self.salePrice - self.coinNumber;
            self.goodsId = productDetail.id;
            self.marketPrice = Verify.toDecimal(productDetail.marketPrice);
            self.packageDescription = productDetail.simpleDescription;
            // this.institutionId = productDetail.centerId;
            let medicalExaminationPackage = productDetail.MedicalExaminationPackage;
            self.suitSex = medicalExaminationPackage.gender;
            //商品关联到体检套餐、套餐再关联到检查项目
            self.packageItems = medicalExaminationPackage.ExaminationPackageItems;
            //机构介绍
            self.storesName = medicalExaminationPackage.MedicalCenter.MedicalOrganization.name;
            let introProvince = medicalExaminationPackage.MedicalCenter.province;
            let introCity = medicalExaminationPackage.MedicalCenter.city;
            let introCounty = medicalExaminationPackage.MedicalCenter.county;
            //判断取到的省份是编码还是汉字（处理数据时汉字和编码的两种情况）
            if (introProvince.startsWith('1') || introProvince.startsWith('2') || introProvince.startsWith('3') || introProvince.startsWith('4') ||
              introProvince.startsWith('5') || introProvince.startsWith('6') || introProvince.startsWith('7') || introProvince.startsWith('8')) {
              self.storesAddress = this.addressData['86'][introProvince] + this.addressData[introProvince][introCity] + this.addressData[introCity][introCounty] + medicalExaminationPackage.MedicalCenter.address;
            } else {
              self.storesAddress = medicalExaminationPackage.MedicalCenter.province + medicalExaminationPackage.MedicalCenter.city + medicalExaminationPackage.MedicalCenter.county + medicalExaminationPackage.MedicalCenter.address;
            }
            if (Verify.validateIsNull(medicalExaminationPackage.MedicalCenter.CatalogManufacturer.File)) {
              //机构logo图片
              self.introImageUrl = 'http://' + medicalExaminationPackage.MedicalCenter.CatalogManufacturer.File.url;
            }
            if (Verify.validateIsNull(medicalExaminationPackage.MedicalCenter.LocationFile)) {
              //机构位置图片
              self.introLocateImageUrl = 'http://' + medicalExaminationPackage.MedicalCenter.LocationFile.LocationFile;
            }
            self.storePhone = medicalExaminationPackage.MedicalCenter.telephone;
            let hours = medicalExaminationPackage.MedicalCenter.businessHours.split('-');
            self.businessHours = Verify.convertDate(hours[0]) + '—' + Verify.convertDate(hours[1]);
            self.description = medicalExaminationPackage.MedicalCenter.introduce;
            self.institutionLocate = self.storesAddress;
            //更多机构
            if (productDetail.parentGroupProductId) {
              self.moreInstitute = productDetail.Groups;
              for (let i = 0; i < productDetail.Groups.length; i++) {
                // console.log("1111111=" + JSON.stringify(productDetail.Groups[i].MedicalExaminationPackage))
                if (Verify.validateIsNull(productDetail.Groups[i].MedicalExaminationPackage)) {
                  let province = productDetail.Groups[i].MedicalExaminationPackage.MedicalCenter.province;
                  let city = productDetail.Groups[i].MedicalExaminationPackage.MedicalCenter.city;
                  let county = productDetail.Groups[i].MedicalExaminationPackage.MedicalCenter.county;
                  // console.log(province.startsWith('1'));
                  //判断取到的省份是编码还是汉字（处理数据时汉字和编码的两种情况）
                  if (province.startsWith('1') || province.startsWith('2') || province.startsWith('3') || province.startsWith('4') ||
                    province.startsWith('5') || province.startsWith('6') || province.startsWith('7') || province.startsWith('8')) {
                    self.moreInstitute[i]['joiningAddress'] = self.addressData['86'][province] + self.addressData[province][city] + self.addressData[city][county];
                  } else {
                    self.moreInstitute[i]['joiningAddress'] = province + city + county;
                  }
                  if (Verify.validateIsNull(productDetail.Groups[i].MedicalExaminationPackage.MedicalCenter.CatalogManufacturer.File)) {
                    self.moreInstitute[i]['imageUrl'] = 'http://' + productDetail.Groups[i].MedicalExaminationPackage.MedicalCenter.CatalogManufacturer.File.url;
                  }
                  let insituteHours = productDetail.Groups[i].MedicalExaminationPackage.MedicalCenter.businessHours.split('-');
                  self.moreInstitute[i]['businessHours'] = Verify.convertDate(insituteHours[0]) + '—' + Verify.convertDate(insituteHours[1]);
                }
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
                  self.$router.push({path: '/Login'})
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
      // 推荐套餐广告位
      getRecommendList() {
        // let userId = localStorage.getItem("userId");
        // let product = '/api/user/products';
        let product = '/api/ad/products/recommendMedicalExaminationPackage';
        this.$get(product, {}).then(res => {
          if (res.data.code === 200) {
            console.log("test" + JSON.stringify(res.data.data));
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
      //跳转机构详情页面
      selectOrganization(id) {
        // this.$router.push({ path: '/MedicalProductDetail',query:{productId:id}});
        this.$router.push({path: '/MedicalInstitutionDetail', query: {institutionId: id}})
      },
      cartHandleChange(value) {
        console.log(value);
      },
      //套餐详情
      suitDetail(id) {
        this.$router.push({path: '/MedicalProductDetail', query: {productId: id}})
      },
      addCart(event) {
        //登录状态 1：登录 0：未登
        if (localStorage.getItem('loginStatus') == 1) {
          this.active = true;
          let url = '/api/cart';
          this.$post(url, {
            product: this.$route.query.productId,
            amount: this.shoppingCart
          }).then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: '已加入购物车',
                type: 'success'
              });
              // console.log("cart==" + JSON.stringify(res.data));
            } else {
              alert(res.data.msg);
            }
          }).catch(function (reason) {
            // this.$message.error('请稍候重试');
            console.log('catch:', reason);
          });
        } else {
          this.cartList['productId'] = this.goodsId;
          this.cartList['goodImageUrl'] = this.imageUrl;
          this.cartList['productName'] = this.productName;
          this.cartList['marketPrice'] = this.marketPrice;
          this.cartList['salePrice'] = this.salePrice;
          this.cartList['amount'] = this.shoppingCart;//数量
          this.cartList['subtotal'] = this.salePrice * this.shoppingCart;
          this.cartList['total'] = Verify.toDecimal(this.salePrice * this.shoppingCart); //小计
          if (Verify.validateIsNull(this.marketPrice)) {
            this.saveTotal = (this.marketPrice - this.salePrice) * this.shoppingCart;
          }
          this.cartList['sumMoney'] = Verify.toDecimal(this.cartList['subtotal']);//总金额
          this.cartList['saveMoney'] = Verify.toDecimal(this.saveTotal);//节省金额
          // Cookies.remove('shoppingCartList');
          // console.log('1==' + Cookies.get('shoppingCartList'));
          if (Verify.validateIsNull(Cookies.get('shoppingCartList'))) {
            this.productInfo = JSON.parse(Cookies.get('shoppingCartList'));
          }
          if (this.productInfo.length !== 0) {
            const index = this.productInfo.findIndex(val => val.productId === this.goodsId);
            if (index !== -1) {
              //考虑的是加入同一件商品，数量增加；反之，计算total
              console.log(`购物车非空且原来存在这个商品`)
              this.productInfo[index].amount += this.cartList['amount'];
              this.productInfo[index].subtotal = Verify.toDecimal(this.productInfo[index].salePrice * this.productInfo[index].amount);
              this.productInfo[index].total = Verify.toDecimal(this.productInfo[index].salePrice * this.productInfo[index].amount);
              this.productInfo[index].sumMoney = this.productInfo[index].subtotal;
              if (Verify.validateIsNull(this.productInfo[index].marketPrice)) {
                this.saveTotal += (this.productInfo[index].marketPrice - this.productInfo[index].salePrice) * this.productInfo[index].amount;
              }
              this.productInfo[index].saveMoney = Verify.toDecimal(this.saveTotal);
              Cookies.set('shoppingCartList', this.productInfo, {expires: 1, path: 'localhost'});
              this.$message({
                message: '已加入购物车',
                type: 'success'
              });
            } else {
              console.log(`cart=`+JSON.stringify(this.cartList))
              this.productInfo.push(this.cartList);
              Cookies.set('shoppingCartList', this.productInfo, {expires: 1, path: 'localhost'});
              this.$message({
                message: '已加入购物车',
                type: 'success'
              });
            }

            //  方法二 用flag来标记是否存在相同的产品
            // let flag = false;
            // for (let i = 0; i < this.productInfo.length; i++) {
            //   //考虑的是加入同一件商品，数量增加；反之，计算total
            //   if (this.productInfo[i].productId == this.goodsId) {
            //     flag = true;
            //     this.productInfo[i].amount += this.cartList['amount'];
            // }
            // if (flag == false) {
            //   this.productInfo.push(this.cartList);
            //   Cookies.set('shoppingCartList', this.productInfo, {expires: 1, path: 'localhost'});
            // }
          } else {
            console.log(`购物车为空`)
            this.productInfo.push(this.cartList);
            Cookies.set('shoppingCartList', this.productInfo, {expires: 1, path: 'localhost'});
            this.$message({
              message: '已加入购物车',
              type: 'success'
            });
          }

          this.$store.dispatch('setShopCartCache', this.productInfo);
          // console.log('02==', Cookies.get('shoppingCartList'));
        }
        // 调子组件的drop方法(备注：曲线坐标有问题)
        // this.$refs.shopCartBalls.drop(event.target);
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
      //读取城市的本地json
      getCityData() {
        const config = require('../../../static/region.json');
        this.addressData = config;
      }
    }
  }
</script>
<style>
  @import "../../styles/personal/personal-center.scss";

  .margin_left_right {
    margin-left: 19%;
    margin-right: 19%;
  }

  .suit_hr_color {
    height: 2px;
    background-color: #e6e6e6;
    border: none;
  }

  .suit_border {
    margin-top: 10px;
    border: 1px solid #e6e6e6;
    background-color: #EEEEEE;
    width: 200px;
    height: 150px;
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

  .default_font {
    background-color: #FFECED;
    color: #DF2321;
    border: 1px solid #DF2321;
  }
  .default_font:hover{
    background-color: #FFECED;
    color: #DF2321;
    border: 1px solid #DF2321;
  }
  .default_font:focus{
    background-color: #DF2321;
    color: #ffffff;
  }
  .clickFont {
    background-color: #DF2321;
    color: #ffffff;
  }
  .tab_bg_color {
    border: 1px solid rgba(238, 238, 238, 1);
    background-color: #EEEEEE;
  }

  /*机构介绍的样式*/
  .institution_img {
    width: 100%;
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
  }

  .stores_introduce {
    font-size: 12px;
    color: #666666;
  }

  .select_institution {
    float: right;
    padding-right: 10px;
  }

  .recommend_image {
    width: 100%;
  }

  .more_div {
    border: 1px solid #e6e6e6;
    height: 300px;
    background-color: white;
    text-align: center;
  }

  /*设置tab选中的样式*/
  .suit_tab .el-tabs__item:hover {
    color: #009BDD;
  }

  .suit_tab .el-tabs__item.is-active {
    color: #009BDD;
  }

  .suit_tab .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-top: 2px solid #009BDD;
    /*border-bottom: 0px solid #009BDD;*/
  }

</style>


