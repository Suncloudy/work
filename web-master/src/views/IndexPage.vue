<template>
  <div class="bg_color_white">
    <home-banner></home-banner>

    <shopping-cart v-if="cartParams === 'cart' "></shopping-cart>
    <confirm-order v-else-if="cartParams === 'order' "></confirm-order>
    <order-payment v-else-if="cartParams === 'payment'"></order-payment>

    <div v-else>
      <home-header></home-header>
      <nav-bar></nav-bar>
    </div>
    <!--<cooper-institution></cooper-institution>-->
    <!--<serve-client></serve-client>-->
    <!--<home-footer></home-footer>-->
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import Banner from "../components/Banner"
  import HomeHeader from "../components/HomeHeader"
  import NavBar from  "../components/NavBar"
  import ShoppingCart from "../components/cart/ShoppingCart"
  import ConfirmOrder from "../components/cart/ConfirmOrder"
  import OrderPayment from "../components/cart/OrderPayment"
  // import CooperativeInstitution from "../components/CooperativeInstitution"
  // import ServeClient from "../components/ServeClients"
  // import HomeFooter from "../components/HomeFooter"

  export default {
    name:'IndexPage',
    components:{
      'home-banner':Banner,
      'home-header':HomeHeader,
      'nav-bar':NavBar,
      ShoppingCart,//购物车
      ConfirmOrder,//订单详情
      OrderPayment,//支付订单
      // 'cooper-institution':CooperativeInstitution,
      // 'serve-client':ServeClient,
      // 'home-footer':HomeFooter
    },
    mounted(){
      console.log('cartParams2222=='+this.cartParams);
    },
    computed: {
      ...mapGetters(['cartParams'])
    },
    data() {
      return {
        clickCart: '',
      }
    },
    created(){

    }
  }
</script>

<style>
  body{
    margin: 0px;
  }
  .bg_color_white{
    background-color: white;
  }
</style>
