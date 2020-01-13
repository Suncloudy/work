<template>
  <div class="padding_left_right">
    <el-row :gutter="20">
      <el-col :span="18" class="margin_top15">
        <component :is="detailFlag"/>
      </el-col>

      <el-col :span="6">
        <div class="white_bg_color">
          <p class="label_title">标签</p>
          <div class="text_align_left padding_left10 padding_bottom10 cursor_pointer">
            <label v-for="(l,index)  in labelList" :key="index" class="label_font"><span class="padding_right10" v-bind:class="{changeLabel:changeSelectLabel===index}" @click="readHotLabel(index)">{{l.name}}</span></label>
          </div>
        </div>
        <div class="white_bg_color margin_top15">
          <p class="label_title">热门文章</p>
          <div class="label_font text_align_left padding_left10 cursor_pointer" v-for="(a,index) in hotArticle" :key="index">
            <div class="hot_article_title card_title_p" v-bind:class="{changeArticle:changeSelectArticle===index}" @click="readHotContent(a.id,index)">{{a.title}}</div>
          </div>
          <el-pagination
            layout="prev, pager, next"
            :total= hotArticleTotal>
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ArticleDetail from '../../components/ArticleDetail'
  import ArticleList from '../../components/ArticleList'
  import {mapGetters} from 'vuex'

  export default {

    data() {
      return {
        changeSelectLabel:'',
        labelList: [],
        hotArticle: [],
        hotArticleTotal:0,
      }
    },
    components:{
      ArticleList,
      ArticleDetail,
    },
    computed: {
      ...mapGetters(['articleId','detailFlag','changeSelectArticle','selectArticleLabel'])
    },
    created() {
      //获取标签列表
      this.getTagsList();
      //获取热门文章
      this.getHotArticle();
    },
    methods: {
      //标签列表
      getTagsList() {
        let _self = this;
        //获取Label列表
        _self.$get('/api/content/tags', {
          displayOrder: 'desc',//排序方式 (默认 ：desc) 或 asc
        }).then(res => {
          if (res.data.code === 200) {
            // console.log("label列表" + JSON.stringify(res.data.data));
            let arr = res.data.data;
            for (let i = 0; i < arr.length; i++) {
              const obj = {
                id: arr[i].id,
                name: arr[i].name
              };
              _self.labelList.push(obj);
            }
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //热门文章列表
      getHotArticle(){
        let _self = this;
        //获取Label列表
        _self.$get('/api/content/hotarticles', {
          page: 1,
          perPage: 10,
          // tagId:'',
        }).then(res => {
          if (res.data.code === 200) {
            // console.log("热门文章列表" + JSON.stringify(res.data.data.items));
            let arr = res.data.data.items;
            _self.hotArticleTotal = arr.length;
            for (let i = 0; i < arr.length; i++) {
              const obj = {
                id: arr[i].id,
                title: arr[i].title
              };
              _self.hotArticle.push(obj);
            }
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //读热门文章
      readHotContent(id,index){
        // this.changeSelectArticle = index;
        this.$store.dispatch('setArticleId',id);
        this.$store.dispatch('setChangeSelectArticle',index);
        this.$store.dispatch('setDetailFlag','ArticleDetail');
      },
      //热门标签
      readHotLabel(index){
        this.$store.dispatch('setSelectArticleLabel',index);
        this.changeSelectLabel = index;
      },
    },
  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";

  .padding_left_right {
    padding-left: 19%;
    padding-right: 19%;
    background-color: #F6F6F6;
  }

  .label_title {
    font-size: 14px;
    font-weight: bold;
    color: #666666;
    text-align: left;
    padding-left: 10px;
    padding-top: 10px;
  }

  .label_font {
    font-size: 16px;
    color: #333333;
  }
  .hot_article_title{
    line-height: 34px;
    font-size: 16px;
    color: #333333;
  }
  .changeLabel{
    color:#009BDD;
  }
  .changeArticle{
    color:#009BDD;
    text-decoration:underline;
  }
</style>
