<template>
  <div>
    <div v-if="cartParams === 'cart' ">
      <!--<home-banner></home-banner>-->
      <home-header></home-header>
    </div>
    <!--<home-banner></home-banner>-->
    <!--<home-header></home-header>-->
    <div class="div_padding">
      <!--根据登录状态来判断是否显示-->
      <div class="un_login_prompt" v-if="loginStatus !=1">
        <el-row>
          <el-col :span="12" class="text_align_left padding_left10">
            <p class="prompt_font"><i class="el-icon-warning"></i>购物车内暂时没有商品，登录后将显示您之前加入的商品</p>
          </el-col>
          <el-col :span="12" class="text_align_left line_height50">
            <el-button class="cart_login_btn" size="small" click="loginImmediately()" @click="loginImmediately">立即登录</el-button>
          </el-col>
        </el-row>

      </div>
      <div>
        <el-table
          ref="multipleTable"
          :data="cartData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="" width="100">
            <template slot-scope="scope">
              <img :src="scope.row.goodImageUrl" width="40" height="40" class="head_pic"/>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            width="120">
            <template slot-scope="scope">{{ scope.row.productName }}</template>
          </el-table-column>
          <el-table-column
            prop="salePrice"
            label="单价"
            width="120">
            <template slot-scope="scope">￥{{ scope.row.conSalePrice }}</template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="数量"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.amount" @change="handleChange(scope.row)" :min="1"
                               :max="100"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            prop="subtotal"
            label="小计"
            width="120">
            <!--<template slot-scope="scope">-->
            <!--<span>{{999.999*scope.row.amount}}</span>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <div class="del_goods">
                <el-button type="text" size="small"  @click="deleteOrder(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="operate_div">
          <!--indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果(没效果)-->
          <el-row>
            <el-col :span="2">
              <div class="line_height45">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="toggleSelection(cartData)">全选
                </el-checkbox>
              </div>
            </el-col>
            <el-col :span="3" class="cursor_pointer">
              <p class="regular_font" @click="deleteSelectGoods()">删除选中商品</p>
            </el-col>
            <el-col :span="3" class="cursor_pointer">
              <p  class="regular_font" @click="emptyShoppingCart()">清空购物车</p>
            </el-col>
            <el-col :span="10" class="text_align_right">
              <p class="regular_font">共<span class="prompt_font">{{goodsQuantity}}</span>件商品 &emsp; &emsp;总共：<span
                class="prompt_font">¥{{sumMoney}}</span>&emsp; &emsp;已节省:¥{{saveMoney}}</p>
            </el-col>
            <el-col :span="6" class="text_align_right" id="checkout">
              <el-button class="checkout_btn" @click="checkoutEvent()">去结算</el-button>
            </el-col>
          </el-row>

        </div>
      </div>
    </div>
    <home-footer  v-if="cartParams === 'cart'"></home-footer>
  </div>
</template>

