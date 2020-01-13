<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{(asideNavTitle[0] === '' || asideNavTitle[0] === undefined )? '体检管理':asideNavTitle[0]}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{(asideNavTitle[1] === '' || asideNavTitle[1] === undefined )? '体检配置':asideNavTitle[1]}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="margin_top15 white_bg_color height208">
      <p class="div_title padding_top10 text_align_left" style="padding-left: 30px">体检周期</p>
      <p class="prompt_font">计划于每年<span class="month">{{selectMonth}}</span>进行员工体检/请选择计划员工体检的月份</p>
      <div class="month_border text_align_left">
        <el-checkbox-group v-model="checkedMonth" @change="handleCheckedCitiesChange" class="margin_left10">
          <el-checkbox v-for="m in monthLabel" :label="m" :key="m" v-if="m<7">{{m}}月</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="checkedMonth" @change="handleCheckedCitiesChange" class="margin_left10">>
          <el-checkbox v-for="m in monthLabel" :label="m" :key="m" v-if="m>6">{{m}}月</el-checkbox>
        </el-checkbox-group>
        <!--<el-row>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="1月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="2月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="3月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="4月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="5月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="6月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="6">-->
            <!--&emsp;-->
          <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-row>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="7月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="8月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="9月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="10月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="11月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-checkbox label="12月"></el-checkbox>-->
          <!--</el-col>-->
          <!--<el-col :span="6">-->
            <!--&emsp;-->
          <!--</el-col>-->
        <!--</el-row>-->
        <el-row class="margin_top15 margin_bottom15">
          <el-col :span="6">
            <el-button class="save_medical_week padding_left10" @click="saveMedicalCycle()">保存</el-button>
          </el-col>
          <el-col :span="18">
            <p class="hint_font">设置体检周期后，会在前一个月收到体检提醒</p>
          </el-col>

        </el-row>
      </div>
    </div>
    <el-row :gutter="20" class="margin_top15">
      <el-col :span="12">
        <div class="white_bg_color height408">
          <el-row>
            <el-col :span="12">
              <p class="div_title text_align_left padding_left10">体检额度</p>
            </el-col>
            <el-col :span="12">
              <p class="hint_font text_align_right">不同员工或部门可使用不同预设额度</p>
            </el-col>
          </el-row>
          <hr class="dashed_hr">
          <div class="suit_height">
            <el-table
              :data="suitData"
              style="width: 100%"
               :show-header="false">
              <!--:default-sort = "{prop: 'money', order: 'descending'}">-->
              <el-table-column
                fixed
                prop=""
                label="套餐">
                <template slot-scope="scope">
                  <label>¥{{scope.row.label}}元套餐</label>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" icon="el-icon-edit" circle
                             @click.native.prevent="editMedicalLimitRow(scope.row)"></el-button>
                  <el-button type="danger" size="small" icon="el-icon-delete" circle
                             @click.native.prevent="deleteMedicalLimitRow(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="text_align_left padding_left40 padding_bottom15 margin_top15">
            <el-button class="add_btn" @click="addPhysicalLimit()">添加额度</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="white_bg_color height408">
          <el-row>
            <el-col :span="12">
              <p class="div_title text_align_left padding_left10">部门套餐</p>
            </el-col>
            <el-col :span="12">
              <p class="hint_font text_align_right">还未设置企业部门？
                <router-link to="/FirmStructure" class="link_font">组织架构</router-link>
              </p>
            </el-col>
          </el-row>
          <hr>
          <el-form label-width="80px" v-for="(items,index) in departSuit" :key="index">
          <!--<el-form ref="form" :model="form" label-width="80px" v-for="items in departSuit">-->
            <el-form-item :label=items.name>
              <!--jointMoney-->
              <el-select v-model="items.amount" placeholder="请选择套餐" size="small">
                <el-option
                  v-for="item in suitData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                  <span style="float: left" v-if="item.label!== null">￥{{ item.label}}元套餐</span>
                  <!--<span style="float: left">¥{{ item.money }}元套餐</span>-->
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="text_align_left padding_left40 padding_bottom15">
            <el-button class="add_btn" @click="saveDepartSuit()">保存</el-button>
          </div>
        </div>

      </el-col>
    </el-row>
    <!--添加额度-->
    <el-dialog title="添加额度" :visible.sync="addMedicalLimitDialog" width="40%">
      <el-form :model="limitForm" ref="limitForm">
        <el-form-item label="体检金额" :label-width="formLabelWidth" :rules="[ { required: true, message: '体检金额不能为空'},{ type: 'number', message: '体检金额必须为数字值'}]">
          <el-input type="number" v-model.number="limitForm.medicalPrice" autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMedicalLimitDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddMedicalLimit()">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑额度-->
    <el-dialog title="编辑体检额度" :visible.sync="editMedicalLimitDialog" width="40%">
      <el-form :model="editLimitForm" ref="editLimitForm">
        <el-form-item label="体检金额" :label-width="formLabelWidth">
          <el-input v-model="editLimitForm.medicalPrice" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editMedicalLimitDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditMedicalLimit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Verify from '../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {mapGetters} from 'vuex'

  export default {
    name: "MedicalConfiguration",
    data() {
      return {
        medicalConfiguration: '体检计划>体检配置',
        selectMonth: '2月',
        monthLabel: [1,2,3,4,5,6,7,8,9,10,11,12],
        checkedMonth: [],
        //suitData: [{'suit': '100元套餐'}, {'suit': '100元套餐'}, {'suit': '100元套餐'}, {'suit': '100元套餐'}],
        suitData: [],
        cycles:'',
        departSuit:[],
        form: {
          name: '',
          money: ''
        },
        limitForm: {
          medicalPrice: ''
        },
        editLimitForm: {
          setMealId:'',
          medicalPrice: ''
        },
        formLabelWidth: '120px',
        addMedicalLimitDialog: false,
        editMedicalLimitDialog: false,
        setMealId:0,
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      this.physicalLimitInfo();
      //获取体检周期
      this.getMedicalCycle();
      // 部门额度套餐获取
      this.getDepartSuitLimit();
    },
    methods: {
      handleCheckedCitiesChange(value) {
        // console.log("select=="+value)
        this.cycles = value.join(',');
        console.log("cycles=="+this.cycles);
      },
      //读取体检周期
      getMedicalCycle(){
        let enterpriseId = localStorage.getItem("enterpriseId");
        let getMedicalUrl = "/api/enterprise/cycleRemind/" + enterpriseId;
        this.$get(getMedicalUrl, {
          // enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            for(let i=0;i<res.data.data.items.length;i++){
              this.checkedMonth.push(res.data.data.items[i].cycle);
            }
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res周期==" + JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //保存体检周期
      saveMedicalCycle() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let addLimitUrl = "/api/enterprise/cycleRemind/" + enterpriseId;

        this.$post(addLimitUrl, {
          cycles: this.cycles,
          cyclePeriod:20,
        }).then(res => {
          if (res.data.code === 200) {
            swal("提示", "保存成功", "success");
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res周期==" + JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //查看体检额度列表
      physicalLimitInfo() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let listUrl = "/api/enterprise/setMeals/" + enterpriseId;
        this.$get(listUrl, {
          // enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            this.suitData = res.data.data.items;
            let suit=[];
            for (let i=0;i< this.suitData.length;i++) {
              let temp = this.suitData[i].money;
              // temp = '¥'+this.suitData[i].money+'元套餐';
              // const obj={
              //   value: parseInt(this.suitData[i].money),
              //   label: temp,
              // }
              const obj={
                value: this.suitData[i].setMealId,
                label: temp,
              }
              suit.push(obj);
            }
            this.suitData = suit;
            // console.log("suitData=="+JSON.stringify(this.suitData));
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //添加体检额度
      addPhysicalLimit() {
        this.addMedicalLimitDialog = true;
      },
      confirmAddMedicalLimit() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let addLimitUrl = "/api/enterprise/setMeal/" + enterpriseId;
        this.$post(addLimitUrl, {
          setMealMoney: this.limitForm.medicalPrice,
        }).then(res => {
          if (res.data.code === 200) {
            swal("提示", "添加成功", "success");
            this.addMedicalLimitDialog = false;
            this.$refs['limitForm'].resetFields();
            this.physicalLimitInfo();
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res==" + JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //编辑体检额度限制
      editMedicalLimitRow(row) {
        this.editLimitForm.setMealId = row.value;
        this.editLimitForm.medicalPrice = row.label;
        this.editMedicalLimitDialog = true;
        // this.setMealId = row.setMealId;
      },
      confirmEditMedicalLimit(){
        // let setMealId = row.setMealId;
        let listUrl = "/api/enterprise/setMeal/" + this.editLimitForm.setMealId;
        this.$put(listUrl, {
          // setMealId:this.editLimitForm.setMealId,
          setMealMoney: this.editLimitForm.medicalPrice,
        }).then(res => {
          if (res.data.code === 200) {
            this.editMedicalLimitDialog = false;
            swal("提示", "修改成功", "success");
            this.physicalLimitInfo();
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      deleteMedicalLimitRow(row) {
        swal({
          title: "你确定要删除这条体检额度吗?",
          // text: "You will not be able to recover this imaginary file!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            let setMealId = row.setMealId;
            let listUrl = "/api/enterprise/setMeal/" + setMealId;
            this.$del(listUrl, {
              // setMealId: row.id,
            }).then(res => {
              if (res.data.code === 200) {
                swal("提示", "删除成功", "success");
                this.physicalLimitInfo();
                // console.log("删除体检额度=="+JSON.stringify(res.data));
              } else {
                swal("提示",res.data.msg, "error");
              }
              // console.log("res=="+JSON.stringify(res))
            }).catch(function (reason) {
              console.log(JSON.stringify(reason));
            });
          } else {
            swal("Cancelled", "这条数据被保留", "error");
          }
        });
      },
      // 部门额度套餐获取
      getDepartSuitLimit(){
        let enterpriseId = localStorage.getItem("enterpriseId");
        let departUrl = "/api/enterprise/department/setMeals/" + enterpriseId;
        this.$get(departUrl, {
          // enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            this.departSuit = res.data.items;
            // let arr=[];
            for (let i=0;i<res.data.items.length;i++) {
              if (res.data.items[i].money !== null){
                this.departSuit[i].amount = '¥'+res.data.items[i].money+'元套餐';
              }
            }
            //   let jointMoney = '¥'+res.data.items[i].money+'元套餐';
            //   const obj={
            //     id:res.data.items[i].id,
            //     name:res.data.items[i].name,
            //     money:res.data.items[i].money,
            //     jointMoney:jointMoney
            //   }
            //   arr.push(obj);
            // }
            // this.departSuit = arr;
            // console.log("部门额度套餐获取==" + JSON.stringify(this.departSuit));
          } else {
            swal("提示",res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      saveDepartSuit(){
        var setMeals=[];
        for (let i=0;i<this.departSuit.length;i++) {
          const obj={
            id:this.departSuit[i].id,
            money:this.departSuit[i].money
          }
          setMeals.push(obj);
          // console.log("3434"+JSON.stringify(setMeals));
        }
        let enterpriseId = localStorage.getItem("enterpriseId");
        let departUrl = "/api/enterprise/department/setMeals/" + enterpriseId;
        this.$put(departUrl, {
          setMeals:JSON.stringify(setMeals),
        }).then(res => {
          if (res.data.code === 200) {
            swal("提示", "保存成功", "success");
            // 部门额度套餐获取
            this.getDepartSuitLimit();
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      }
    }
  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";

  .dashed_hr {
    height: 5px;
    border: none;
    border-top: 3px dashed #6f7180;
  }

  .header_bg {
    background-color: white;
    text-align: right;
    font-size: 18px;
    color: #333333;
  }

  .height408 {
    height: 408px;
  }

  .el-breadcrumb {
    font-size: 18px;
    line-height: 3.5;
    color: #333333;
  }

  .div_title {
    font-size: 14px;
    color: #404040;
  }

  .prompt_font {
    font-size: 18px;
    color: #333333;
    text-align: left;
    padding-left: 30px;
    text-align: left;
  }

  .height208 {
    height: 248px;
  }

  .month {
    color: #009BDD;
    font-size: 18px;
  }

  .month_border {
    border: 1px solid rgba(189, 186, 187, 1);
    margin: 5px 30px 15px 30px;
    /*background-color: #BDBABB;*/
    background: rgba(255, 255, 255, 1);

  }
  .suit_height{
    height: 270px;
    overflow-y:auto
  }

  .save_medical_week {
    width: 120px;
    background-color: #33B2E8;
    color: #FFFFFF;
    font-size: 17px;
  }

  .hint_font {
    color: #666666;
    font-size: 12px;
    text-align: left;
  }

  .list_content {
    font-size: 14px;
    color: #404040;
    line-height: 25px;
    margin-top: 5px;
  }

  .add_btn {
    color: #FFFFFF;
    background-color: #33B2E8;
    font-size: 17px;
    width: 180px;
  }

  .padding_left40 {
    padding-left: 40px;
  }

  .link_font {
    font-size: 12px;
    color: #33B2E8;
  }
</style>
