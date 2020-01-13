<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>{{(asideNavTitle[0] === '' || asideNavTitle[0] === undefined )? '成员与分组':asideNavTitle[0]}}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{(asideNavTitle[1] === '' || asideNavTitle[1] === undefined )? '组织架构':asideNavTitle[1]}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-breadcrumb>
    </el-header>
    <div class="align_right padding_top10">
      <el-button @click="addPersonnel()" class="addBtn" size="small">添加部门</el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%" class="marginTop10">
      <el-table-column
        prop="entDepartmentName"
        label="部门名称">
      </el-table-column>
      <el-table-column
        prop="empNumber"
        label="员工数">
        <!--empNumber:部门人数 entEmpNumber:公司人数-->
      </el-table-column>
      <el-table-column
        prop="order"
        label="排序">
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

    <!--添加部门-->
    <el-dialog title="部门管理" :visible.sync="addDepartFormVisible" width="40%" center>
      <el-form :model="addDepartForm" :rules="rules" ref="addDepartForm">
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="departmentName">
          <el-input v-model="addDepartForm.departmentName" autocomplete="off" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="部门人数" :label-width="formLabelWidth" prop="departmentNumber">
          <el-input type="number" v-model.number="addDepartForm.departmentNumber" autocomplete="off" placeholder="请输入部门人数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDepartFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddDepartment()">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑部门-->
    <el-dialog title="编辑部门" :visible.sync="modifyDepartFormVisible" width="40%" center>
      <el-form :model="departRowData" :rules="rules" ref="addDepartForm">
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="entDepartmentName">
          <el-input v-model="departRowData.entDepartmentName" autocomplete="off" placeholder="请输入部门名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyDepartFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureModifyDepartment()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Verify from '../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {mapGetters} from 'vuex'
  export default {
    name: "FirmStructure",
    props: ['selectTitle'],
    data() {
      return {
        tableData: [],
        currentPage: 1,
        total: 0,
        addDepartFormVisible: false,
        modifyDepartFormVisible: false,
        addDepartForm: {
          departmentName: '',
          departmentNumber:''
        },
        departRowData: [],
        formLabelWidth: '100px',
        // selectTitle:['selectTitle'],
        rules: {
          departmentName: [
            {required: true, message: '请填写部门名称', trigger: 'blur'}
          ],
          departmentNumber:[
            {required: true, message: '请填写部门人数', trigger: 'blur'},
            { type: 'number', message: '部门人数必须为数字值'}
          ],
          entDepartmentName:[
            {required: true, message: '请填写部门名称', trigger: 'blur'}
          ],
        }

      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },

    created() {
      this.getDepartmentList();
    },
    methods: {
      getDepartmentList() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let departUrl = "/api/enterprise/departments/" + enterpriseId;
        this.$get(departUrl, {
          // enterpriseId: enterpriseId,
        }).then(res => {
          console.log("depart=" + JSON.stringify(res))
          if (JSON.stringify(res.data.code) == 200) {
            this.tableData = res.data.data.items;
            this.total = res.data.data.total;
            // this.currentPage = res.data.data.page;
          } else {
            swal("提示",res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      addPersonnel() {
        this.addDepartForm.departmentName = '';
        this.addDepartForm.departmentNumber = '';
        this.addDepartFormVisible = true;
      },
      sureAddDepartment() {
        if (Verify.validateIsNull(this.addDepartForm.departmentName)){
          let enterpriseId = localStorage.getItem("enterpriseId");
          let addDepartUrl = "/api/enterprise/department/" + enterpriseId;
          let data = {
            ennDepartmentName: this.addDepartForm.departmentName,
          };
          if (Verify.validateIsNull(this.addDepartForm.departmentNumber)) {
            data['numberEmps'] = this.addDepartForm.departmentNumber
          }
          this.$post(addDepartUrl, data).then(res => {
            console.log(JSON.stringify(res))
            if (JSON.stringify(res.data.code) == 200) {
              this.getDepartmentList();
              this.addDepartFormVisible = false;
              // console.log("depart data==" + JSON.stringify(res.data));
            } else {
              swal("提示",res.data.msg, "error");
            }
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });
        }else {
          swal("提示", "请检查录入内容是否完整", "error");
        }

      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      modifyStaffInfo(row) {
        this.departRowData = row;
        this.modifyDepartFormVisible = true;
        console.log("rowData=="+JSON.stringify(row))
      },
      sureModifyDepartment() {
        if (Verify.validateIsNull(this.departRowData.entDepartmentName)){
          let departId = this.departRowData.entDepartmentId;
          let editDepartUrl = "/api/enterprise/department/" + departId;
          this.$put(editDepartUrl, {
            // departmentId: departId,
            entDepartmentName: this.departRowData.entDepartmentName,
          }).then((res) => {
            console.log("修改==" + JSON.stringify(JSON.stringify(res.data)))
            if (JSON.stringify(res.data.code) == 200) {
              this.getDepartmentList();
              this.modifyDepartFormVisible = false;
              swal("提示", "已修改", "success");
            } else {
              swal("提示",res.data.msg, "error");
            }
          })
        }else{
          swal("提示", "部门名称不为空", "error");
        }

      },
      deleteStaffInfo(row) {
        swal({
          title: "是否删除这条部门信息？",
          text: "",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            let departId = row.entDepartmentId;
            let deleteDepartUrl = "/api/enterprise/department/" + departId;
            this.$del(deleteDepartUrl, {
              employeeId: departId
            }).then((res) => {
              if (JSON.stringify(res.data.code) == 200) {
                this.getDepartmentList();
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

  .addBtn {
    background-color: #33B2E8;
    color: #FFFFFF;
    font-size: 17px;
  }
</style>