<script>
  import Banner from "../Banner"
  import HomeHeader from "../HomeHeader"
  import HomeFooter from "../HomeFooter"
  import {mapGetters} from 'vuex'
  import swal from 'sweetalert2'; //alert框
  import Verify from '../../utils/utils';
  import Cookies from 'js-cookie';
  import PersonalPage from "../personal/PersonalPage";

  export default {
    name: "ShoppingCart",
    components: {
      PersonalPage,
      'home-banner': Banner,
      HomeHeader,
      HomeFooter
    },
    data() {
      return {
        loginStatus: '0',
        checkAll: false,
        isIndeterminate: true,
        cartData: [],
        goodsQuantity: 0,
        sumMoney: 0,
        saveMoney: 0,
        multipleSelection: [],
        discountPercentage: '',//折扣
        // goodsCount:1,//计数器
      }
    },
    computed: {
      ...mapGetters(['cartParams', 'shopCartCache'])
    },
    created() {
      // console.log("122==" + this.cartParams);
      this.shopCartList();
      this.loginStatus = localStorage.getItem("loginStatus");
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
            this.isIndeterminate = false;
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      shopCartList() {
        //登录状态 1：登录 0：未登录
        if (localStorage.getItem('loginStatus') == 1) {
          let url = '/api/carts';
          let total = 0;
          let saveTotal = 0;
          this.$get(url, {}).then(res => {
            if (res.data.code === 200) {
              this.cartData = res.data.data.items;
              this.goodsQuantity = 0;
              this.sumMoney = 0;
              for (let i = 0; i < res.data.data.items.length; i++) {
                this.cartData[i]['productId'] = res.data.data.items[i].product.id;
                this.cartData[i]['productName'] = res.data.data.items[i].product.name;
                this.cartData[i]['conSalePrice'] = Verify.toDecimal(res.data.data.items[i].product.salePrice);
                if (Verify.validateIsNull(res.data.data.items[i].product.File)) {
                  this.cartData[i]['goodImageUrl'] = 'http://' + res.data.data.items[i].product.File.url;
                }
                this.cartData[i]['subtotal'] = Verify.toDecimal(res.data.data.items[i].product.salePrice * res.data.data.items[i].amount);
                // this.cartData[i]['subtotal'] = res.data.data[0].product.salePrice*res.data.data.items[i].amount;
                this.goodsQuantity += res.data.data.items[i].amount;
                total += res.data.data.items[i].product.salePrice * res.data.data.items[i].amount;
                //计算节省金额 备注：原本是根据市场价-销售价计算，现在改为：销售价*折扣
                this.discountPercentage = res.data.data.discount.discountPercentage;
                // if (Verify.validateIsNull(res.data.data.items[i].product.marketPrice)) {
                //   saveTotal += res.data.data.items[i].product.marketPrice * res.data.data.items[i].amount - res.data.data.items[i].product.salePrice * res.data.data.items[i].amount;
                // }
                this.sumMoney = Verify.toDecimal(total);
                this.saveMoney = Verify.toDecimal((1 - this.discountPercentage) * total);
              }
              // console.log("cart==" + JSON.stringify(this.cartData));
            } else {
              alert(res.data.msg);
            }
          }).catch(function (reason) {
            console.log('catch:', reason);
          });
        } else {
          //如果this.shopCartCache存在，则读取Vuex的值，如果不存在，则读取Cookie的值
          if (Verify.validateIsNull(this.shopCartCache)) {
            this.cartData = this.shopCartCache;

          } else if (Verify.validateIsNull(Cookies.get('shoppingCartList'))) {
            this.cartData = JSON.parse(Cookies.get('shoppingCartList'));
          }
          //计算商品件数和总金额
          if (Verify.validateIsNull(this.cartData)) {
            this.goodsQuantity = 0;
            this.sumMoney = 0;
            for (let i = 0; i < this.cartData.length; i++) {
              this.goodsQuantity += this.cartData[i].amount;
              this.cartData[i]['conSalePrice'] = Verify.toDecimal(this.cartData[i].salePrice)
              this.sumMoney = this.sumMoney + this.cartData[i].amount * this.cartData[i].salePrice;
              //判断是否存在市场价，再计算节省金额（市场价减销售价）
              if (Verify.validateIsNull(this.cartData[i].marketPrice)) {
                this.saveMoney = this.cartData[i].amount * this.cartData[i].marketPrice - this.sumMoney;
              }
            }
            this.saveMoney = Verify.toDecimal(this.saveMoney);
            this.sumMoney = Verify.toDecimal(this.sumMoney);
          }
        }
        // this.$store.dispatch('setCartParams', 'cart');
      },
      handleSelectionChange: function (val) {
        this.multipleSelection = val;
        this.goodsQuantity = 0;
        this.sumMoney = 0;
        this.saveMoney = 0;
        let total = 0;
        let save = 0;
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.goodsQuantity += this.multipleSelection[i].amount;
          total += this.multipleSelection[i].conSalePrice * this.multipleSelection[i].amount;
          this.sumMoney = total;
          if(Verify.validateIsNull(this.discountPercentage)){
            save += this.sumMoney * this.discountPercentage
          } else if (Verify.validateIsNull(this.multipleSelection[i].marketPrice)) {
            save += ((this.multipleSelection[i].marketPrice - this.multipleSelection[i].salePrice) * this.multipleSelection[i].amount);
          }
          this.saveMoney = Verify.toDecimal(save);
        }
      },
      //去结算
      checkoutEvent() {
        // console.log('cartParams==' + JSON.stringify(this.multipleSelection));
        //已登录
        if (localStorage.getItem("loginStatus") === "1") {
          if (Verify.validateIsNull(this.multipleSelection) && this.multipleSelection.length !== 0) {
            this.$store.dispatch('setCartParams', 'order');
            //把选择的商品信息存vuex
            this.$store.dispatch('setShopCartCache', this.multipleSelection);
            // console.log('this.multipleSelection=='+JSON.stringify(this.multipleSelection));
            // console.log('cartData==' + JSON.stringify(this.cartData));
            //存Cookie
            Cookies.set('shoppingCartList', this.multipleSelection, {expires: 1, path: 'localhost'});
            this.$router.push({path: '/ConfirmOrder'});
          } else {
            this.$message('请勾选要结算的商品');
          }
        } else {

          swal({
            title: "当前未登录，是否去登录?",
            type: "question",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }).then((result) => {
            if (result.value) {
              this.$router.push({path: '/Login'});
            }
          });
        }
      },
      //删除单个商品
      deleteOrder(row) {
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
            if (localStorage.getItem('loginStatus') === '1') {
              let url = '/api/cart/' + row.productId;
              this.$del(url, {}).then(res => {
                if (res.data.code === 200) {
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
              const index = this.cartData.findIndex(val => val.productId === row.productId);
              this.cartData.splice(index, 1);
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
      //删除选中商品
      deleteSelectGoods() {
        if (this.multipleSelection.length !== 0) {
          let itemArr = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let obj = this.multipleSelection[i].productId;
            itemArr.push(obj);
          }
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
              if (localStorage.getItem('loginStatus') === '1') {
                let url = '/api/carts/';
                this.$del(url, {
                  ids: itemArr.toString()
                }).then(res => {
                  if (res.data.code === 200) {
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
                for (let i = 0; i < this.multipleSelection.length; i++) {
                  let obj = this.multipleSelection[i].productId;
                  const index = this.cartData.findIndex(val => val.productId === obj);
                  this.cartData.splice(index, 1);
                }
                //存vuex
                this.$store.dispatch('setShopCartCache', this.cartData);
                // //存Cookie
                Cookies.set('shoppingCartList', this.cartData, {expires: 1, path: 'localhost'});
                this.shopCartList();
              }
            } else {
              swal("Cancelled", "商品还在购物车躺着哦", "error");
            }
          });
        } else {
          this.$message('请先选择要删除的商品');
        }
      },
      //清空购物车
      emptyShoppingCart() {
        swal({
          title: "确定要清空购物车吗?",
          // text: "You will not be able to recover this imaginary file!",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            //登录状态 1：登录 0：未登录
            if (localStorage.getItem('loginStatus') === '1') {
              let url = '/api/carts';
              this.$del(url, {}).then(res => {
                if (res.data.code === 200) {
                  // console.log("cart==" + JSON.stringify(res.data.data));
                  swal("Deleted!", "已清空", "success");
                  this.shopCartList();
                } else {
                  alert(res.data.msg);
                }
              }).catch(function (reason) {
                console.log('catch:', reason);
              });
            } else {
              Cookies.remove('shoppingCartList');
              this.cartData = [];
              this.$store.dispatch('setShopCartCache', this.cartData);
              this.shopCartList();
            }
          } else {
            swal("Cancelled", "商品还在购物车躺着哦", "error");
          }
        });
      },
      //修改商品数量
      handleChange(goods) {
        //登录状态 1：登录 0：未登录
        if (localStorage.getItem('loginStatus') === '1') {
          // let url = '/api/cart/'+val.product.id;
          let url = '/api/cart/' + goods.productId;
          this.$put(url, {
            amount: goods.amount,
          }).then(res => {
            if (res.data.code === 200) {
              // console.log("cart==" + JSON.stringify(res.data.data));
              this.shopCartList();
            } else {
              alert(res.data.msg);
            }
          }).catch(function (reason) {
            console.log('catch:', reason);
          });
        } else {
          const index = this.cartData.findIndex(val => val.productId === goods.productId);
          this.cartData[index].amount = goods.amount;
          this.cartData[index].subtotal = Verify.toDecimal(this.cartData[index].amount * goods.salePrice);
          //存vuex
          this.$store.dispatch('setShopCartCache', this.cartData);
          //存Cookie
          Cookies.set('shoppingCartList', this.cartData, {expires: 1, path: 'localhost'});
          // console.log('this.cartData:', this.cartData);
          this.shopCartList();
        }
      },
      loginImmediately() {
        this.$router.push({path: '/Login'});
      }
    },

  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";

  .div_padding {
    background-color: white;
    padding-left: 10%;
    padding-right: 10%;
    margin-top: 19px;
  }

  .un_login_prompt {
    border: 1px solid #EED386;
    background-color: #FFFDED;
    height: 52px;
  }

  .prompt_font {
    color: #f39800;
    font-size: 14px;
  }

  .cart_login_btn {
    background-color: #DF2321;
    color: #ffffff;
    /*text-align:center;*/
  }

  .operate_div {
    margin-top: 50px;
    height: 46px;
    background: #eeeeee;
  }

  .regular_font {
    color: #666666;
    font-size: 14px;
    /*margin-top: 6px;*/
    /*margin-bottom: 6px;*/
  }
  .line_height45{
    line-height: 45px;
  }
  .line_height50{
     line-height:50px;
  }
  .checkout_btn {
    background-color: #DF2321;
    color: #ffffff;
    border-radius: 0px;
    width: 120px;
    height: 46px;
  }
  /*去结算按钮*/
  #checkout .el-button:focus,.el-button:hover {
    color: white;
    border-width: 0px;
  }
  #checkout .el-button--primary:focus, .el-button--primary:hover {
    border-width: 0px;
    color: white;
  }
  .del_goods .el-button:hover {
    color: #089EDE;
  }
  .del_goods .el-button:focus,.el-button:hover {
    color: #089EDE;
    border-width: 0px;
  }
  .del_goods .el-button--primary:focus, .el-button--primary:hover {
    border-width: 0px;
    color: #089EDE;
  }
  /*查看购物车*/
  .cart_page .el-button:focus, .el-button:hover {
    color: #FFF;
    border-width: 0px;
  }
  .cart_page .el-button--danger:hover {
    background: #f78989;
    border-color: #f78989;
    color: #FFF;
  }
</style>
