<template>
  <div>
    <div class="aside_div">
      <el-container>
        <el-aside width="200px" style="background-color:white">
          <el-menu
            class="el-menu-vertical-demo"
            @select="menuSelected"
            text-color="#3C3F41"
            @open="handleOpen"
            active-text-color="black" :default-active="this.$router.path">
            <help-nav :helpNavMenus="menus"></help-nav>
          </el-menu>
        </el-aside>
        <el-main class="padding10" >
          <router-view :selectTitle=selectTitle></router-view>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import HelpNavMenu from '../helpcenter/HelpNavMenu'
  import {HelpCenterMenu} from '../../help-center'
  import {mapGetters} from 'vuex'
  export default {
    name: 'HelpAsideNav',
    components: {
      'help-nav':HelpNavMenu,
    },
    computed: {
      ...mapGetters(['helpCenterTitle'])
    },
    data() {
      return {
        menus: HelpCenterMenu.list,
        selectTitle: [],
        // name: this.$route.query.ce,
      }
    },
    created() {
      console.log('help数据信息',this.menus)
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      menuSelected(index, indexPath) {
        if (indexPath.length != 0) {
          this.selectTitle = indexPath;
        }
        this.$store.dispatch('setHelpCenterTitle',this.selectTitle);
        console.log('help当前绑定的index值', index)
        console.log('help当前绑定的index与path值', indexPath)
      },
    }
  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";
  .el-menu {
    padding-left: 0;
    padding-right: 0;
  }
  .aside_div {
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 30px
  }
</style>
