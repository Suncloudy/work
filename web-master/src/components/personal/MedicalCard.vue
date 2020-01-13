<template>
  <div class="bg_color_gray">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="white_bg_color padding_left10 padding_right10">
      <el-tab-pane label="未使用" name="first">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%" class="marginTop10">
          <el-table-column
            label="ID"
            prop="cardId">
          </el-table-column>
          <el-table-column
            label="卡号"
            prop="cardNumber">
          </el-table-column>
          <el-table-column
            prop="packageName"
            label="体检套餐"
            width="120">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="额度"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="organizationName"
            label="所属机构"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop=""
            label="状态">
            <template slot-scope="scope">
              {{ scope.row.status=== 2 ? '已使用' : '未使用' }}
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <div class="del_goods">
                <el-button type="text" size="small" @click="viewPasswordEvent(scope.row)">卡密</el-button>
                <el-button type="text" size="small"  v-if="scope.row.status===0" @click="transferEvent(scope.row)">转赠</el-button>
                <el-button type="text" size="small"  v-if="scope.row.status===0" @click="appointmentEvent(scope.row)">预约</el-button>
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
      <el-tab-pane label="已使用" name="second">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%" class="marginTop10">
          <el-table-column
            label="ID"
            prop="cardId">
          </el-table-column>
          <el-table-column
            label="卡号"
            prop="cardNumber">
          </el-table-column>
          <el-table-column
            prop="packageName"
            label="体检套餐"
            width="120">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="额度"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="organizationName"
            label="所属机构"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop=""
            label="状态">
            <template slot-scope="scope">
              {{ scope.row.status=== 2 ? '已使用' : '未使用' }}
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <div class="del_goods">
                <el-button type="text" size="small" @click="viewPasswordEvent(scope.row)">卡密</el-button>
                <el-button type="text" size="small" v-if="scope.row.status===0" @click="transferEvent(scope.row)">转赠</el-button>
                <el-button type="text" size="small"  v-if="scope.row.status===0" @click="appointmentEvent(scope.row)">预约</el-button>
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
      <el-tab-pane label="全部" name="third">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%" class="marginTop10">
          <el-table-column
            label="ID"
            prop="cardId">
          </el-table-column>
          <el-table-column
            label="卡号"
            prop="cardNumber">
          </el-table-column>
          <el-table-column
            prop="packageName"
            label="体检套餐"
            width="120">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="额度"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="organizationName"
            label="所属机构"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              {{ scope.row.status===2? '已使用' : '未使用' }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <div class="del_goods">
                <el-button type="text" size="small" @click="viewPasswordEvent(scope.row)">卡密</el-button>
                <el-button type="text" size="small"  v-if="scope.row.status===0" @click="transferEvent(scope.row)">转赠</el-button>
                <el-button type="text" size="small"  v-if="scope.row.status===0" @click="appointmentEvent(scope.row)">预约</el-button>
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
    <el-dialog id="givenCardModal" ref="givenCardModal" title="验证" :visible.sync="cardDialogVisible">
      <el-form :model="givenCardForm" style="text-align: right">
        <el-form-item label="注册手机号：" class="text_align_left">
          <span v-model="phoneNumber" autocomplete="off">{{phoneNumber}}</span>
        </el-form-item>
        <el-form-item label="图形验证码：" prop="graphCode">
          <el-row>
            <el-col :span="8">
              <el-input style="" type="text" v-model="givenCardForm.graphCode" autocomplete="off"
                        placeholder="请输入图形验证码"></el-input>
            </el-col>
            <el-col :span="4">
              <!--<el-button class="img_code" @click="getImgCode()">获取图形码</el-button>-->
              <div v-html="svg" v-show="!isShow" class="img_code_height">
                {{svg}}
              </div>
            </el-col>
            <el-col :span="4">
              <span class="refresh_img_code" @click="refreshImgCode()">换一换</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="短信验证码：" prop="messageCode">
          <el-row>
            <el-col :span="8">
              <el-input v-model="givenCardForm.messageCode" placeholder="请输入短信验证码"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button @click="getMessageCode(givenCardForm.graphCode)" :disabled=disabled>{{btnTitle}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cardDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCardPassward()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import VerifyUtils from '../../utils/utils'
  import swal from 'sweetalert2'; //alert框
  import {getImgCode, getMessageCode} from '../../utils/publicMethods'
  export default {
    name: "MedicalCard",
    data() {
      return {
        btnTitle:'获取短信验证码',
        disabled:false,
        keyword: '',
        activeName: 'first',
        tableData: [],
        currentPage: 1,
        total: 0,
        cardInfo:[],
        cardDialogVisible:false,
        phoneNumber: '',
        givenCardForm: {
          graphCode: '',
          messageCode: '',
        },
        svg: '',
        showImgCode: '',
        isShow: true,
        //
        cooperated: 1,
        unCoopTableData: [],
        unCoopCurrentPage: 1,
        unCoopTotal: 1,
        unCooperated: 0,
        allTableData: [],
        allCurrentPage: 1,
        allTotal: 1,
        allCooperated: 1,
        firmListInfo: [],//列表信息
      }
    },
    created() {
      this.getImgCode();
      this.phoneNumber = localStorage.getItem("phoneNumber");
      if (this.activeName == "second") {
        this.getCardListData(0)
      } else if (this.activeName == "first") {
        this.getCardListData(1)
      } else {
        this.getCardListData()
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
        if (tab.name == "second") {
          //已使用
          this.getCardListData(2)
        } else if (tab.name == "first") {
          //未使用
          this.getCardListData(0)
        } else {
          //全部
          this.getCardListData(3)
        }
      },
      getCardListData(status) {
        let _self = this;
        var data = {
          page: _self.currentPage,
          perPage: 10,
        };
        let userId = localStorage.getItem("userId");
        let givenUrl = '/api/personal/' + userId + '/' + status + '/phyCards';
        this.$get(givenUrl, data).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.items;
            // console.log("status===" + JSON.stringify(res.data.data.items));
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });

      },
      //查看卡密事件
      viewPasswordEvent(rowData) {
        this.cardInfo = rowData;
        this.givenCardForm.graphCode = '';
        this.givenCardForm.messageCode = '';
        this.cardDialogVisible = true;
      },
      //查看卡密事件
      getCardPassward(){
        let _self = this;
        let url = '/api/personal/'+ _self.cardInfo.cardId +'/phyCards/password';
        let data = {
          mobile: this.phoneNumber,
          captcha:_self.givenCardForm.graphCode,
          smsCode:_self.givenCardForm.messageCode,
        };
        if (VerifyUtils.validateIsNull(_self.givenCardForm.graphCode) &&
          VerifyUtils.validateIsNull(_self.givenCardForm.messageCode)) {
          _self.$get(url, data).then(res => {
            if (res.data.code === 200) {
              // console.log("体检中心" + JSON.stringify(res.data.data.items));
              swal("提示", "卡密", "success");
            } else {
              alert(res.data.msg);
            }
          }).catch(function (reason) {
            console.log('catch:', reason);
          });
        }else{
          swal("提示", "请确认您已输入正确的图形验证码和短信验证码", "error");
        }
      },
      //转赠体检卡
      transferEvent() {

      },
      //预约
      appointmentEvent() {

      },
      deleteEvent(row) {
        swal({
          title: "是否确定删除?",
          text: "",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.value) {
            var url = '/admin/medical/center/' + row.manufacturerId;
            this.$del(url, {}).then((res) => {
              if (res.data.code === 200) {
                // this.tableData = tableData
                this.getCardListData();
                swal("Deleted!", "这条数据已被删除", "success");
              } else {
                alert(res.data.msg)
              }
            })
          } else {
            swal("Cancelled", "这条数据还在哦", "error");
          }
        });
      },
      detail(data) {
        // console.log('test=='+data.manufacturerId);
        // this.$router.push({path: '/institutionManage', query: {medicalCenterId: data.manufacturerId}});
      },
      //获取图形验证码
      getImgCode() {
        getImgCode(this).then(res => {
          if (res.status === 200) {
            this.svg = res.data;
            this.isShow = false;
          } else {
            this.$message.error(res.statusText);
          }
        })
        // this.$nosignget('/api/service/captcha', {
        //   width: '',
        //   height: '',
        // },).then(res => {
        //   if (res.status === 200) {
        //     this.svg = res.data;
        //     this.isShow = false;
        //   } else {
        //     alert(res.statusText);
        //   }
        // }).catch(function (reason) {
        //   console.log('catch:', reason);
        // });
      },
      //刷新图形验证码
      refreshImgCode() {
        this.getImgCode();
      },
      //获取短信验证码
      getMessageCode(graphCode) {
        if (VerifyUtils.validateIsNull(graphCode)) {
          getMessageCode(this, graphCode, this.phoneNumber).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '已发送短信验证码，请查收',
                type: 'success'
              });
              this.codeCountDown();
            }else{
              this.$message.error(res.msg);
            }
          })
        }else{
          swal("提示", "请先输入图形验证码", "error");
        }
      },
      codeCountDown() {
        //倒计时
        let time = 60;
        let timer = setInterval(() => {
          if(time == 0) {
            clearInterval(timer);
            this.disabled = false;
            this.btnTitle = "获取验证码";
          } else {
            this.btnTitle =time + '秒后重试';
            this.disabled = true;
            time--
          }
        }, 1000);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getCardListData();
      },
      unCoopHandleSizeChange(val) {
        console.log(`未合作每页 ${val} 条`);
      },
      unCoopHandleCurrentChange(val) {
        console.log(`未合作每当前页: ${val}`);
        this.unCoopCurrentPage = val;
        this.getCardListData();
      },
      allHandleSizeChange(val) {
        console.log(`全部每页 ${val} 条`);
      },
      allHandleCurrentChange(val) {
        console.log(`全部当前页: ${val}`);
        this.allCurrentPage = val;
        this.getCardListData();
      },
    }
  }
</script>

<style scoped>
  @import "../../styles/personal/personal-center.scss";
</style>
