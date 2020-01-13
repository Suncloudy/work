<template>
  <div>
    <!--标题-->
    <el-row class="white_bg_color padding_left_right_percent19">
      <!--<el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">-->
      <!--<div>-->
      <!--&emsp;-->
      <!--</div>-->
      <!--</el-col>-->
      <el-col :xs="13" :sm="13" :md="13" :lg="13" :xl="13">
        <div class="text_align_left recommendTitle margin_top15">
          推荐套餐
        </div>
      </el-col>
      <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
        <div class="text_align_right recommendMore cursor_pointer margin_top15" @click="recommendMore()">
          查看更多>
        </div>
      </el-col>
    </el-row>
    <!--布局-->
    <el-row :gutter="10" class="white_bg_color padding_left_right_percent19">
      <!--<el-col :xs="5" :sm="5" :md="5" :lg="4" :xl="4">-->
      <!--<div class="float_left">-->
      <!--<img src="../assets/checkUp/taocan_banner1@2x.png" height="394" width=""/></div>-->
      <!--</el-col>-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="margin_top10 margin_bottom15" v-if="productData.length !== 0">
        <el-row :gutter="20">
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" v-for="(p, index) in productData" :key="index"
                  :class="{'marginTop10':index>3}">
            <el-card :body-style="{ padding: '0px' }" @click="productDetail(p.CatalogProduct.id)"
                     class="cursor_pointer">
              <div class="goods_image">
                <img :src=p.imgUrl class="width_height_100" alt="产品图" @click="productDetail(p.CatalogProduct.id)">
              </div>
              <div class="card_content left_style">
                <p class="card_title card_title_p">{{p.CatalogProduct.name}}</p>
                <p class="card_subtitle card_title_p margin_top5 margin_bottom5" v-if="p.CatalogProduct.simpleDescription === null">&emsp;</p>
                <p class="card_subtitle card_title_p margin_top5 margin_bottom5" v-else>
                  {{p.CatalogProduct.simpleDescription}}</p>
                <p class="margin_top0_bottom0"><span class="discount_price">¥</span><span
                  class="discount_price">{{p.convertSalePrice}}</span><span class="origin_price">起</span>&emsp;&emsp;&emsp;<span
                  class="origin_price line" v-if="p.CatalogProduct.marketPrice !== null">¥</span><span
                  class="origin_price line">{{p.convertMarketPrice}}</span></p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-else>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="recommend_div">
              <img src="../assets/personal/wudingdan_icon@2x.png" height="88" width="" style="margin-top: 20px"/>
              <p class="prompt_placeholder">暂时没有推荐套餐</p>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Verify from '../utils/utils';

  export default {
    name: "HealthCheckup",
    data() {
      return {
        total: 0,
        productData: [],
      }
    },
    created() {
      this.getProductList();
    },
    methods: {
      getProductList() {
        // let userId = localStorage.getItem("userId");
        // let product = '/api/user/products';
        let product = '/api/ad/products/indexMedicalExaminationPackage';
        this.$get(product, {}).then(res => {
          if (res.data.code === 200) {
            // console.log("test" + JSON.stringify(res.data.data));
            this.productData = res.data.data;
            for (let i = 0; i < this.productData.length; i++) {
              this.productData[i]['convertSalePrice'] = Verify.toDecimal(this.productData[i].CatalogProduct.salePrice);
              this.productData[i]['convertMarketPrice'] = Verify.toDecimal(this.productData[i].CatalogProduct.marketPrice);
              if (Verify.validateIsNull(this.productData[i].CatalogProduct.File)) {
                this.productData[i]['imgUrl'] = "http://" + this.productData[i].CatalogProduct.File.url;
              }
            }

          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      productDetail(id) {
        console.log("111=" + id);
        this.$router.push({path: '/MedicalProductDetail', query: {productId: id}})
      },
      recommendMore() {
        this.$router.push({path: '/MedicalProduct'});
      }
    }
  }
</script>

<style scoped>
  @import "../styles/personal/personal-center.scss";

  /*套餐title*/
  .recommendTitle {
    font-size: 22px;
    color: #333333;
  }

  .recommendMore {
    font-size: 14px;
    color: #666666;
  }

  /*套餐的布局*/
  .marginTop10 {
    margin-top: 20px;
  }

  .goods_image {
    height: 160px;
    background-color: lightgrey;
  }

  .recommend_div {
    width: 100%;
    /*height: 300px;*/
    background-color: white;
    text-align: center;
  }

  .cursor_pointer {
    cursor: pointer;
  }

  /*左边距且左对齐*/
  .left_style {
    text-align: left;
    padding-left: 12px;
  }

</style>
