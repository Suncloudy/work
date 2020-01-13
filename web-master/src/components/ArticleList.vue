<template>
  <div>
    <div class="white_bg_color">
      <el-row v-for="(article,index) in articleList" :key="index">
        <el-col :span="24" class="text_align_left padding_left10 padding_right10">
          <el-row>
            <el-col :span="16">
              <p class="advice_title">{{article.name}}</p>
            </el-col>
            <el-col :span="8" class="margin_top15 text_align_right padding_right20">
              <img src="../assets/healthAdvice/shijian@2x.png" height="16" width="16" class="vertical_align"/>
              <span class="date_font">{{article.updatedAt}}</span>
            </el-col>
          </el-row>

          <el-row v-if="article.imgUrl &&  article.hasOwnProperty('imgUrl')">
            <el-col :span="5">
              <img :src="article.imgUrl" alt="图片" class="article_img"/>
            </el-col>
            <el-col :span="19">
              <p class="article_content">{{article.summary}}</p>
              <!--<p class="article_content">{{article.content}}</p>-->
            </el-col>
          </el-row>
          <!--<p v-else class="article_content">{{article.content}}</p>-->
          <p v-else class="article_content">{{article.summary}}</p>
          <el-row>
            <el-col :span="6">
              <img class="vertical_align" src="../assets/healthAdvice/biaoqian@2x.png" height="16" width="16"/>
              <span class="date_font" v-for="(l,index) in article.tags" :key="index">
                    {{l.tag}}
                  </span>
            </el-col>
            <el-col :span="3">
              <img class="vertical_align" src="../assets/healthAdvice/yanjing@2x.png" height="16" width="16"/>
              <span class="date_font">{{article.pageviews}}</span>
            </el-col>
            <el-col :span="15" class="text_align_right padding_right20">
              <el-button class="all_content_font" type="text" @click.native="readContent(article.id)">阅读全文</el-button>
            </el-col>
          </el-row>
          <hr class="separate"/>
        </el-col>
      </el-row>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="total, prev, pager, next"
      :total=articleListTotal>
    </el-pagination>
  </div>
</template>

<script>
  import Verify from '../utils/utils';
  import {mapGetters} from 'vuex'

  export default {
    name: "ArticleList",
    data() {
      return {
        articleList: [],
        currentPage: 1,
        articleListTotal: 0,
        articleTitle: '',//文章标题
        articleCovers: '',//文章封面
        articleContent: '',//文章内容
        publishedTime: '',//这里取的最后一次修改时间
        articleViews: '',//文章浏览量
      }
    },
    created() {
      this.getArticleList();
    },
    computed: {
      ...mapGetters(['selectArticleLabel'])
    },
    watch: {
      //监听vuex存值selectArticleLabel标签的变化
      selectArticleLabel(newCount, oldCount) {
        // Our fancy notification (2).
        if (newCount !== oldCount){
          this.getArticleList();
        }
        // console.log(`We have ${newCount} ${oldCount} fruits now, yaay!`)
      }
    },
    methods: {
      getArticleList() {
        let _self = this;
        //获取Label列表
        let url = '/api/content/articles';
        // console.log(this.selectArticleLabel);
        _self.$get(url, {
          tagId:this.selectArticleLabel,
          page: _self.currentPage,
          perPage: 10,
        }).then(res => {
          if (res.data.code === 200) {
            let arr = res.data.data.items;
            _self.articleListTotal = arr.length;
            for (let i = 0; i < arr.length; i++) {
              let tagMap = arr[i].ArticleTagMappings;
              let tagArr = [];
              for (var j = 0; j < tagMap.length; j++) {
                const o = {
                  id: tagMap[j].Tag.id,
                  tag: tagMap[j].Tag.name,
                };
                tagArr.push(o);
              }
              // console.log("arr[i]==" + JSON.stringify(res.data.data));
              let imgUrl = '';
              if (arr[i].File == null) {
                imgUrl = '';
              } else {
                imgUrl = 'http://' + arr[i].File.url;
              }
              const obj = {
                id: arr[i].id,
                name: arr[i].title,
                summary: arr[i].summary,
                content: arr[i].content,
                updatedAt: Verify.convertDate(arr[i].updatedAt),
                tags: tagArr,
                pageviews: arr[i].pageviews,
                imgUrl: imgUrl
              };
              _self.articleList.push(obj);
            }

          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //阅读全文
      readContent(id) {
        this.$store.dispatch('setArticleId', id);
        this.$store.dispatch('setDetailFlag', 'ArticleDetail');
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getArticleList();
      }
    }

  }
</script>

<style scoped>
  @import "../styles/personal/personal-center.scss";

  .advice_title {
    font-size: 18px;
    font-weight: bold;
    color: #404044;
  }

  .date_font {
    color: #CCCCCC;
    font-size: 12px;
  }

  .all_content_font {
    color: #33b2e8;
    font-size: 12px;
  }

  .vertical_align {
    vertical-align: middle;
  }

  .article_content {
    font-size: 12px;
    color: #333333;
    line-height: 24px;
  }

  /*文章分割线*/
  .separate {
    height: 2px;
    background-color: #e6e6e6;
    border: none;
  }

  .article_img {
    background-color: lightgrey;
    width: 120px;
    height: 100px;
  }
</style>
