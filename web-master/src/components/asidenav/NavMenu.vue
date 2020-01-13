<template>
  <div class="navMenu">
    <label v-for="navMenu in navMenus">
      <!--只有一级菜单-->
      <el-menu-item v-if="navMenu.submenu==null"
                    :key="navMenu.id" :data="navMenu" :index="navMenu.navItem" @click="navClick(navMenu.path)">
        <!--图标-->
        <img class="padding_bottom" :src=navMenu.iconUrl height="12">
        <!--标题-->
        <!--<el-badge v-if="navMenu.label" :value= navMenu.label.value class="item">-->
          <!--<span slot="title" @click="navClick(navMenu.path)">{{navMenu.navItem}}</span>-->
        <!--</el-badge>-->
        <span slot="title">{{navMenu.navItem}}</span>
        <!--<router-link :to="/PersonalPage"> {{navMenu.navItem}}</router-link>-->
      </el-menu-item>
      <!--有多级菜单-->
      <el-submenu v-if="navMenu.submenu"
                  :key="navMenu.id" :data="navMenu" :index="navMenu.navItem" :route="navMenu.path">
        <template slot="title">
          <!--<el-badge v-if="navMenu.label" :class="'float-right badge'" :value= navMenu.label.value class="item">-->
            <img class="padding_bottom" :src=navMenu.iconUrl height="12">
            <span> {{navMenu.navItem}}</span>
          <!--</el-badge>-->
        </template>
        <!--递归组件，把遍历的值传回子组件，完成递归调用-->
        <nav-menu :navMenus="navMenu.submenu"></nav-menu>
      </el-submenu>
    </label>
  </div>
</template>

<script>
  export default {
    name: "NavMenu",
    props: ['navMenus'],
    data() {
      return {}
    },
    methods: {
      navClick(path){
        let str = path;
        // alert(str)
        this.$router.push({ path: str})

      }
    },
    created() {
      console.log('数据信息222', this.navMenus)
    },
  }
</script>

<style scoped>
  .padding_bottom {
    padding-bottom: 4px;
  }
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
