<template>
  <div class="">
    <el-row class="white_bg_color">
      <el-col :span="12">
        <div class="article_detail_header_bg">
          <span @click="goBack()" class="cursor_pointer">健康咨询</span>>
          <!--<span>{{articleTitle}}</span>-->
        </div>
      </el-col>
    </el-row>

    <el-row class="text_align_left white_bg margin_top15 margin_bottom15 padding_left10 padding_right10">
      <p class="advice_title text_align_left padding_left10">{{articleTitle}}</p>
      <el-row :gutter="20" class="text_align_left padding_left10">
        <el-col :span="6">
          <img src="../assets/healthAdvice/shijian@2x.png" height="16" width="16" class="vertical_align"/>
          <span class="date_font">{{publishedTime}}</span>
        </el-col>
        <el-col :span="3">
          <img class="vertical_align" src="../assets/healthAdvice/yanjing@2x.png" height="16" width="16"/>
          <span class="date_font">{{articleViews}}</span>
        </el-col>
      </el-row>
      <hr align="center" style="border: 1px dashed #CCCCCC;"/>
      <div class="article_profile text_align_left padding10">
        {{articleProfile}}
      </div>
      <el-row>
        <el-col :span="24" class="text_align_left padding_left10 margin_top10">
          <div v-if="articleCovers">
            <img :src="articleCovers" class="width_height_100"/>
          </div>
          <!--<img :src="articleCovers" width="" height="300px"/>-->
        </el-col>
      </el-row>
      <!--class="article_content text_align_left padding_left10"-->
      <div class="article_content">
        <p v-html="articleContent"></p>
      </div>
    </el-row>

  </div>
</template>

<script>
  import Verify from '../utils/utils'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        articleTitle: '',//文章标题
        articleProfile: '',//文章概要
        articleCovers: '',//文章封面
        articleContent: '',//文章内容
        publishedTime: '',//这里取的最后一次修改时间
        articleViews: '',//文章浏览量
      }
    },
    created() {
      this.getArticleDetail();
    },
    computed: {
      ...mapGetters(['articleId', 'detailFlag'])
    },
    methods: {
      //文章详情
      getArticleDetail() {
        let _self = this;
        let url = '/api/content/articles/' + this.articleId;
        _self.articleCovers = '';
        _self.$get(url, {}).then(res => {
          if (res.data.code === 200) {
            // console.log("文章详情==" + JSON.stringify(res.data.data));
            _self.articleTitle = res.data.data.title;
            if (res.data.data.File != null) {
              _self.articleCovers = "http://" + res.data.data.File.url;
            }
            _self.publishedTime = Verify.convertDate(res.data.data.updatedAt);
            _self.articleViews = res.data.data.pageviews;
            _self.articleProfile = res.data.data.summary;
            _self.articleContent = res.data.data.content;//content
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //返回
      goBack() {
        this.$store.dispatch('setDetailFlag', 'ArticleList');
        this.$store.dispatch('setChangeSelectArticle', '');
      }
    },
    watch: {
      'articleId': function (newVal, oldVal) {
        this.getArticleDetail();
      },
    }
  }
</script>

<style>
  @import "../styles/personal/personal-center.scss";

  .white_bg {
    background-color: white;
  }

  .advice_title {
    font-size: 18px;
    font-weight: bold;
    color: #404044;
  }

  .date_font {
    color: #CCCCCC;
    font-size: 12px;
  }

  .vertical_align {
    vertical-align: middle;
  }

  .article_content {
    font-size: 14px;
    color: #333333;
    /*line-height: 24px;*/
  }

  .article_profile {
    font-size: 14px;
    color: #666666;
    background-color: #cccccc;
  }

  /*文章分割线*/
  .separate {
    height: 2px;
    background-color: #e6e6e6;
    border: none;
  }

  .article_detail_header_bg {
    background-color: white;
    /*text-align: right;*/
    font-size: 18px;
    color: #333333;
    line-height: 50px;
    text-align: left;
    padding-left: 15px;
  }
</style>
