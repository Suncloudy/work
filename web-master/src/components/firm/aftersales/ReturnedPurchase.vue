<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>申请售后</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="white_bg_color">
      <!--商品列表-->
      <div class="margin_top10 padding10">
        <el-row class="text-center list_header">
          <el-col :span="8">
            <p class="margin_top10">商品</p>
          </el-col>
          <el-col :span="4">
            <p class="margin_top10">单价</p>
          </el-col>
          <el-col :span="4">
            <p class="margin_top10">数量</p>
          </el-col>
        </el-row>
        <div class="border_all">
          <el-row class="text-center vertical-container">
            <el-col class="special_right_border">
              <el-col :span="8" class="margin_top5 margin_left5">
                <div style="float: left">
                  <img :src=goodsImg height="64" width="64"/>
                </div>
                <div>
                  <p class="order_title">{{goodName}}</p>
                </div>
              </el-col>
              <el-col :span="4" class="margin_top5">
                <p class="order_title">¥{{price}}</p>
              </el-col>
              <el-col :span="4" class="margin_top5">
                <p>x{{quantity}}</p>
              </el-col>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="border_all margin_top10 white_bg_color form_title">
      <el-row>
        <el-col :span="3" class="">
          <p><span class="red_color">*</span>服务类型：</p>
        </el-col>
        <el-col :span="21" class="margin_top15 text_align_left">
          <el-button size="small" @click="returnedPurchase()" :class="{isActive:isReturn === true}">退货</el-button>
          <el-button size="small" @click="changedPurchase()" :class="{isActive:isChanged === true}">换货/返修</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <p><span class="red_color">*</span>退款方式：</p>
        </el-col>
        <el-col :span="21" class="text_align_left margin_top15">
          <el-button size="small" @click="originalPayMethod()" :class="{isActive:isOriginalPay === true}">原支付方式返回</el-button>
          <el-button size="small" @click="refundToAccount()" :class="{isActive:isRefund === true}">退款至账户余额</el-button>
          <p class="form_prompt">使用微信支付等在线支付方式只可“原支付方式返回</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <p><span class="red_color">*</span>提交数量：</p>
        </el-col>
        <el-col :span="21" class="text_align_left margin_top15">
          <el-input-number size="small" v-model="num"></el-input-number>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <p><span class="red_color">*</span>提交原因：</p>
        </el-col>
        <el-col :span="21" class="text_align_left margin_top15">
          <el-select v-model="returnReason" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <p><span class="red_color">*</span>问题描述：</p>
        </el-col>
        <el-col :span="21" class="text_align_left margin_top15">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4}"
            placeholder="请输入内容"
            v-model="description">
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <p><span class="red_color">*</span>问题图片：</p>
        </el-col>
        <el-col :span="21" class="text_align_left">
          <el-upload
            class="upload-demo"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            :on-success="handleAvatarSuccess"
            :http-request="Upload">
            <el-button size="small" type="primary" class="margin_top15">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-col>
      </el-row>
      <div class="margin_bottom15">
        <el-button @click="commitAfterSales()">提交</el-button>
      </div>
    </div>
  </div>

