<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{asideNavTitle.length!=0?asideNavTitle[0]:"账号管理"}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{asideNavTitle.length != 0?asideNavTitle[1]:"收货地址"}}</el-breadcrumb-item>
        <el-button @click="addShippingAddress()" class="addBtn">添加收货地址</el-button>
      </el-breadcrumb>
    </el-header>
    <el-table
      :data="tableData"
      border
      class="address_table">
      <el-table-column
        prop="name"
        label="地址名称"
        width="">
        <template slot-scope="scope">
          <span>{{scope.row.name === null?"———":scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="receiver"
        label="收货人"
        width="">
      </el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="手机号"
        width="">
      </el-table-column>
      <el-table-column
        prop="detailAddress"
        label="地址"
        width="">
      </el-table-column>
      <el-table-column
        prop=""
        label="是否默认"
        width="">
        <template slot-scope="scope">
          <span>{{scope.row.default === true?"是":"否"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <div class="del_goods">
            <el-button  @click="setDefaultAddress(scope.row)" type="text" size="small">{{scope.row.default
              ===true?"取消默认":"设为默认"}}
            </el-button>
            <el-button type="text" size="small" @click="modifyAddress(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteAddress(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" v-if="total>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total=total>
      </el-pagination>
    </div>
    <!--添加收货地址-->
    <el-dialog title="添加收货地址" :visible.sync="dialogFormVisible" width="40%" center>
      <el-form :model="addressForm" ref="addressForm">
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <el-input v-model="addressForm.receiver" autocomplete="off" placeholder="请确认收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="addressForm.tel" autocomplete="off" placeholder="请输入收货人手机号码"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" :label-width="formLabelWidth">
          <el-row :gutter="10">
            <el-col :span="7">
              <!--<el-select v-model="addressForm.province" placeholder="省份">-->
                <!--<el-option-->
                  <!--v-for="item in cities"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                  <!--<span style="float: left">{{ item.label }}</span>-->
                <!--</el-option>-->
              <!--</el-select>-->
              <el-select v-model="addressForm.province" placeholder="省份" @change="selectProvinceEvent(addressForm.province)">
                <el-option
                  v-for="(value,key) in addressData['86']"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-select v-model="addressForm.city" placeholder="市" @change="selectCityEvent(addressForm.city)">
                <el-option
                  v-for="(value,key) in addressData[addressForm.province]"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-select v-model="addressForm.region" placeholder="区县">
                <el-option
                  v-for="(value,key) in addressData[addressForm.city]"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="addressForm.address" autocomplete="off" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="地址名称" :label-width="formLabelWidth">
          <el-input v-model="addressForm.desc" autocomplete="off" placeholder="如：家、公司"></el-input>
          <el-checkbox v-model="checked">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddAddress()">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改收货地址-->
    <el-dialog title="修改收货地址" :visible.sync="modifyFormVisible" width="40%" center>
      <el-form :model="formRowData">
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <el-input v-model="formRowData.receiver" autocomplete="off" placeholder="请确认收货人"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="formRowData.phoneNumber" autocomplete="off" placeholder="请输入体检人手机号码"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" :label-width="formLabelWidth">
          <el-row :gutter="10">
            <el-col :span="7">
              <!--<el-select v-model="formRowData.province" placeholder="省份">-->
                <!--<el-option-->
                  <!--v-for="item in cities"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                  <!--<span style="float: left">{{ item.label }}</span>-->
                <!--</el-option>-->
              <!--</el-select>-->
              <el-select v-model="formRowData.province" placeholder="请选择省"  @change="selectProvinceEvent(formRowData.province)">
                <el-option
                  v-for="(value,key) in addressData['86']"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <!--<el-select v-model="formRowData.county" placeholder="城市">-->
                <!--<el-option-->
                  <!--v-for="item in cities"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                  <!--<span style="float: left">{{ item.label }}</span>-->
                <!--</el-option>-->
              <!--</el-select>-->
              <el-select v-model="formRowData.city" placeholder="请选择市" @change="selectCityEvent(formRowData.city)">
                <el-option
                  v-for="(value,key) in addressData[formRowData.province]"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <!--<el-select v-model="formRowData.county" placeholder="区县">-->
                <!--<el-option-->
                  <!--v-for="item in cities"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                  <!--<span style="float: left">{{ item.label }}</span>-->
                <!--</el-option>-->
              <!--</el-select>-->
              <el-select v-model="formRowData.county" placeholder="请选择区县">
                <el-option
                  v-for="(value,key) in addressData[formRowData.city]"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="formRowData.address" autocomplete="off" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="地址名称" :label-width="formLabelWidth">
          <el-input v-model="formRowData.name" autocomplete="off" placeholder="如：家、公司"></el-input>
          <el-checkbox v-model="formRowData.default">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureModifyAddress()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Verify from '../../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {mapGetters} from 'vuex'

  export default {
    name: "HarvestAddress",
    props: ['selectTitle'],
    data() {
      return {
        tableData: [],
        total: 0,
        currentPage: 1,
        dialogFormVisible: false,
        checked: true,
        addressForm: {
          receiver: '',
          tel: '',
          province: '',
          city: '',
          region: '',
          address: '',
          desc: '',
        },
        modifyFormVisible: false,
        formRowData: [],
        formLabelWidth: '100px',
        // selectedProvince: null,
        // selectedCity: null,
        // selectedCounty: null,
        cities: [],
        addressData:[],
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      this.getShippingAddressData();
      this.getCityData();
    },
    methods: {
      selectProvinceEvent(key){
        var numReg = /^[0-9]+$/;
        var numRe = new RegExp(numReg);
        if (key != undefined && numRe.test(key)) {
          var arr = [];
          for(let i in this.addressData[key]){
            arr.push(i)
          }
          this.addressForm.city = arr[0];
          var county = [];
          for (let j in this.addressData[this.addressForm.city]) {
            county.push(j);
          }
          this.addressForm.region = county[0];
          // this.detailAddress = this.addressData['86'][this.selectedProvince];
        }
      },
      selectCityEvent(val){
        var numReg = /^[0-9]+$/;
        var numRe = new RegExp(numReg);
        if (val != undefined && numRe.test(val)) {
          var arr = [];
          for(let i in this.addressData[val]){
            arr.push(i)
          }
          this.addressForm.region = arr[0];
          // this.detailAddress += this.addressData[this.selectedProvince][this.selectedCity];
        }
      },
      //获取列表数据
      getShippingAddressData() {
        let userId = localStorage.getItem("userId");
        // let url = "/api/user/addresss/" + userId;
        let url = "/api/personal/" + userId + '/address';
        this.$get(url, {
          page: this.currentPage,
          perPage: 10,
        }).then(res => {
          // console.log(JSON.stringify(res))
          if (res.data.code === 200) {
            this.tableData = res.data.data.items;
            this.total = res.data.data.total;
            for (let i= 0;i<this.tableData.length;i++) {
              let province = this.tableData[i].province;
              let city = this.tableData[i].city;
              let county = this.tableData[i].county;
              this.tableData[i]['detailAddress'] = this.addressData['86'][province] + this.addressData[province][city] +this.addressData[city][county];
              // console.log("data ==" + JSON.stringify( this.addressData['86'][province]));
              // console.log("data ==" + JSON.stringify( this.addressData[province][city]));
              // console.log("data ==" + JSON.stringify( this.addressData[city][county]));
            }
            // this.currentPage = res.data.data.page;
            // console.log("data ==" + JSON.stringify(this.tableData));
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getShippingAddressData();
      },
      //设为默认地址
      setDefaultAddress(row) {
        console.log("row==" + JSON.stringify(row));
        let str = "是否确定设为默认地址?";
        if (row.default == true) {
          str = "是否确定取消设为默认地址？";
        }
        swal({
          title: str,
          text: "",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            let addressId = row.addressId;
            // console.log(addressId+"==="+JSON.stringify(row.addressId))
            let url = '';
            if (row.default == true) {
              url = '/api/personal/'+addressId+'/optionAddress';
            }else{
              url = '/api/personal/'+addressId+'/defaultAddress';
            }
            this.$put(url, {}).then((res) => {
              // console.log("adminId==" + JSON.stringify(res) + row + JSON.stringify(row));
              if (res.data.code === 200) {
                // if (this.checked == true) {
                //   swal("提示", "已成功取消设为默认地址", "success");
                // } else {
                  swal("提示", "已设置", "success");
                // }
              } else {
                swal("提示", res.data.msg, "error");
              }
              this.getShippingAddressData();
            })
          } else {
            swal("Cancelled", "取消操作", "");
          }
        });
      },
      addShippingAddress() {
        // this.resetForm(this.addressForm);
        this.addressForm.tel = '';
        this.addressForm.receiver = '';
        this.addressForm.province = '';
        this.addressForm.city = '';
        this.addressForm.region = '';
        this.addressForm.address = '';
        this.addressForm.desc = '';
        this.dialogFormVisible = true;
        //reset不好使
        // this.$refs['addressForm'].resetFields();
        // console.log("122==",this.$refs);
      },
      //确认添加地址的确认按钮事件
      sureAddAddress() {
        if(!Verify.phoneNumberVerify(this.addressForm.tel)){
          alert("请输入合法的手机号码");
        }else if (Verify.phoneNumberVerify(this.addressForm.tel)&&
          Verify.validateIsNull(this.addressForm.receiver) &&
          // Verify.phoneNumberVerify(this.addressForm.tel) &&
          Verify.validateIsNull(this.addressForm.province) &&
          Verify.validateIsNull(this.addressForm.city) &&
          Verify.validateIsNull(this.addressForm.region) &&
          Verify.validateIsNull(this.addressForm.address)) {
          let userId = localStorage.getItem("userId");
          // let addAddressUrl = "/api/user/address/" + userId;
          let addAddressUrl = "/api/personal/" + userId + '/address';
          var data = {
            receiver: this.addressForm.receiver,
            phoneNumber: this.addressForm.tel,
            province: this.addressForm.province,
            city: this.addressForm.city,
            county: this.addressForm.region,
            address: this.addressForm.address,//详细地址
            default: this.checked,//1是 0否
          };
          if (Verify.validateIsNull(this.addressForm.desc)){
            data['name'] = this.addressForm.desc;//如家，公司
          }
          this.$post(addAddressUrl, data).then(res => {
            // console.log(JSON.stringify(res))
            if (res.data.code === 200) {
              swal("提示", "添加成功", "success");
              this.dialogFormVisible = false;
              this.$refs['addressForm'].resetFields();
              this.getShippingAddressData();
              // console.log("data==" + JSON.stringify(res.data));
            } else {
              swal("提示", res.data.msg, "error");
            }
            // console.log("res=="+JSON.stringify(res))
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });
        } else {
          alert("请录入地址相关内容,注意录入的内容是否合法");
        }
      },
      //修改地址
      modifyAddress(row) {
        this.formRowData = row;
        this.modifyFormVisible = true;
        console.log(JSON.stringify(row))
      },
      sureModifyAddress() {
        let addressId = this.formRowData.addressId;
        let updateAddressUrl = "/api/personal/" + addressId +'/address';
        this.$put(updateAddressUrl, {
          // addressId: addressId,
          receiver: this.formRowData.receiver,
          phoneNumber: this.formRowData.phoneNumber,
          province: this.formRowData.province,
          city: this.formRowData.city,
          county: this.formRowData.county,
          address: this.formRowData.address,//详细地址
          name: this.formRowData.name,//如家，公司
          default: this.formRowData.default,//1是 0否
        }).then((res) => {
          // console.log("修改=="+JSON.stringify(JSON.stringify(res.data)))
          if (res.data.code === 200) {
            this.modifyFormVisible = false;
            swal("提示", "已修改", "success");
          } else {
            swal("提示", res.data.msg, "error");
          }
          this.getShippingAddressData();
        })

      },
      deleteAddress(row) {
        swal({
          title: "是否删除这条地址？",
          text: "",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            let addressId = row.addressId;
            let deleteAddressUrl = "/api/personal/" + addressId +'/address';
            this.$del(deleteAddressUrl, {
              // addressId: addressId
            }).then((res) => {
              if (res.data.code === 200) {
                swal("提示", "已删除", "success");
              } else {
                swal("提示", res.data.msg, "error");
              }
              this.getShippingAddressData();
            })
          } else {
            swal("Cancelled", "操作异常", "");
          }
        });
      },
      getCityData() {
        const config = require('../../../../static/region');
        // this.firmAddress = config['86'];
        this.addressData = config;
      },
    }
  }
</script>

<style scoped>
  .header_bg {
    background-color: white;
    text-align: right;
    font-size: 18px;
    color: #333333;
  }

  .el-breadcrumb {
    line-height: 3.5;
    font-size: 18px;
  }

  .address_table {
    margin-top: 15px;
    width: 100%;
  }

  .el-form-item {
    /*margin-bottom: 22px;*/
    width: 80%;
  }

  .addBtn {
    background-color: #33B2E8;
    color: #FFFFFF;
    font-size: 17px;
  }
</style>
