<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{asideNavTitle.length!=0?asideNavTitle[0]:"账号管理"}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{asideNavTitle.length != 0?asideNavTitle[1]:"消息提醒"}}</el-breadcrumb-item>
        <!--<el-button @click="addShippingAddress()" class="addBtn">添加收货地址</el-button>-->
      </el-breadcrumb>
    </el-header>
    <div class="white_bg_color">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="margin_top10 message_tab">
        <el-tab-pane label="未读消息" name="first">
          <div>
            <div class="text-right operate_button">
              <!--<router-link :to="{path:'/AddInstitution'}" active-class="active">-->
              <el-button plain size="medium" @click="markReadEvent()">标记已读</el-button>
              <el-button plain size="medium" @click="allReadEvent()">全部已读</el-button>
              <el-button plain size="medium" @click="deleteEvent()">删除</el-button>
              <!--</router-link>-->
              <!--<b-btn @click="addInstitute()" class="mr-2" v-b-modal.addUserModal>添加机构</b-btn>-->
            </div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="title"
                label="消息标题"
                width="">
                <!--<template slot-scope="scope">{{ scope.row.date }}</template>-->
              </el-table-column>
              <el-table-column
                prop="createdDate"
                label="时间">
              </el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                show-overflow-tooltip>
                <template slot-scope="scope">{{ scope.row.type ==='system'?'系统消息':'其他'}}</template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="160">
                <template slot-scope="scope">
                  <div class="del_goods">
                    <el-button type="text" size="small" @click="detailEvent(scope.row)">详细</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="全部已读" name="second">
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="title"
                label="消息标题"
                width="">
                <!--<template slot-scope="scope">{{ scope.row.date }}</template>-->
              </el-table-column>
              <el-table-column
                prop="createdDate"
                label="时间">
              </el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                show-overflow-tooltip>
                <template slot-scope="scope">{{ scope.row.type ==='system'?'系统消息':'其他'}}</template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                  <div class="del_goods">
                    <el-button type="text" size="small" @click="detailEvent(scope.row)">详细</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import swal from 'sweetalert2'; //alert框
  import Verify from "../../../utils/utils";

  export default {
    name: "MessageRemind",
    data() {
      return {
        tableData: [],
        activeName: 'first',
        multipleSelection: [],
      }
    },
    created() {
      this.getMessageInfo('unread');
    },
    computed: {
      ...mapGetters(['asideNavTitle'])
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
        if (tab.name === 'first') {
          this.getMessageInfo('unread');
        } else if (tab.name === 'second') {
          this.getMessageInfo('read');
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //获取消息信息
      getMessageInfo(str) {
        // let userId = localStorage.getItem("userId");
        let id = '';
        let givenUrl = '';
        // console.log(localStorage.getItem("userId"));
        // console.log(localStorage.getItem("enterpriseId"));
        if (localStorage.getItem("userId") === undefined ||localStorage.getItem("userId") == null) {
          id = localStorage.getItem("enterpriseId");
          givenUrl = '/api/enterprise/' + id + '/messages';
        }else if (localStorage.getItem("enterpriseId") === undefined || localStorage.getItem("enterpriseId") == null) {
          id = localStorage.getItem("userId");
          givenUrl = '/api/personal/' + id + '/messages';
        }
        this.$get(givenUrl, {
          status: str,
        }).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.items;
            for (var i = 0; i < this.tableData.length; i++) {
              let createdDate = Verify.convertDate(this.tableData[i].createdAt);
              this.tableData[i]['createdDate'] = createdDate;
            }
            // console.log("消息==" + JSON.stringify(res.data.data))
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //  标记已读事件
      markReadEvent() {
        if (Verify.validateIsNull(this.multipleSelection) &&
          this.multipleSelection.length !== 0) {
          let id = '';
          let givenUrl = '';
          if (localStorage.getItem("userId") === undefined ||localStorage.getItem("userId") == null) {
            id = localStorage.getItem("enterpriseId");
            givenUrl = '/api/enterprise/' + id + '/messages';
          }else if (localStorage.getItem("enterpriseId") === undefined || localStorage.getItem("enterpriseId") == null) {
            id = localStorage.getItem("userId");
            givenUrl = '/api/personal/' + id + '/messages';
          }
          var itemArr = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let obj = this.multipleSelection[i].id;
            itemArr.push(obj);
          }
          // let givenUrl = '/api/personal/' + id + '/messages';
          this.$put(givenUrl, {
            messageIds: itemArr,
          }).then(res => {
            if (res.data.code === 200) {
              this.getMessageInfo('unread');
            } else {
              alert(res.data.msg);
            }
          }).catch(function (reason) {
            console.log('catch:', reason);
          });
        } else {
          this.$message.error("请先选择要标记已读的消息!")
        }
      },
      //全部已读事件
      allReadEvent() {
        var itemArr = []; //数组为空，表示全部已读的状态
        let id = '';
        let givenUrl = '';
        if (localStorage.getItem("userId") === undefined ||localStorage.getItem("userId") == null) {
          id = localStorage.getItem("enterpriseId");
          givenUrl = '/api/enterprise/' + id + '/messages';
        }else if (localStorage.getItem("enterpriseId") === undefined || localStorage.getItem("enterpriseId") == null) {
          id = localStorage.getItem("userId");
          givenUrl = '/api/personal/' + id + '/messages';
        }
        this.$put(givenUrl, {
          messageIds: itemArr,
        }).then(res => {
          if (res.data.code === 200) {
            this.getMessageInfo('unread');
          } else {
            alert(res.data.msg);
          }
        }).catch(function (reason) {
          console.log('catch:', reason);
        });
      },
      //删除事件
      deleteEvent() {
        if (Verify.validateIsNull(this.multipleSelection) && this.multipleSelection.length != 0) {
          swal({
            title: "是否确定删除?",
            text: "",
            type: "question",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }).then((result) => {
            if (result.value) {
              var itemArr = [];
              for (let i = 0; i < this.multipleSelection.length; i++) {
                let obj = this.multipleSelection[i].id;
                itemArr.push(obj);
              }
              let id = '';
              let url = '';
              if (localStorage.getItem("userId") === undefined ||localStorage.getItem("userId") == null) {
                id = localStorage.getItem("enterpriseId");
                url = '/api/enterprise/' + id +'/' + itemArr+'/messages';
              }else if (localStorage.getItem("enterpriseId") === undefined || localStorage.getItem("enterpriseId") == null) {
                id = localStorage.getItem("userId");
                url = '/api/personal/' + id + '/' + itemArr + '/messages';
              }
              this.$del(url, {
                // itemIds: itemArr.toString()
              }).then((res) => {
                if (res.data.code === 200) {
                  swal("Deleted!", "已删除", "success");
                  this.getMessageInfo('unread');
                } else {
                  alert(res.data.msg);
                }
              })
            } else {
              swal("Cancelled", "这条数据还在哦", "error");
            }
          });
        } else {
          this.$message.error("请先选择要删除的消息!")
        }
      },
      detailEvent(rowData) {
        console.log('data=='+JSON.stringify(rowData));
        this.$router.push({path: '/PersonMessageDetail', query: {cardId: rowData.id}});
      },
    }

  }
</script>

<style scoped>
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
  }

  .address_table {
    margin-top: 15px;
    width: 100%;
  }

  .el-form-item {
    /*margin-bottom: 22px;*/
    width: 80%;
  }

  .margin_top10 {
    margin-top: 10px;
    margin-left: 10px;
  }

  .text-right {
    text-align: right !important;
  }
  .operate_button .el-button:hover {
    color: #089EDE;
    border-width: 1px;
  }
  .operate_button .el-button:focus,.el-button:hover {
    color: #089EDE;
    border-color: #089EDE;
  //border-width: 1px;
  }
  .operate_button .el-button--primary:focus, .el-button--primary:hover {
    border-color: #089EDE;
    color: #089EDE;
  }
</style>