</template>
<script>
  import Verify from '../../../utils/utils'
  import swal from 'sweetalert2'; //alert框
  export default {
    data() {
      return {
        goodsImg: '',
        goodName: '',
        price: '',
        quantity: 1,
        isReturn:true, //选中退货按钮
        isChanged:false,//换货
        isOriginalPay:true,//原支付方式返回
        isRefund:false, //退回账户余额
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
          {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        options: [{
          value: 'wrongGoods',
          label: '发错货物'
        }, {
          value: 'qualityProblem',
          label: '质量问题'
        }, {
          value: 'commodityDamage',
          label: '商品损坏'
        }, {
          value: 'other',
          label: '其他'
        }],
        returnReason: '',
        num: 1,
        description: '',
        imageFileId:'',
        fileIds:[],
        imageUrl:'',
        flag:0,//图片id 断点续传会有两个id，暂时通过标记来进行解决
      }
    },
    created(){
      this.getAfterSalesList();
    },
    methods: {
      //售后列表
      getAfterSalesList() {
        let listUrl = "/api/service/item";
        this.$get(listUrl, {
          itemId: this.$route.query.itemId,
        }).then(res => {
          if (JSON.stringify(res.data.code) == 200) {
            this.goodName = res.data.data.name;
            this.price = Verify.toDecimal(res.data.data.salePrice);
            this.quantity = res.data.data.quantity;
            if (Verify.validateIsNull(res.data.data.File)) {
              this.goodsImg = 'http://'+res.data.data.File.url;
            }
            // console.log("售后列表==" + JSON.stringify(res.data));
          } else {
            swal("提示", res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //退货
      returnedPurchase() {
        this.isReturn = !this.isReturn;
        this.isChanged = false;
        // this.$router.push({path: '/ReturnedPurchase', query: {returnedOrderNo: ''}});
      },
      //换货、返修
      changedPurchase(){
        this.isReturn = true;
        this.isChanged = !this.isChanged;
      },
      //原支付方式返回
      originalPayMethod(){
        this.isOriginalPay = !this.isOriginalPay;
        this.isRefund = false;
      },
      //退回账户余额
      refundToAccount(){
        this.isRefund = !this.isRefund;
        this.isOriginalPay = false;
      },
      //提交
      commitAfterSales(){
        // this.$router.push({path: '/CommitSuccessAfterSales'});
        let salesUrl = "/api/service";
        let data ={
          itemId: this.$route.query.itemId,
          orderId:this.$route.query.orderId,
          fileIds:this.fileIds,
        };
        if (this.isReturn === true){
          data['type'] = 'refund';
        } else{
          data['type'] = 'repair';
        }

        if (this.isOriginalPay === 'true'){
          data['refundWays'] = 'original';
        } else{
          data['refundWays'] = 'balance';
        }
        if (Verify.validateIsNull(this.num) && this.num !== 0) {
          data['quantity'] = this.num;
        }
        if (Verify.validateIsNull(this.returnReason)) {
          data['reason'] = this.returnReason;
        }
        if (Verify.validateIsNull(this.description)) {
          data['description'] = this.description;
        }
        this.$post(salesUrl, data).then(res => {
          if (JSON.stringify(res.data.code) == 200) {
            this.$router.push({path: '/CommitSuccessAfterSales', query: {salesTableId: res.data.data.id}});
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      //上传图片
      Upload(file) {
        var url = 'http://file.health.sweetydaddy.com/oss/token?name=' + file.file.name;
        let _self = this;
        _self.$get(url, {}).then(res => {
          if (JSON.stringify(res.data.code) == 200) {

            // console.log('data==' + JSON.stringify(res.data.data));
            let OSS = require('ali-oss')
            let ossConfig = {
              region: res.data.data.region,
              accessKeyId: res.data.data.accessKeyId,
              accessKeySecret: res.data.data.accessKeySecret,
              bucket: res.data.data.bucket,
              stsToken: res.data.data.stsToken
            };
            let client = new OSS(ossConfig);
            //判断扩展名
            const tmpcnt = file.file.name.lastIndexOf(".");
            const exname = file.file.name.substring(tmpcnt + 1);
            const names = ['jpg', 'jpeg', 'webp', 'png', 'bmp'];
            if (names.indexOf(exname) < 0) {
              _self.$message.error("不支持的格式!");
              return;
            }
            let tempCheckpoint;


            // 定义上传方法
            async function multipartUpload() {
              try {
                const fileName = file.file.uid + file.file.name;
                //入参 名称 文件流
                let result = await client.multipartUpload(fileName, file.file, {
                  progress: async function (p, checkpoint) {
                    // 记录断点, 如果关闭了浏览器，然后重新启动继续上传的话，是不行的，请参考上边对file对象的描述
                    tempCheckpoint = checkpoint;
                    _self.flag = p;
                  },
                  meta: {year: 2019, people: 'test',},
                  mime: 'image/*',
                  callback: {
                    url: res.data.data.callback.url,
                    body: res.data.data.callback.body
                  }

                })
                if (JSON.stringify(result.data.code) == 200) {
                  file.onSuccess(result);
                  _self.imageFileId = result.data.data.fileId;
                  _self.$message({
                    message: '图片上传成功',
                    type: 'success'
                  });
                  return result;
                }
                else {
                  vm.disabled = false;
                  file.onError('上传失败');
                  _self.$message.error('图片上传异常，请稍后重试');
                }
              } catch (e) {
                console.error(e)
                // this.disabled = false
                // file.onError('上传失败')
              }
            }

            //开始上传
            multipartUpload();

            // 暂停分片上传方法
            client.cancel();
            // 恢复上传
            let resumeclient = new OSS(ossConfig);

            async function resumeUpload() {
              try {
                const fileName = file.file.uid + file.file.name;
                let result = await client.multipartUpload(fileName, file.file, {
                  progress: async function (p, checkpoint) {
                    tempCheckpoint = checkpoint;
                  },
                  checkpoint: tempCheckpoint,
                  meta: {year: 2017, people: 'test'},
                  mime: 'image/jpeg',
                  callback: {
                    url: res.data.data.callback.url,
                    body: res.data.data.callback.body
                  }
                })
                if (JSON.stringify(result.res.statusCode) == 200) {
                  file.onSuccess(result);
                  _self.imageFileId = result.data.data.fileId;
                  _self.$message({
                    message: '图片上传成功',
                    type: 'success'
                  });
                  return result
                }
                else {
                  vm.disabled = false;
                  file.onError('上传失败');
                  _self.$message.error('图片上传异常，请稍后重试');
                }
              } catch (e) {
                console.log(e);
              }
            }

            resumeUpload();
            // if (Verify.validateIsNull(this.imageFileId)){
            //   this.fileIds.push(this.imageFileId);
            // }

          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      handleAvatarSuccess(res, file) {
        if (this.flag === 1) {
          this.fileIds.push(res.data.data.fileId);
        }
        this.flag = 0;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
    }
  }
</script>
<style>
  @import "../../../styles/personal/personal-center.scss";
  .header_bg {
    background-color: white;
    text-align: right;
    font-size: 18px;
    color: #333333;
  }
  .el-breadcrumb {
    font-size: 18px;
    line-height: 3.5;
    color: #333333;
  }
  .padding_left10 {
    padding-left: 10px;
  }

  .padding_top10 {
    padding-top: 10px;
  }

  .padding10 {
    padding: 10px;
  }

  .red_color {
    color: red;
  }

  .border_all {
    border: 1px solid lightgrey;
  }

  .margin_top5 {
    margin-top: 5px;
  }

  .margin_top10 {
    margin-top: 10px;
  }

  .margin_top15 {
    margin-top: 15px;
  }

  .margin_left5 {
    margin-left: 5px;
  }

  .white_bg_color {
    background-color: white;
  }

  .list_header{
    background: #F6F6F6;
    font-size:14px;
  }
  .form_title{
    font-size: 14px;
    color: #404040;
  }
  .form_prompt{
    font-size: 12px;
    color: #666666;
  }
  .isActive{
    background: #DF2321;
    color: white;
  }
</style>


