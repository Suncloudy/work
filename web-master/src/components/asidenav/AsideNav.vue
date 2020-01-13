<template>
  <div>
    <div class="aside_div">
      <!--border: 1px solid #eee-->
      <el-container style="height:500px;">
        <el-aside width="200px" class="aside_style">
          <el-menu
            class="el-menu-vertical-demo"
            @select="menuSelected"
            text-color="#3C3F41"
            active-text-color="black" :default-active="this.$router.path">
            <!--<nav-menu :navMenus="menus"></nav-menu>-->
            {{this.$router.path}}
            <nav-menu v-if="name === 'firm' || userId === null" :navMenus="firmMenus"></nav-menu>
            <nav-menu v-else-if="name === 'person' ||  enterpriseId === null" :navMenus="leftMenus"></nav-menu>
          </el-menu>
        </el-aside>
        <el-main class="margin_top10">
          <!--<router-view name = "center" :selectTitle = selectTitle></router-view>-->
          <router-view :selectTitle=selectTitle></router-view>
        </el-main>
      </el-container>
    </div>
  </div>

</template>

<script>
  import NavMenu from '../asidenav/NavMenu'
  import {PersonalMenu} from '../../personal-menu'
  import {FirmMenu} from '../../firm-menu'
  import {mapGetters} from 'vuex'

  export default {
    name: "AsideNav",
    components: {
      NavMenu,
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    data() {
      return {
        menus: '',
        leftMenus: PersonalMenu.list,
        firmMenus: FirmMenu.list,
        asideNav: "1",
        selectTitle: [],
        name: this.$route.query.name,
        enterpriseId: '',
        userId: ''
      }
    },
    created() {
      console.log(this.$route.query.name);
      this.enterpriseId = localStorage.getItem('enterpriseId');
      this.userId = localStorage.getItem('userId');
      // let center = localStorage.getItem('center');
      // if (center == 'name') {
      //   this.menus =  PersonalMenu.list;
      // }else if (center == 'firm'){
      //   this.menus =  FirmMenu.list;
      // }
      // console.log('数据信息',center);
    },
    methods: {
      menuSelected(index, indexPath) {
        if (indexPath.length != 0) {
          this.selectTitle = indexPath;
        }
        this.$store.dispatch('setAsideNavTitle', this.selectTitle);
        // console.log('侧导航===', this.asideNavTitle);
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
    }
  };
</script>
<style scoped>
  @import "../../styles/personal/personal-center.scss";

  .aside_div {
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 0px
  }
  .aside_style{
    margin-top: 10px;
    /*background-color: white;*/
  }

  .el-header {
    /*background-color: #B3C0D1;*/
    color: #333;
    line-height: 60px;
  }

  .el-main {
    padding: 0px 0px 0px 10px;
  }

  .el-breadcrumb {
    /*padding-top: 15px;*/
    line-height: 4;
  }

  .el-aside {
    color: #333;
  }

  .padding_bottom {
    padding-bottom: 4px;
  }

  .el-breadcrumb {
    line-height: 4;
  }

  .float-left {
    float: left;
  }
</style>
