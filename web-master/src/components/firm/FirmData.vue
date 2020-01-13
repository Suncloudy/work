<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>{{(asideNavTitle[0] === '' || asideNavTitle[0] === undefined )?
            '账号管理':asideNavTitle[0]}}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{(asideNavTitle[1] === '' || asideNavTitle[1] === undefined )?
            '企业资料':asideNavTitle[1]}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-breadcrumb>
    </el-header>
    <div class="white_bg_color margin_top10">
      <el-row :class="{modifyClass:whether}">
        <el-col :span="17" class="firm_info">
          <el-row>
            <el-col :span="4">
              <p>企业代码</p>
            </el-col>
            <el-col :span="14" class="text_align_left">
              <p>{{code}}</p>
            </el-col>
            <el-col :span="6">
              <p v-if="code.length !==0">
                <img src="../../assets/firm/sccg_icon_login@2x.png" height="16" width="16"/>
                <span>已设置</span>
              </p>
              <p v-else="code.length ===0">
                <img src="../../assets/firm/weishezhi_icon@2x.png" height="16" width="16"/>
                <span>未设置</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <p>企业名称</p>
            </el-col>
            <el-col :span="14" class="text_align_left">
              <p>{{name}}</p>
            </el-col>
            <el-col :span="6">
              <p v-if="name.length !==0">
                <img src="../../assets/firm/sccg_icon_login@2x.png" height="16" width="16"/>
                <span>已设置</span>
              </p>
              <p v-else="name.length ===0">
                <img src="../../assets/firm/weishezhi_icon@2x.png" height="16" width="16"/>
                <span>未设置</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <p>联系人</p>
            </el-col>
            <el-col :span="14" class="text_align_left">
              <p>{{contacts}}</p>
            </el-col>
            <el-col :span="6">
              <p v-if="name.length !==0">
                <img src="../../assets/firm/sccg_icon_login@2x.png" height="16" width="16"/>
                <span>已设置</span>
              </p>
              <p v-else="name.length ===0">
                <img src="../../assets/firm/weishezhi_icon@2x.png" height="16" width="16"/>
                <span>未设置</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <p>联系电话</p>
            </el-col>
            <el-col :span="14" class="text_align_left">
              <p>{{contactTel}}</p>
            </el-col>
            <el-col :span="6">
              <p v-if="contactTel.length !==0">
                <img src="../../assets/firm/sccg_icon_login@2x.png" height="16" width="16"/>
                <span>已设置</span>
              </p>
              <p v-else="contactTel.length ===0">
                <img src="../../assets/firm/weishezhi_icon@2x.png" height="16" width="16"/>
                <span>未设置</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <p>联系地址</p>
            </el-col>
            <el-col :span="14" class="text_align_left">
              <p>{{address}}</p>
            </el-col>
            <el-col :span="6">
              <p v-if="address.length !==0">
                <img src="../../assets/firm/sccg_icon_login@2x.png" height="16" width="16"/>
                <span>已设置</span>
              </p>
              <p v-else="address.length ===0">
                <img src="../../assets/firm/weishezhi_icon@2x.png" height="16" width="16"/>
                <span>未设置</span>
              </p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <el-button class="save_btn" @click="modifyFirmInfo()">修改</el-button>
        </el-col>
      </el-row>
      <el-row :class="{modifyClass:!whether}">
        <el-col :span="14">
          <el-form :model="firmForm" label-width="80px" class="data_form" :rules="rules" ref="firmForm">
            <el-form-item label="企业代码">
              <el-input v-model="firmForm.code" autocomplete="off" placeholder="请输入企业代码"></el-input>
            </el-form-item>
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="firmForm.name" autocomplete="off" placeholder="请输入企业名称" disabled=""></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contacts">
              <el-input v-model="firmForm.contacts" autocomplete="off" placeholder="请输入真实姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactTel">
              <el-input v-model="firmForm.contactTel" autocomplete="off" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="联系地址">
              <el-row :gutter="10">
                <el-col :span="7">
                  <el-select v-model="firmForm.province" placeholder="请选择省" @change="selectProvinceEvent(firmForm.province)">
                    <el-option
                      v-for="(value,key) in addressData['86']"
                      :key="key"
                      :label="value"
                      :value="key">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="7">
                  <el-select v-model="firmForm.city" placeholder="请选择市" @change="selectCityEvent(firmForm.city)">
                    <el-option
                      v-for="(value,key) in addressData[firmForm.province]"
                      :key="key"
                      :label="value"
                      :value="key">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="7">
                  <el-select v-model="firmForm.region" placeholder="区县">
                    <el-option
                      v-for="(value,key) in addressData[firmForm.city]"
                      :key="key"
                      :label="value"
                      :value="key">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="firmForm.address" autocomplete="off" placeholder="请输入详细地址"></el-input>
            </el-form-item>

          </el-form>

        </el-col>
        <el-col :span="10">
          <el-button class="save_btn margin_top30" @click="saveFirmInfo()">保存</el-button>

        </el-col>
      </el-row>
      <hr class="dashed_hr"/>
      <el-row>
        <el-col :span="3">
          <p class="number_unit"><span class="number">{{departNumber}}</span>个</p>
          <p class="number_unit" @click="firmDepart()">企业部门</p>
        </el-col>
        <el-col :span="3">
          <p class="number_unit"><span class="number">{{staffNumber}}</span>个</p>
          <p class="number_unit" @click="firmMember()">企业成员</p>
        </el-col>
        <el-col :span="6">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :http-request="Upload">
            <!--<el-button size="small" type="primary">点击上传</el-button>-->
            <!--<div class="logo_div">-->
            <!--上传logo-->
            <!--</div>-->
            <img v-if="logoUrl" :src="logoUrl" class="avatar_logo">
            <i v-else class="el-icon-plus avatar-uploader-icon_logo"></i>
            <div slot="tip" class="el-upload__tip">Logo，推荐尺寸180x90px，大小不超过500K，JPG, GIF, PNG格式的图片文件</div>
          </el-upload>
        </el-col>
        <el-col :span="3">
          <!--<div class="uploading_license">上传营业执照</div>-->
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleLicenseSuccess"
            :http-request="licenseUpload">
            <!--<el-button size="small" type="primary">点击上传</el-button>-->
            <!--<div class="logo_div">-->
            <!--上传logo-->
            <!--</div>-->
            <img v-if="licenseUrl" :src="licenseUrl" class="uploading_license">
            <i v-else class="el-icon-plus license-uploader-icon_logo"></i>
            <div slot="tip" class="el-upload__tip">企业营业执照，推荐使用JPG, GIF, PNG格式的图片文件</div>
          </el-upload>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import VerifyUtils from '../../utils/utils';
  export default {
    name: "FirmData",
    props: ['selectTitle'],
    data() {
      return {
        labelPosition: 'right',
        code: '',
        name: '',
        contacts: '',
        contactTel: '',
        province: '',
        city: '',
        region: '',
        address: '',
        departNumber:0,
        staffNumber:0,
        whether: false,
        firmForm: {
          code: '',
          name: '',
          contacts: '',
          contactTel: '',
          province: '',
          city: '',
          region: '',
          address: '',
        },
        addressData:[],
        cities: [],
        rules:
          {
            userName: [
              {required: true, message: '请输入真实姓名', trigger: 'blur'},
              {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
            ],
            email: [
              {required: true, message: '请输入邮箱地址', trigger: 'blur'},
              {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
            ],
            contactTel:[
              {validator: VerifyUtils.telephoneVerify, trigger: 'blur'}
            ]
            // birth: [
            //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            // ],
          },
        logoUrl:'',//企业logo
        logoFileId:'',
        licenseUrl:'',//企业营业执照图片
        licenseFileId:''
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      this.getFirmInfo();
      this.getCityData();
    },
    methods: {
      //选择省份的事件
      selectProvinceEvent(key){
        var numReg = /^[0-9]+$/;
        var numRe = new RegExp(numReg);
        if (key != undefined && numRe.test(key)) {
          var arr = [];
          for(let i in this.addressData[key]){
            arr.push(i)
          }
          this.firmForm.city = arr[0];
          var county = [];
          for (let j in this.addressData[this.firmForm.city]) {
            county.push(j);
          }
          this.firmForm.region = county[0];
          // this.detailAddress = this.addressData['86'][this.selectedProvince];
        }
      },
      //选择城市的事件
      selectCityEvent(val){
        var numReg = /^[0-9]+$/;
        var numRe = new RegExp(numReg);
        if (val != undefined && numRe.test(val)) {
          var arr = [];
          for(let i in this.addressData[val]){
            arr.push(i)
          }
          this.firmForm.region = arr[0];
        }
      },
      getFirmInfo(){
        let enterpriseId = localStorage.getItem("enterpriseId");
        var firmInfo = '/api/enterprise/profile/' + enterpriseId;
        this.$get(firmInfo, {
          // enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            this.code = res.data.data.identity;
            this.name = res.data.data.enterpriseName;
            this.contacts = res.data.data.contact;
            this.contactTel = res.data.data.telephone;
            this.province = res.data.data.province;
            this.city = res.data.data.city;
            this.region = res.data.data.county;
            this.address = res.data.data.address;
            if (VerifyUtils.validateIsNull(res.data.data.licenseUrl)) {
              this.licenseUrl = 'http://'+res.data.data.licenseUrl;
            }
            if (VerifyUtils.validateIsNull(res.data.data.logoUrl)) {
              this.logoUrl = 'http://'+res.data.data.logoUrl;
            }
            // let provinceCode = res.data.data.province;//省编码
            // let cityCode = res.data.data.city;//市编码
            // let countyCode = res.data.data.county;//县编码
            // this.province = this.addressData['86'][provinceCode];
            // this.city = this.addressData[provinceCode][cityCode];
            // if(VerifyUtils.validateIsNull(countyCode)) {
            //   this.region = this.addressData[cityCode][countyCode];
            // }
            // this.address = this.province + this.city + this.county;
            this.staffNumber = res.data.data.employee;
            this.departNumber = res.data.data.department;
            // console.log("test" + JSON.stringify(res.data.data));
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //修改企业信息
      modifyFirmInfo() {
        this.whether = true;
        this.firmForm.code = this.code;
        this.firmForm.name = this.name;
        this.firmForm.contacts = this.contacts;
        this.firmForm.contactTel = this.contactTel;
        this.firmForm.province = this.province;
        this.firmForm.city = this.city;
        this.firmForm.region = this.region;
        this.firmForm.address = this.address;

      },
      //保存企业信息
      saveFirmInfo() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        var firmInfo = '/api/enterprise/profile/' + enterpriseId;
        let data = {};
        if (VerifyUtils.validateIsNull(this.firmForm.code)) {
          data['identity'] = this.firmForm.code;
        }
        if (VerifyUtils.validateIsNull(this.firmForm.contacts)) {
          data['contact'] = this.firmForm.contacts;
        }
        if (VerifyUtils.validateIsNull(this.firmForm.province)) {
          data['province'] = this.firmForm.province;
        }
        if (VerifyUtils.validateIsNull(this.firmForm.city)) {
          data['city'] = this.firmForm.city;
        }
        if (VerifyUtils.validateIsNull(this.firmForm.region)) {
          data['county'] = this.firmForm.region;
        }
        if (VerifyUtils.validateIsNull(this.firmForm.address)) {
          data['address'] = this.firmForm.address;
        }
        if (VerifyUtils.validateIsNull(this.firmForm.contactTel)) {
          data['telephone'] = this.firmForm.contactTel;
        }
        if (VerifyUtils.validateIsNull(this.logoFileId)) {
          data['logoFileId'] = this.logoFileId;
        }
        if (VerifyUtils.validateIsNull(this.licenseFileId)) {
          data['licenseFileId'] = this.licenseFileId;
        }
        this.$put(firmInfo, data).then(res => {
          if (res.data.code === 200) {
            this.whether = false;
            this.getFirmInfo();
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            // console.log("test" + JSON.stringify(res.data.data));
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });

      },
      //获取城市列表的json
      getCityData() {
        const config = require('../../../static/region');
        // this.firmAddress = config['86'];
        this.addressData = config;
      },
      firmDepart(){
        this.$router.push('/FirmStructure');
      },
      firmMember(){
        this.$router.push('/FirmMember');
      },
      //企业Logo上传图片
      handleAvatarSuccess(res, file) {
        this.logoUrl = URL.createObjectURL(file.raw);
      },
      Upload(file) {
        var url = 'http://file.health.sweetydaddy.com/oss/token?name=' + file.file.name;
        let _self = this
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
                const fileName = file.file.uid + file.file.name;
                //入参 名称 文件流
                let result = await client.multipartUpload(fileName, file.file, {
                  progress: async function (p, checkpoint) {
                    // 记录断点, 如果关闭了浏览器，然后重新启动继续上传的话，是不行的，请参考上边对file对象的描述
                    tempCheckpoint = checkpoint;
                    console.log('p=' + p)
                  },
                  meta: {year: 2019, people: 'test',},
                  mime: 'image/*',
                  callback: {
                    url: res.data.data.callback.url,
                    body: res.data.data.callback.body
                  }

                })
                if (result.data.code === 200) {
                  file.onSuccess(result);
                  // console.log("url==" + result.data.data.url);
                  _self.logoFileId = result.data.data.fileId;
                  _self.logoUrl = "http://" + result.data.data.url;
                  _self.$message({
                    message: '图片已上传',
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
                const fileName = file.file.uid + file.file.name;
                let result = await client.multipartUpload(fileName, file.file, {
                  progress: async function (p, checkpoint) {
                    tempCheckpoint = checkpoint;
                  },
                  checkpoint: tempCheckpoint,
                  meta: {year: 2019, people: 'test'},
                  mime: 'image/*',
                  callback: {
                    url: res.data.data.callback.url,
                    body: res.data.data.callback.body
                  }
                })
                if (result.data.code === 200) {
                  file.onSuccess(result)
                  _self.logoFileId = result.data.data.fileId;
                  _self.logoUrl = "http://" + result.data.data.url;
                  // _self.$message({
                  //   message: '图片已上传',
                  //   type: 'success'
                  // });
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

      //企业营业执照上传图片
      handleLicenseSuccess(res, file) {
        this.licenseUrl = URL.createObjectURL(file.raw);
      },
      licenseUpload(file) {
        var url = 'http://file.health.sweetydaddy.com/oss/token?name=' + file.file.name;
        let _self = this
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
                const fileName = file.file.uid + file.file.name;
                //入参 名称 文件流
                let result = await client.multipartUpload(fileName, file.file, {
                  progress: async function (p, checkpoint) {
                    // 记录断点, 如果关闭了浏览器，然后重新启动继续上传的话，是不行的，请参考上边对file对象的描述
                    tempCheckpoint = checkpoint;
                    console.log('p=' + p)
                  },
                  meta: {year: 2019, people: 'test',},
                  mime: 'image/*',
                  callback: {
                    url: res.data.data.callback.url,
                    body: res.data.data.callback.body
                  }

                })
                if (result.data.code === 200) {
                  file.onSuccess(result);
                  // console.log("fileId==" + result.data.data.fileId);
                  // console.log("url==" + result.data.data.url);
                  _self.licenseFileId = result.data.data.fileId;
                  _self.licenseUrl = "http://" + result.data.data.url;
                  _self.$message({
                    message: '营业执照已上传',
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
                const fileName = file.file.uid + file.file.name;
                let result = await client.multipartUpload(fileName, file.file, {
                  progress: async function (p, checkpoint) {
                    tempCheckpoint = checkpoint;
                  },
                  checkpoint: tempCheckpoint,
                  meta: {year: 2019, people: 'test'},
                  mime: 'image/*',
                  callback: {
                    url: res.data.data.callback.url,
                    body: res.data.data.callback.body
                  }
                })
                if (result.data.code === 200) {
                  file.onSuccess(result)
                  _self.licenseFileId = result.data.data.fileId;
                  _self.licenseUrl = "http://" + result.data.data.url;
                  // _self.$message({
                  //   message: '营业执照已上传',
                  //   type: 'success'
                  // });
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
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
    }

  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";

  .header_bg {
    background-color: white;
    text-align: right;
    font-size: 18px;
    color: #333333;
  }

  .dashed_hr {
    height: 5px;
    border: none;
    border-top: 3px dashed #6f7180;

  }

  .modifyClass {
    display: none;
  }

  .el-breadcrumb {
    line-height: 3.5;
    font-size: 18px;
  }

  .data_form {
    width: 370px;
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .firm_info {
    font-size: 14px;
    color: #666666;
  }

  .save_btn {
    width: 180px;
    background-color: #33B2E8;
    border-radius: 4px;
    color: white;
    margin-top: 10px;
  }

  .margin_top30 {
    margin-top: 20px;
  }

  .number {
    font-size: 30px;
    color: #33B2E8;
  }

  .number_unit {
    font-size: 14px;
    color: #404040;
  }

  .logo_hint {
    font-size: 12px;
    color: #666666;
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

  .avatar-uploader-icon_logo {
    font-size: 28px;
    color: #8c535d;
    width: 180px;
    height: 90px;
    opacity: 0.7;
    background: #000000;
    line-height: 90px;
    text-align: center;
  }

  .avatar_logo {
    width: 180px;
    height: 90px;
    display: block
  }

  .uploading_license {
    width: 75px;
    height: 90px;
    opacity: 0.7;
    background: #000000;
  }
  .license-uploader-icon_logo{
    font-size: 28px;
    color: #8c535d;
    width: 75px;
    height: 90px;
    opacity: 0.7;
    background: #000000;
    line-height: 90px;
    text-align: center;
  }

</style>
