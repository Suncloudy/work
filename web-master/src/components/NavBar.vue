<template>
  <div class="menu">
    <el-row >
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="">
        <el-menu
          :default-active="this.$router.path"
          class="el-menu-demo nav_bar_padding"
          mode="horizontal"
          @select="handleSelect"
          background-color="#33B2E8"
          text-color="#fff"
          active-text-color="#fff" style="border-bottom-width: 0px;" router>

          <el-menu-item v-for="navMenu in mainMenu" :key="navMenu.id" :data="navMenu" :index="navMenu.navItem"
                        :route="navMenu.path" @click="navClick(navMenu.path)" class="padding_left_right54">
              {{navMenu.navItem}}
          </el-menu-item>
        </el-menu>
        <router-view class="back_color"></router-view>
      </el-col>
    </el-row>
    <!--<keep-alive>-->
      <!--<compent v-bind:is="currentView">-->
        <!--&lt;!&ndash; 组件在 vm.currentview 变化时改变！ &ndash;&gt;-->
      <!--</compent>-->
    <!--</keep-alive>-->
    <home-footer></home-footer>
  </div>

</template>
<script>

  import {MainMenu} from "../main-menu";
  import FirmMedical from "../views/navpage/FirmMedical.vue"
  import HomePage from "../views/navpage/Homepage.vue"
  import HomeFooter from "../components/HomeFooter"
  export default {
    name:'NavBar',
    components:{
      HomePage,
      FirmMedical,
      HomeFooter
    },
    data() {
      return {
        activeIndex: '1',
        mainMenu: MainMenu.list,
        currentView:'HomePage',
        clickNav:false,
      };
    },
    methods: {
      // handleClick(tab, event) {
      //   console.log(tab, event);
      // },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        console.log("11111"+keyPath);
      },
      navClick(path){
        console.log(path)
        if (path =="/HomePage"){
          this.currentView = 'HomePage';
          this.clickNav = true;
        }else if(path =="/HomePage"){

        }else if(path =="/FirmMedical"){
          this.currentView = 'FirmMedical';
          this.clickNav = true;
        }else if(path =="/HomePage"){
          this.currentView = 'HomePage';
        }else{
          this.currentView = 'HomePage';
        }
        // this.$router.push(
        //   path
        // )
      }
    }
  };
</script>
<style>
  .menu {
    margin-top: 15px;
    height: 40px;
  }
  .menu_item {
    height: 40px
  }
  .nav_bar_padding{
    padding-left: 19%;
    padding-right: 19%;
  }

  .el-menu--horizontal > .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  .pageDisplay{
    display: block;
  }
  .back_color{
    background-color: #F3F3F3;
  }
  /*.el-menu-item{*/
    /*padding-left: 15px;*/
    /*padding-right: 15px;*/
    /*!*margin-left: 10%;*!*/
  /*}*/
  .padding_left_right54{
    padding-left: 54px;
    padding-right: 54px;
  }
  /*lg*/
  /*@media only screen and (min-width: 1200px){*/
    /*.padding_left{*/
      /*padding-left: 8%;*/
      /*padding-right: 8%;*/
    /*}*/
  /*}*/
    /*mg*/
  /*@media only screen and (min-width: 992px){*/
    /*.padding_left{*/
      /*padding-left: 7%;*/
      /*padding-right: 7%;*/
    /*}*/
  /*}*/
    /*sm*/
  /*@media only screen and (min-width: 768px){*/
    /*.padding_left {*/
      /*padding-left: 6%;*/
      /*padding-right: 6%;*/
    /*}*/

    /*}*/
</style>
