<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{asideNavTitle === ''?"成员与分组":asideNavTitle[0]}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{asideNavTitle === ''?'企业成员':asideNavTitle[1]}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-button @click="importStaff = true" class="leadBtn" size="small" style="float: right">导入员工</el-button>
    <div class="white_bg_color">
      <el-row :gutter="20" type="flex" class="search_div padding_top10">
        <el-col :span="12">
          <el-row>
            <el-col :span="12">
              <el-select v-model="department" placeholder="部门" class="select_width">
                <el-option
                  v-for="item in departments"
                  :key="item.departmentId"
                  :label="item.departmentName"
                  :value="item.departmentId">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-input v-model="staffName" placeholder="员工姓名、手机号">
                <el-button slot="append" icon="el-icon-search" @click="searchEvent()"></el-button>
              </el-input>

            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="float_left">
          <p>员工人数：<span class="addStaff">{{total}}</span>个</p>
        </el-col>
        <el-col :span="6">
          <p class="addStaff" @click="addStaff()"><i class="el-icon-circle-plus"></i>添加员工</p>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabHandleClick" class="padding_left10 padding_right10">
        <el-tab-pane label="正常" name="first" v-model="allData">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%" class="marginTop10">
            <el-table-column
              prop="employeeName"
              label="员工姓名">
            </el-table-column>
            <el-table-column
              prop="phoneNumber"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="departmentName"
              label="部门">
            </el-table-column>
            <el-table-column
              prop="active"
              label="处理状态">
              <template slot-scope="scope">
                {{ scope.row.active===1 ? '正常': '不正常'}}
                <!--<template v-if="scope.row.status === 'pending'">-->
                <!--未办理-->
                <!--</template>-->
                <!--<template v-else-if="scope.row.status === 'passed'">-->
                <!--已处理-->
                <!--</template>-->
                <!--<template v-else-if="scope.row.status === 'rejected'">-->
                <!--已拒绝-->
                <!--</template>-->
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <div class="del_goods">
                  <el-button type="text" size="small" @click="modifyStaffInfo(scope.row)">修改</el-button>
                  <el-button type="text" size="small" @click="deleteStaffInfo(scope.row)">删除</el-button>
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
        </el-tab-pane>
        <el-tab-pane label="待确认" name="second">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%" class="marginTop10">
            <el-table-column
              prop="employeeName"
              label="员工姓名">
            </el-table-column>
            <el-table-column
              prop="phoneNumber"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="departmentName"
              label="部门">
            </el-table-column>
            <el-table-column
              prop="active"
              label="处理状态">
              <template slot-scope="scope">
                {{ scope.row.active===1 ? '正常': '不正常'}}
                <!--<template v-if="scope.row.status === 'pending'">-->
                <!--未办理-->
                <!--</template>-->
                <!--<template v-else-if="scope.row.status === 'passed'">-->
                <!--已处理-->
                <!--</template>-->
                <!--<template v-else-if="scope.row.status === 'rejected'">-->
                <!--已拒绝-->
                <!--</template>-->
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <div class="del_goods">
                  <el-button type="text" size="small" @click="modifyStaffInfo(scope.row)">修改</el-button>
                  <el-button type="text" size="small" @click="deleteStaffInfo(scope.row)">删除</el-button>
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
        </el-tab-pane>
        <el-tab-pane label="已删除" name="third">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%" class="marginTop10">
            <el-table-column
              prop="employeeName"
              label="员工姓名">
            </el-table-column>
            <el-table-column
              prop="phoneNumber"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="departmentName"
              label="部门">
            </el-table-column>
            <el-table-column
              prop="active"
              label="处理状态">
              <template slot-scope="scope">
                {{ scope.row.active===1 ? '正常': '不正常'}}
                <!--<template v-if="scope.row.status === 'pending'">-->
                <!--未办理-->
                <!--</template>-->
                <!--<template v-else-if="scope.row.status === 'passed'">-->
                <!--已处理-->
                <!--</template>-->
                <!--<template v-else-if="scope.row.status === 'rejected'">-->
                <!--已拒绝-->
                <!--</template>-->
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <div class="del_goods">
                  <el-button type="text" size="small" @click="modifyStaffInfo(scope.row)">修改</el-button>
                  <el-button type="text" size="small" @click="deleteStaffInfo(scope.row)">删除</el-button>
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
        </el-tab-pane>
      </el-tabs>

    </div>

    <el-dialog
      title="导入员工"
      :visible.sync="importStaff"
      width="40%"
      :before-close="handleClose">
      <div class="import_div">
        <el-button plain class="select_file">选择文件</el-button>
        <p class="import_prompt">员工列表.xlsx (请选择.xls、.xlsx格式的文件)</p>
        <el-button class="sure_import_btn">确定导入</el-button>
        <p class="float_left download_demo"><a>模版下载</a></p>
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="importStaff = false" c>取 消</el-button>
    <el-button type="primary" @click="importStaff = false">确 定</el-button>
  </span>
    </el-dialog>
    <!--添加员工-->
    <el-dialog title="员工管理" :visible.sync="addStaffFormVisible" width="40%" center>
      <el-form :model="addStaffInfoForm" ref="addStaffInfoForm">
        <el-form-item label="员工姓名" :label-width="formLabelWidth">
          <el-input v-model="addStaffInfoForm.staffName" autocomplete="off" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="addStaffInfoForm.phoneNumber" autocomplete="off" placeholder="请输入员工手机号"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-select v-model="addStaffInfoForm.depart" placeholder="请选择所属部门">
            <el-option
              v-for="item in departments"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId">
            </el-option>
          </el-select>
          <p>备注：添加后，员工可直接通过手机号登录</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStaffFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddStaff()">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改员工-->
    <el-dialog title="修改员工信息" :visible.sync="modifyStaffNameVisible" width="40%" center>
      <el-form :model="staffRowData">
        <el-form-item label="员工姓名" :label-width="formLabelWidth">
          <el-input v-model="staffRowData.employeeName" autocomplete="off" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-select v-model="staffRowData.departmentId" placeholder="请选择所属部门">
            <el-option
              v-for="item in departments"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" id="dialog_btn">
        <el-button @click="modifyStaffNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureModifyAddress()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Verify from '../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {mapGetters} from 'vuex'
  export default {
    name: "FirmMember",
    props: ['selectTitle'],
    data() {
      return {
        tableData: [],
        activeName: 'first',
        status: '',
        allData: '',
        currentPage: 1,
        total: 0,
        department: '',
        departments: [],
        staffName: '',
        importStaff: false,
        addStaffFormVisible: false,
        modifyStaffNameVisible: false,
        formLabelWidth: '100px',
        addStaffInfoForm: {
          staffName: '',
          phoneNumber: '',
          depart: '',
        },
        staffRowData: [],
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    created() {
      this.getDepartmentList();
      this.getFirmMemberList('1');
      console.log('侧导航222===',this.asideNavTitle);
    },
    methods: {
      searchEvent() {
        this.searchFirmMemberList();
      },
      getDepartmentList() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let departUrl = "/api/enterprise/departments/" + enterpriseId + "/search";
        this.$get(departUrl, {
          enterpriseId: enterpriseId,
        }).then(res => {
          if (res.data.code === 200) {
            this.departments = res.data.data.items;
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      searchFirmMemberList(){
        if (this.activeName === "first") {
          this.getFirmMemberList('1');
        }else if (this.activeName === "second"){
          this.getFirmMemberList('0');
        }else{
          this.getFirmMemberList('2');
        }
      },
      getFirmMemberList(str) {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let firmMemberUrl = "/api/enterprise/employees/" + enterpriseId;
        let data = {
          status: str
        };
        if (Verify.validateIsNull(this.department)) {
          data['departmentId'] = this.department;
        }
        if (Verify.validateIsNull(this.staffName)) {
          data['optName'] = this.staffName;
        }
        this.$get(firmMemberUrl, data).then(res => {
          console.log(JSON.stringify(res))
          if (res.data.code === 200) {
            this.tableData = res.data.data.items;
            this.total = res.data.data.total;
            // this.currentPage = res.data.data.page;
            // console.log("data ==" + JSON.stringify(res));
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      addStaff() {
        this.addStaffFormVisible = true;
      },
      sureAddStaff() {
        if (Verify.validateIsNull(this.addStaffInfoForm.staffName) &&
          Verify.validateIsNull(this.addStaffInfoForm.depart) &&
          Verify.phoneNumberVerify(this.addStaffInfoForm.phoneNumber))
        {
          let enterpriseId = localStorage.getItem("enterpriseId");
          let addStaffUrl = "/api/enterprise/employee/" + enterpriseId;
          this.$post(addStaffUrl, {
            enterpriseId: enterpriseId,
            name: this.addStaffInfoForm.staffName,
            phoneNumber: this.addStaffInfoForm.phoneNumber,
            departmentId: this.addStaffInfoForm.depart,
          }).then(res => {
            console.log(JSON.stringify(res))
            if (res.data.code === 200) {
              this.addStaffFormVisible = false;
              this.getFirmMemberList();
              // console.log("data==" + JSON.stringify(res.data));
            } else {
              swal("提示",res.data.msg, "error");
            }
            // console.log("res=="+JSON.stringify(res))
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });
        }else{
          alert("请检查录入的内容是否合法");
        }
      },
      modifyStaffInfo(row) {
        this.staffRowData = row;
        this.modifyStaffNameVisible = true;
        console.log("staffRowData="+JSON.stringify(row))
      },
      sureModifyAddress() {
        let staffId = this.staffRowData.entEmployeeId;
        let deleteAddressUrl = "/api/enterprise/employee/" + staffId;
        this.$put(deleteAddressUrl, {
          // employeeId: staffId,
          name: this.staffRowData.employeeName,
          departmentId:this.staffRowData.departmentId
        }).then((res) => {
          // console.log("修改==" + JSON.stringify(JSON.stringify(res.data)))
          if (res.data.code === 200) {
            this.modifyStaffNameVisible = false;
            swal("提示", "已修改", "success");
          } else {
            swal("提示",res.data.msg, "error");
          }
          this.getFirmMemberList();
        })
      },
      deleteStaffInfo(row) {
        swal({
          title: "是否删除这条员工信息？",
          text: "",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            let staffId = row.employeeAccountId;
            let deleteEmployUrl = "/api/enterprise/employee/" + staffId;
            this.$del(deleteEmployUrl, {
              // employeeId: staffId
            }).then((res) => {
              if (res.data.code === 200) {
                if (this.activeName === "first") {
                  this.getFirmMemberList('1');
                }else if (this.activeName === "second"){
                  this.getFirmMemberList('0');
                }else{
                  this.getFirmMemberList('2');
                }
                swal("提示", "已删除", "success");
              } else {
                swal("提示",res.data.msg, "error");
              }
            })
          } else {
            swal("Cancelled", "", "");
          }
        });
      },
      tabHandleClick(tab, event) {
        // console.log(tab, event);
        if (tab.name === "first") {
          this.getFirmMemberList('1');
        }else if (tab.name === "second"){
          this.getFirmMemberList('0');
        }else{
          this.getFirmMemberList('2');
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      handleClose(done) {
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        done();
        //   })
        //   .catch(_ => {});
      }
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

  .el-breadcrumb {
    font-size: 18px;
    line-height: 3.5;
    color: #333333;
  }

  .align_right {
    text-align: right;
  }

  .leadBtn {
    float: right;
    margin-top: -48px;
    margin-right: 10px;
    background-color: #33B2E8;
    color: white;
  }
  .el-button{
    border: 1px solid #33B2E8;
    /*color: #33B2E8;*/
  }

  .search_div {
    margin-top: 10px;
  }

  .addStaff {
    color: #009BDD;
    font-size: 16px;
  }

  .import_div {
    margin: 0 auto;
    width: 260px;
  }

  .select_file {
    width: 200px;
    color: #009BDD;
    border-color: #009BDD;
  }

  .import_prompt {
    color: #666666;
    font-size: 14px;
  }

  .sure_import_btn {
    width: 260px;
    color: #FFFFFF;
    background-color: #009BDD;
    font-size: 17px;
  }

  .download_demo {
    color: #009BDD;
    font-size: 14px;
  }
  .el-tabs__item {
    font-size: 16px;
  }
</style>

