<template>
  <div class="navMenu">
    <label v-for="navMenu in helpNavMenus">
      <!--只有一级菜单-->
      <el-menu-item v-if="navMenu.submenu==null"
                    :key="navMenu.id" :data="navMenu" :index="navMenu.navItem">
        <!--图标-->
        <img class="padding_bottom" :src=navMenu.iconUrl height="12">
        <!--标题-->
        <span slot="title" @click="navClick(navMenu.path)">{{navMenu.navItem}}</span>
        <!--<router-link :to="/PersonalPage"> {{navMenu.navItem}}</router-link>-->
      </el-menu-item>
      <!--有多级菜单-->
      <!--navMenu.hasOwnProperty('submenu')"-->
      <el-submenu v-if="navMenu.submenu"
                  :key="navMenu.id" :data="navMenu" :index="navMenu.navItem" :route="navMenu.path">
        <template slot="title">
          <img class="padding_bottom" :src=navMenu.iconUrl height="12">
          <span> {{navMenu.navItem}}</span>
        </template>
        <!--递归组件，把遍历的值传回子组件，完成递归调用-->
        <help-nav-menu :helpNavMenus="navMenu.submenu"></help-nav-menu>
      </el-submenu>
    </label>
  </div>
</template>

<script>
  export default {
    name: "HelpNavMenu",
    props: ['helpNavMenus'],
    data() {
      return {}
    },
    methods: {
      navClick(path) {
        let str = path;
        this.$router.push({path: str})

      }
    },
    created() {
      console.log('help数据信息222', this.helpNavMenus)
    },
  }
</script>

<style scoped>
  .padding_bottom {
    padding-bottom: 4px;
  }
</style>
