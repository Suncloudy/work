<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{asideNavTitle.length!=0?asideNavTitle[0]:""}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{asideNavTitle.length!=0?asideNavTitle[1]:""}}</el-breadcrumb-item>
        <el-button @click="addPersonnel = true" class="addBtn">添加体检人</el-button>
      </el-breadcrumb>

    </el-header>
    <el-table
      :data="tableData"
      border
      class="personnel_table">
      <el-table-column
        prop="name"
        label="姓名"
        width="">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="">
      </el-table-column>
      <el-table-column
        prop="tel"
        label="手机号"
        width="">
      </el-table-column>
      <el-table-column
        prop="IDNumber"
        label="证件号码"
        width="">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
          <el-button type="text" size="small">删除</el-button>
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

    <el-dialog title="体检人" :visible.sync="addPersonnel" width="40%" center>
      <el-form :model="form">
        <el-form-item label="姓名人" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.tel" autocomplete="off" placeholder="请输入体检人手机号码"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <!--<el-input v-model="form.add" autocomplete="off" placeholder="请输入详细地址"></el-input>-->
          <el-radio v-model="radio" label="1">男</el-radio>
          <el-radio v-model="radio" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="证件号码" :label-width="formLabelWidth">
          <el-input v-model="form.IDNumber" autocomplete="off" placeholder="身份证类"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPersonnel = false">取 消</el-button>
        <el-button type="primary" @click="addPersonnel = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "PersonnelManage",
    props: ['selectTitle'],
    data() {
      return {
        tableData: [{

          name: '王小虎',
          sex: '男',
          tel: '166****1234',
          IDNumber: '410678199809891234',

        }, {

          name: '王小虎',
          sex: '男',
          tel: '166****1234',
          IDNumber: '410678199809891234',

        }],
        addPersonnel: false,
        form: {
          name: '',
          tel: '',
          sex: '',
          IDNumber: '',
          delivery: false,
        },
        total:'',
        currentPage:'1',
        radio:'1',
        formLabelWidth: '100px'
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    methods: {
      handleClick(row) {
        console.log(row);
      }
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
    font-size: 18px;
    line-height: 3.5;
  }
  .address_table {
    margin-top: 15px;
    width: 100%;
  }

  .el-form-item {
    /*margin-bottom: 22px;*/
    width: 80%;
  }
  .addBtn{
    background-color: #33B2E8;
    color: #FFFFFF;
    font-size: 17px;
  }
  .personnel_table{
    margin-top: 15px;
    width: 100%;
    height: 360px;
  }
  .el-pagination {
    background-color: white;
  }
</style>
