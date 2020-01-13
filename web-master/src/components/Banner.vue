<template>
  <el-container>
    <div class="banner">
      <el-row :gutter="10">
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="text_align_left margin_top5">
          <span>神州四达旗下品牌</span>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="text_align_left margin_top5">
            <span>{{currentCity}}</span>
            <span>|</span>
            <el-popover
              placement="bottom"
              width="400"
              trigger="click">
              <div style="height: 200px;overflow-y:auto">
                <ul class="ul_name">
                  <li v-for="(value,key,index) in city" :key="key" class="li_name" :class="activeClass == index ? 'active':''">
                    <a v-text="value" @click="chooseCity(value,key,index)"></a>
                  </li>
                </ul>
              </div>
              <span class="el-dropdown-link" style="cursor: pointer" slot="reference">
            更多城市<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            </el-popover>
            <!--下拉框-->
            <!--<el-dropdown>-->
          <!--<span class="el-dropdown-link">-->
            <!--更多城市<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
          <!--</span>-->
              <!--<el-dropdown-menu slot="dropdown" style="height: 200px;overflow-y:auto">-->
                <!--<el-dropdown-item v-for="(value,key) in city" :key="key" @click="chooseCity(value,key)" :command='key'>-->
                  <!--{{value}}-->
                <!--</el-dropdown-item>-->
              <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
          </div>
        </el-col>
        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
          <div class="text_align_right margin_top5">
            <span>您好，欢迎您</span>
            <span v-if="loginStatus !=1">
              <router-link :to="{path:'/Login'}" active-class="active" class="login_status_btn">
                登录
              </router-link>
              <span>或</span>
              <router-link :to="{path:'/Login'}" active-class="active" class="login_status_btn">
                免费注册
              </router-link>
            </span>
            <span v-else="loginStatus==1">
              <router-link :to="{path:'/Login'}" active-class="active" class="login_status_btn">
                退出登录
              </router-link>
            </span>
          </div>
        </el-col>
        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="">
          <el-row :gutter="20">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <div class="text_align_right margin_top5">
                <div @click="myOrderEvent()" style="cursor: pointer;">
                  我的订单
                </div>
              </div>

            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <div @click="cart()">
                <el-popover
                  placement="bottom"
                  width="350"
                  trigger="click">
                  <div style="overflow-y: auto;height: 250px" v-if="cartData.length !==0" >
                    <div v-for="(o, index) in cartData" :key="index">
                      <el-row>
                        <el-col :span="8">
                          <!--<div style="width:80px;height: 80px;background-color: #F6F6F6"></div>-->
                          <img :src=o.goodImageUrl class="good_img"/>
                        </el-col>
                        <el-col :span="8">
                          <p class="cart_order_title text_align_left">{{o.productName}}</p>
                        </el-col>
                        <el-col :span="8" >
                          <p class="cart_price">¥{{o.salePrice}}×{{o.amount}}</p>
                          <div class="del_goods">
                            <el-button type="text" class="cart_price" @click="deleteGoods(o)">删除</el-button>
                          </div>

                        </el-col>
                      </el-row>
                    </div>
                    <el-row class="bottom_div">
                      <el-col :span="12">
                        <p>共{{goodsNum}}件商品，共计¥{{sumMoney}}</p>
                        <!--<p>共{{o.amount}}件商品，共计¥{{o.amount*o.product.salePrice}}</p>-->
                      </el-col>
                      <el-col :span="12" class="text_align_right" id="cart_list_btn">
                        <el-button type="danger" @click="goCart()">查看购物车</el-button>
                      </el-col>
                    </el-row>

                  </div>
                  <div style="overflow-y: auto;height: 50px" v-if="cartData.length ===0">
                    <el-col :span="12">
                      <p>共{{goodsNum}}件商品，共计¥{{sumMoney}}</p>
                      <!--<p>共{{o.amount}}件商品，共计¥{{o.amount*o.product.salePrice}}</p>-->
                    </el-col>
                    <el-col :span="12" class="text_align_right cart_page">
                      <el-button type="danger" class="cart_btn" @click="goCart()">查看购物车</el-button>
                    </el-col>
                  </div>
                  <el-button slot="reference" type="text" class="cart_link">购物车</el-button>
                  <!--<shop-cart-balls ref="ball"></shop-cart-balls>-->
                </el-popover>
                <!--<router-link :to="{path:'/ShoppingCart'}" active-class="active" class="login_btn" @click="cart()">-->

                <!--</router-link>-->
                <!--<el-button type="text" @click="cart()">购物车</el-button>-->
              </div>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <div class="text_align_left margin_top5" style="cursor: pointer;" @click="judgeParam()">
                <div v-if="(enterpriseId === 'undefined') ||  (enterpriseId === null)" @click="personCenter()">个人中心</div>
                <div  v-else-if="(userId === 'undefined') || (userId === null)" @click="firmCenter()">企业中心</div>

              </div>
            </el-col>
          </el-row>
        </el-col>

      </el-row>
    </div>
  </el-container>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Verify from '../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import Cookies from 'js-cookie';
  // import ShopCartBalls from '../../src/components/cart/ShopCartBalls'

  export default {
    name: "Banner",
    // components:{
    //   ShopCartBalls
    // },
    data() {
      return {
        currentCity:'北京市',
        loginStatus: '0',
        userId: '',
        enterpriseId: '',
        price: '180',
        goodsNum: 0,
        sumMoney: 0,
        city: '',
        activeClass: 0,
        cartData: [],
      }
    },
    created() {
      this.loginStatus = localStorage.getItem("loginStatus");
      this.enterpriseId = localStorage.getItem("enterpriseId");
      this.userId = localStorage.getItem("userId");
      this.getCityData();
      // if (localStorage.getItem('loginStatus') == 1) {
      // this.synchronousGoodsList();
      this.shopCartList();

      // localStorage.setItem("setProvinceCode",'110000');
      if (Verify.validateIsNull(localStorage.getItem("setProvinceCode"))){
        this.currentCity =  this.city[localStorage.getItem("setProvinceCode")];
      }
      console.log(' this.loginStatus==' + this.loginStatus + "enterpriseId==" + this.enterpriseId + "userId==" + this.userId)
    },
    computed: {
      ...mapGetters(['cartParams','shopCartCache'])
    },
    watch:{
      //监听购物车数据
      // cartData:function(newValue,oldValue){
      //   console.log(newValue,oldValue);
      //   this.shopCartList();
      // },
      // deep:true
    },
    methods: {
      //购物车列表
      shopCartList() {
        //登录状态 1：登录 0：未登录
        if (localStorage.getItem('loginStatus') == 1){
          let url = '/api/carts';
          let total = 0;
          this.$get(url, {}).then(res => {
            if (JSON.stringify(res.data.code) == 200) {
              this.sumMoney = 0;
              this.goodsNum = 0;
              this.cartData = res.data.data.items;
              // console.log(res.data.data[0].product.salePrice);
              for (let i=0;i<res.data.data.items.length;i++){
                this.cartData[i]['productId'] = res.data.data.items[i].product.id;
                this.cartData[i]['productName'] = res.data.data.items[i].product.name;
                this.cartData[i]['salePrice'] = Verify.toDecimal(res.data.data.items[i].product.salePrice);
                // this.cartData[i]['goodImageUrl'] = 'http://'+res.data.data.items[i].product.imageUrl;
                if (Verify.validateIsNull(res.data.data.items[i].product.File)){
                  this.cartData[i]['goodImageUrl'] = 'http://' + res.data.data.items[i].product.File.url;
                }
                this.cartData[i]['subtotal'] = res.data.data.items[i].product.salePrice*res.data.data.items[i].amount;
                this.goodsNum +=res.data.data.items[i].amount;
                // this.sumMoney += Math.round(this.cartData[i]['subtotal']*100)/100.00;
                // this.sumMoney += parseFloat(this.cartData[i]['subtotal']).toFixed(2);
                total += this.cartData[i]['subtotal'];
              }
              this.sumMoney = Verify.toDecimal(total);
              // this.sumMoney = this.sumMoney+ this.cartData[i].amount * this.cartData[i].salePrice;
              console.log("cart==" + JSON.stringify(this.cartData));
            } else {
              alert(res.data.msg);
            }
          }).catch(function (reason) {
            console.log('catch:', reason);
          });
        }else {
          this.synchronousGoodsList();
          //如果this.shopCartCache存在，则读取Vuex的值，如果不存在，则读取Cookie的值
          if (Verify.validateIsNull(this.shopCartCache)){
            this.cartData = this.shopCartCache;
          } else if (Verify.validateIsNull(Cookies.get('shoppingCartList'))) {
            this.cartData = JSON.parse(Cookies.get('shoppingCartList'));
          }
          //计算商品件数和总金额
          if (Verify.validateIsNull(this.cartData)) {
            this.goodsNum = 0;
            this.sumMoney = 0;
            for (let i=0;i<this.cartData.length;i++){
              this.goodsNum +=this.cartData[i].amount;
              this.sumMoney = this.sumMoney+ this.cartData[i].amount * this.cartData[i].salePrice;
            }
            this.sumMoney = Verify.toDecimal(this.sumMoney);
          }
          console.log(this.cartData);
        }
        // this.$router.push({path: '/ShoppingCart'});
        // this.$store.dispatch('setCartParams', 'cart');
      },
      //同步商品
      synchronousGoodsList() {
        if (localStorage.getItem('loginStatus') == 1) {
          if (Verify.validateIsNull(this.shopCartCache)) {
            this.cartData = this.shopCartCache;
          } else if (Verify.validateIsNull(Cookies.get('shoppingCartList'))) {
            this.cartData = JSON.parse(Cookies.get('shoppingCartList'));
            let carts = [];
            for (let i = 0; i < this.cartData.length; i++) {
              let data = {
                product: this.cartData[i].productId,
                amount: this.cartData[i].amount
              };
              carts.push(data);
            }
            console.log('this.cartData==' + JSON.stringify(carts));
            let url = '/api/carts';
            this.$post(url, {
              carts: carts
            }).then(res => {
              if (JSON.stringify(res.data.code) == 200) {
                this.shopCartList();
              } else {
                alert(res.data.msg);
              }
            }).catch(function (reason) {
              console.log('catch:', reason);
            });
          }
        }else{
          if (Verify.validateIsNull(this.shopCartCache)){
            this.cartData = this.shopCartCache;
          } else if (Verify.validateIsNull(Cookies.get('shoppingCartList'))) {
            this.cartData = JSON.parse(Cookies.get('shoppingCartList'));
          }
          //计算商品件数和总金额
          if (Verify.validateIsNull(this.cartData)) {
            this.goodsNum = 0;
            this.sumMoney = 0;
            for (let i=0;i<this.cartData.length;i++){
              this.goodsNum +=this.cartData[i].amount;
              this.sumMoney = this.sumMoney+ this.cartData[i].amount * this.cartData[i].salePrice;
            }
            this.sumMoney = Verify.toDecimal(this.sumMoney);
          }
        }
      },
      // 删除商品
      deleteGoods(data){
        swal({
          title: "确定要删除该商品吗?",
          // text: "You will not be able to recover this imaginary file!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            if (localStorage.getItem('loginStatus') == 1) {
              let url = '/api/cart/' + data.productId;
              this.$del(url, {}).then(res => {
                if (JSON.stringify(res.data.code) == 200) {
                  // console.log("cart==" + JSON.stringify(res.data.data));
                  swal("Deleted!", "已删除", "success");
                  this.shopCartList();
                } else {
                  alert(res.data.msg);
                }
              }).catch(function (reason) {
                console.log('catch:', reason);
              });
            } else {
              const index = this.cartData.findIndex(val => val.productId === data.productId);
              this.cartData.splice(index,1);
              //存vuex
              this.$store.dispatch('setShopCartCache', this.cartData);
              //存Cookie
              Cookies.set('shoppingCartList', this.cartData, {expires: 1, path: 'localhost'});
              this.shopCartList();
            }
          } else {
            swal("Cancelled", "商品还在购物车躺着哦", "error");
          }
        });
      },
      cart(){
        this.shopCartList();
      },
      //跳转购物车页面
      goCart() {
        this.$router.push({path: '/ShoppingCart'});
        this.$store.dispatch('setCartParams', 'cart');
      },
      judgeParam() {
        // localStorage.setItem('center',para);
        this.$store.dispatch('setCartParams', 'center');
        // console.log('cartParams11111==' + this.cartParams);
      },
      //我的订单点击事件
      myOrderEvent(){
        if (Verify.validateIsNull(localStorage.getItem('userId'))) {
          this.$router.push({path:'/PersonalCenter',query: {name: 'person',orderFlag:'personOrder'}});
        }else if (Verify.validateIsNull(localStorage.getItem('enterpriseId'))){
          this.$router.push({path:'/FirmCenter',query: {name: 'firm',orderFlag:'firmOrder'}});
        }else{
          this.$message('请先登录');
        }
      },
      //跳转个人中心
      personCenter(){
        if (Verify.validateIsNull(localStorage.getItem('userId'))) {
          this.$router.push({path:'/PersonalCenter',query: {name: 'person',orderFlag:''}});
        }else{
          this.$message('请先登录');
        }

      },
      //跳转企业中心
      firmCenter(){
        if (Verify.validateIsNull(localStorage.getItem('enterpriseId'))){
        // if (localStorage.getItem('loginStatus') == 1) {
        //  orderFlag判断订单调那个侧目录
          this.$router.push({path:'/FirmCenter',query: {name: 'firm',orderFlag:''}});
        }else{
          this.$message('请先登录');
        }
      },
      getCityData() {
        // const config = require('../../static/region.json');
        // this.city = config['86'];
        let url = '/api/service/cities/';
        this.$get(url, {}).then(res => {
          if (JSON.stringify(res.data.code) == 200) {
            this.city = res.data.data['86'];
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      chooseCity(value,key,index) {
        this.currentCity = value;
        this.activeClass = index;
        localStorage.setItem("setProvinceCode",key);
        this.$store.dispatch('setProvinceCode',key);
      },
    }
  }
</script>

<style scoped>
  @import "../styles/personal/personal-center.scss";

  .banner {
    padding-left: 19%;
    padding-right: 19%;
    width: 100%;
    height: 2rem;
    margin-top: 0px;
    background-color: rgba(246, 246, 246, 1);
    font-size: 14px;
    color: #333333;
    border-bottom: 1px solid #f2f2f2;

  }

  .banner span, div {
    /*color: #6C6C6C;*/
    color: #333333;
  }

  .cart_link {
    /*margin-top: -5px;*/
    font-size: 14px;
    color: #333333;
    border-width: 0px;
    line-height: 0.4;
  }

  .cart_btn {
    font-size: 14px;
    font-color: #FFFFFF;
    background-color: #DF2321;
    border-width: 0px;
  }

  .el-dropdown {
    font-size: 14px;
    color: #333333;
  }

  .margin_top5 {
    margin-top: 5px;
  }

  .text_align_left {
    text-align: left;
  }

  .text_align_right {
    text-align: right;
  }

  .login_status_btn {
    color: #33B2E8;
  }

  .personal_center {
    text-decoration: none;
  }

  .cart_order_title {
    font-size: 12px;
    color: #666666;
  }

  .cart_price {
    font-size: 14px;
    color: #404040;
  }

  .ul_name {
    display: inline;
    white-space: nowrap;
  }

  .li_name {
    list-style: none;
    display: inline-block;
    margin-left: 18px;
    float: left;
    line-height: 2;
  }
  .active {
    /* background: #eee; */
    color: #33B2E8;
    font-weight: bolder;
  }
  /*购物车的商品图片*/
  .good_img{
    width:80px;
    height: 80px;
    background-color: #F6F6F6
  }
</style>
