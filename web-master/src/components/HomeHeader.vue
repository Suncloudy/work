<template>
  <el-header>
    <el-row class="margin_left_right">
      <el-col :span="12">
        <div class="logo_img_div cursor_pointer" >
          <img src="../assets/logo_login@2x.png" class="logo_img" @click="returnHomePage()"/>
        </div>
      </el-col>
      <el-col :span="12">
        <el-form ref="form" :model="form" class="search_form text_align_right">
          <el-input v-model="form.name" placeholder="请输入关键词">
            <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="fuzzySearch()">
            </i>
          </el-input>
        </el-form>
      </el-col>
    </el-row>


  </el-header>
</template>

<script>
  import Verify from '../utils/utils';
  import {mapGetters} from 'vuex'
  export default {
    name: "HomeHeader",
    data(){
      return{
        form:{
          name:''
        },
      }

    },
    computed: {
      ...mapGetters(['cartParams','searchContent'])
    },
    methods:{
      returnHomePage(){
        this.$store.dispatch('setCartParams', '');
        this.$router.push({ path: '/IndexPage'});
      },
      //模糊搜索
      fuzzySearch(){
        if (Verify.validateIsNull(this.form.name)) {
          let url = '/api/catalog/selectProducts/';
          this.$get(url, {
            condition:encodeURIComponent(this.form.name)
          }).then(res => {
            if (res.data.code === 200) {
              // console.log('catch:', res);
              this.$store.dispatch('setSearchContent',res);
              // console.log('catch1:', this.searchContent);
              this.$router.push({ path: '/MedicalProduct'})
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(function (reason) {
            console.log('catch:', reason);
          });
        }else{
          this.$store.dispatch('setSearchContent','');
        }
      }
    }

  }
</script>

<style scoped>
  .margin_left_right {
    margin-left: 19%;
    margin-right: 19%;
  }
  .bg_color_white{
    background-color: white;
  }
  /*.el-row{*/
    /*background-color: white;*/
    /*margin-left: -20px;*/
    /*margin-right: -20px;*/
  /*}*/
  .logo_img_div {
    /*margin-left: 6.75rem;*/
    text-align: left;
  }

  .logo_img {
    text-align: left;
    height: 60px;
    margin-top: 0.75rem;
  }
  .search_form{
    width:420px;
    height:49px;
    margin-top: 24px;
    margin-left: 30px;
  }
  .cursor_pointer{
    cursor:pointer;
  }</style>
