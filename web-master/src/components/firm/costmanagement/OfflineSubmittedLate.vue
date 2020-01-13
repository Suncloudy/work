<template>
  <div>
    <!--<el-header class="header_bg">-->
      <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
        <!--<el-breadcrumb-item :to="{ path: '/' }">费用管理</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>线下汇款</el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</el-header>-->

    <div class="white_bg_color">
      <div class="regular_font online_prompt">
        <ol class="text_align_left">
          <li>
            非线上充值，请您在完成银行汇款后，尽快提交汇款底单信息；底单审核通过后，您的资金将充入帐号：xxxxx@xx.xx
          </li>
          <li>
            如需线下汇款，请查看：
            <el-button type="text" size="small" class="setting_invoice_info padding_top_bottom0"
                       @click="offlineRemittance()"><u>如何线下汇款</u>
            </el-button>
          </li>
        </ol>
      </div>
      <el-row>
        <el-col :span="18">
          <el-form :model="remittanceInfo" label-width="130px" class="data_form" :rules="invoiceRules" ref="invoiceInfo">

            <el-form-item label="提交方式">
              <el-radio-group v-model="remittanceInfo.commitWay">
                <el-radio label="0">提交汇款底单扫描件</el-radio>
                <el-radio label="1">填写汇款底单信息</el-radio>
              </el-radio-group>
            </el-form-item>

            <div v-if="remittanceInfo.commitWay === '0'">
              <el-form-item label="汇款底单扫描" prop="scanRemittance">
                <!--<el-input v-model="remittanceInfo.invoiceName" autocomplete="off" placeholder="请输入企业名称"-->
                <!--disabled=""></el-input>-->
                <el-upload
                  class="avatar-uploader"
                  action=""
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :http-request="Upload">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">请上传2M以内，jJPG, GIF, PNG格式的图片文件</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="联系人" prop="contact">
                <el-input v-model="remittanceInfo.contacts" autocomplete="off"
                          placeholder="请输入联系人"></el-input>
              </el-form-item>
              <el-form-item label="联系人手机号" prop="contactTel">
                <el-input v-model="remittanceInfo.contactTel" autocomplete="off" placeholder="请输入联系人手机号"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="remittanceInfo.remarks"></el-input>
              </el-form-item>

            </div>
            <div v-if="remittanceInfo.commitWay === '1'">
              <el-form-item label="汇款银行账号" prop="bankAccount">
              <el-input v-model="remittanceInfo.bankAccount" autocomplete="off"
                        placeholder="请输入汇款银行账号"></el-input>
            </el-form-item>
              <el-form-item label="汇款人" prop="remitter">
                <el-input v-model="remittanceInfo.remitter" autocomplete="off"
                          placeholder="请输入汇款人"></el-input>
              </el-form-item>
              <el-form-item label="汇款金额" prop="remittanceAmount">
                <el-input v-model="remittanceInfo.remittanceAmount" autocomplete="off"
                          placeholder="请输入汇款金额"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="infoContacts">
                <el-input v-model="remittanceInfo.infoContacts" autocomplete="off"
                          placeholder="请输入联系人"></el-input>
              </el-form-item>
              <el-form-item label="联系人手机号" prop="infoContactTel">
                <el-input v-model="remittanceInfo.infoContactTel" autocomplete="off" placeholder="请输入联系人手机号"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="remittanceInfo.infoRemarks"></el-input>
              </el-form-item>

            </div>
            <el-form-item label="">
              <el-button size="medium" class="confirm_invoice_info" @click="confirmInfo()">确定</el-button>
            </el-form-item>
          </el-form>

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import swal from 'sweetalert2'; //alert框
  import Verify from '../../../utils/utils';

  export default {
    name: "OfflineSubmittedLate",
    data() {
      return {
        imgUrl:'',
        remittanceInfo: {
          commitWay: '0',
          //汇款底单扫描件
          scanRemittance:'',
          contacts:'',
          contactTel:'',
          remarks:'',
          //填写汇款底单信息
          bankAccount:'',
          remitter:'',
          remittanceAmount:'',
          infoContacts:'',
          infoContactTel:'',
          infoRemarks:''
        },
        invoiceRules:
          {
            contact:[
              {required: true, message: '请输入联系人', trigger: 'blur'},
              {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
            ],
            scanRemittance:[
              {required: true, message: '', trigger: 'blur'},
            ],
            contactTel:[
              {required: true, message: '请输入手机号', trigger: 'blur'},
              {validator: Verify.phoneNumberVerify, trigger: 'blur'},
            ],
            bankAccount:[
              {required: true, message: '请输入汇款银行账号', trigger: 'blur'},
              {validator: Verify.checkBankCardNumber, trigger: 'blur'},
            ],
            remitter:[
              {required: true, message: '请输入汇款人', trigger: 'blur'},
            ],
            remittanceAmount:[
              {required: true, message: '请输入汇款金额人', trigger: 'blur'},
            ],
            infoContacts:[
              {required: true, message: '请输入联系人', trigger: 'blur'},
            ],
            infoContactTel:[
              {required: true, message: '请输入手机号', trigger: 'blur'},
              {validator: Verify.phoneNumberVerify, trigger: 'blur'},
            ]
            // birth: [
            //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            // ],
          }
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created(){
      console.log("123=="+this.remittanceInfo.commitWay);
    },
    methods: {
      offlineRemittance() {

      },
      confirmInfo(){
        let enterpriseId = localStorage.getItem("enterpriseId");
        let url = "/api/enterprise/remittances/" + enterpriseId;

        if (this.remittanceInfo.commitWay ==0) {
          let note='';
          if (this.remittanceInfo.remarks.length !=0){
            note = this.remittanceInfo.remarks;
          }
          this.$post(url, {
            commitWay:this.remittanceInfo.commitWay,
            contact:this.remittanceInfo.contacts,
            phoneNumber:this.remittanceInfo.contactTel,
            note:note,
            image:this.imageUrl,
          }).then(res => {
            if (res.data.code === 200) {
              this.orderListData = res.data.data.items;
              for (const i in this.orderListData) {
                //invoiceDate 开票时间
                let createDate = Verify.convertDate(this.tableData[i].invoiceDate);
                this.tableData[i]['createDate'] = createDate;
              }
              // console.log("order list data ==" + JSON.stringify(res));
            } else {
              swal("提示", "请稍后重试", "error");
            }
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });
        }else{
          let note='';
          if (this.remittanceInfo.infoRemarks.length !=0) {
            note = this.remittanceInfo.infoRemarks;
          }
          this.$post(url, {
            commitWay:this.remittanceInfo.commitWay,
            contact:this.remittanceInfo.infoContacts,
            phoneNumber:this.remittanceInfo.infoContactTel,
            bankAccount:this.remittanceInfo.bankAccount,
            money:this.remittanceInfo.remittanceAmount,
            name:this.remittanceInfo.remitter,
            note:this.remittanceInfo.infoRemarks
          }).then(res => {
            if (res.data.code === 200) {
              this.orderListData = res.data.data.items;
              for (const i in this.orderListData) {
                //invoiceDate 开票时间
                let createDate = Verify.convertDate(this.tableData[i].invoiceDate);
                this.tableData[i]['createDate'] = createDate;
              }
              // console.log("order list data ==" + JSON.stringify(res));
            } else {
              //JSON.stringify(res.data.message)
              swal("提示", res.data.msg, "error");
            }
            // console.log("res=="+JSON.stringify(res))
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });
        }

      },
      //上传图片
      Upload(file) {
        var url = 'http://file.health.sweetydaddy.com/oss/token?name=' + file.file.name;
        let _self = this;
        _self.$get(url, {}).then(res => {
          if (res.data.code === 200) {
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
            const tmpcnt = file.file.name.lastIndexOf(".")
            const exname = file.file.name.substring(tmpcnt + 1)
            const names = ['jpg', 'jpeg', 'webp', 'png', 'bmp','JPG','PNG']
            if (names.indexOf(exname) < 0) {
              _self.$message.error("不支持的格式!")
              return
            }
            let tempCheckpoint;

            // 定义上传方法
            async function multipartUpload() {
              try {
                const fileName = file.file.uid+file.file.name ;
                //入参 名称 文件流
                let result = await client.multipartUpload(fileName, file.file, {
                  progress: async function (p, checkpoint) {
                    // 记录断点, 如果关闭了浏览器，然后重新启动继续上传的话，是不行的，请参考上边对file对象的描述
                    tempCheckpoint = checkpoint;
                    console.log('p=' + p)
                  },
                  meta: {year: 2019, people: 'test',},
                  mime: 'image/*',
                  callback:{
                    url: res.data.data.callback.url,
                    body : res.data.data.callback.body
                  }

                })
                if (result.data.code === 200) {
                  file.onSuccess(result);
                  _self.imgUrl = result.data.data.url;
                  // _self.imageFileId = result.data.data.fileId;
                  this.$message({
                    message: '上传成功',
                    type: 'success'
                  });
                  return result
                }
                else {
                  vm.disabled = false
                  file.onError('上传失败')
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
                const fileName = file.file.name + file.file.uid;
                let result = await client.multipartUpload(fileName, file.file, {
                  progress: async function (p, checkpoint) {
                    tempCheckpoint = checkpoint;
                  },
                  checkpoint: tempCheckpoint,
                  meta: {year: 2017, people: 'test'},
                  mime: 'image/jpeg',
                  callback:{
                    url: res.data.data.callback.url,
                    body : res.data.data.callback.body
                  }
                })
                if (result.data.code === 200) {
                  file.onSuccess(result)
                  // swal("提示", "上传成功", "success");
                  return result
                }
                else {
                  vm.disabled = false
                  file.onError('上传失败')
                }
              } catch (e) {
                console.log(e);
              }
            }

            resumeUpload();

          } else {
            alert(res.data.message);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    },

  }
</script>

<style scoped>
  @import "../../../styles/personal/personal-center.scss";

  .data_form {
    width: 450px;
    padding-top: 30px;
    padding-bottom: 30px;
  }

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

  .online_prompt {
    margin: 10px;
    background: rgba(246, 246, 246, 1);
    border: 1px solid rgba(189, 186, 187, 1);
  }

  .regular_font {
    color: #666666;
    font-size: 14px;
  }

  .setting_invoice_info {
    color: #009BDD;
    font-size: 14px;
  }

  .padding_top_bottom0 {
    padding-top: 0px;
    padding-bottom: 0px;
  }
  .confirm_invoice_info{
    width:300px;
    background-color:#33B2E8;
    font-size: 17px;
    color: #FFFFFF;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d5d5d5;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #405EFF;
  }


</style>

