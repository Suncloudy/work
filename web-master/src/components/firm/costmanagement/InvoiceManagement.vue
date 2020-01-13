<template>
  <div>
    <el-header class="header_bg">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{(asideNavTitle[0] === '' || asideNavTitle[0] === undefined )? '费用管理':asideNavTitle[0]}}
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/InvoiceManagement'}">{{(asideNavTitle[1] === '' || asideNavTitle[1] ===
          undefined )? '发票管理':asideNavTitle[1]}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="margin_top15 white_bg_color" :class="{displayClass:applyAndList}">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
               active-text-color="#009BDD">
        <el-menu-item index="1">发票申请</el-menu-item>
        <el-menu-item index="2">发票列表</el-menu-item>
      </el-menu>
    </div>
    <!--发票申请-->
    <div :class="[{displayClass:apply},'white_bg_color']">
      <div class="margin_top15">
        <el-button circle :class="selectStepBtn" :disabled="isAble" @click="invoiceOrder()">1</el-button>
        <span :class="[isSelect ? invoiceFont: defaultFont]">选择开票订单</span>
        <span :class="[isSelect?borderColor:selectBorderColor,'striping']"></span>
        <el-button circle :class="[!isSelect?selectStepBtn:stepBtn]" :disabled="isAble" @click="invoiceList()">2</el-button>
        <span :class="[!isSelect ?invoiceFont: defaultFont]">确定发票信息和地址</span>
        <!--<el-button type="primary" circle class="width40">1</el-button>-->
      </div>
      <!--发票申请-->
      <div :class="{displayClass:selectInvoiceOrder}">
        <div class="step_explain regular_font">
          <ol class="text_align_left">
            <li>
              订单支付完成后可开具发票，请选中需要开具发票的订单记录
            </li>
            <li>
              开具的发票抬头:{{invoiceInfoHead}}，开具发票时可选择“电子发票”或“纸质发票”
            </li>
            <li>
              开具发票前，请先：
              <el-button type="text" size="small" class="setting_invoice_info padding_top_bottom0"
                         @click="settingInvoiceInfo()"><u>设置发票信息</u>
              </el-button>
            </li>
          </ol>
        </div>
        <div>
          <el-row class="regular_font">
            <el-col :span="12" class="text_align_left padding_left10">
              <p>有{{orderNumber}}个订单可开具发票，可开票总额：¥{{orderMoneyTotal}}</p>
            </el-col>
            <el-col :span="6" class="text_align_right">
              <p>本次开票金额：¥{{currentInvoiceAmount}}</p>
            </el-col>
            <el-col :span="6">
              <el-button size="medium" class="apply_invoice" @click="applyInvoice()">索取发票</el-button>
            </el-col>
          </el-row>

          <div class="padding_left10 padding_right10">
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange" :header-cell-style="tableHeaderColor">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="orderNumber"
                label="订单号">
              </el-table-column>
              <el-table-column
                prop="productName"
                label="产品">
              </el-table-column>
              <el-table-column
                prop="createDate"
                label="订单时间">
              </el-table-column>
              <el-table-column
                prop="orderStatus"
                label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.orderStatus === 10">待确认</span>
                  <span v-else-if="scope.row.orderStatus === 20">处理中</span>
                  <span v-else-if="scope.row.orderStatus === 30">已完成</span>
                  <span v-else-if="scope.row.orderStatus === 40">已取消</span>
                  <span v-else>———</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="payAmount"
                label="支付金额">
                <template slot-scope="scope">
                  <span>￥{{scope.row.payAmount}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="availableInvoice"
                label="可开票金额">
                <template slot-scope="scope">
                  <span>￥{{scope.row.availableInvoice}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="white_bg_color margin_top15" style="width: 100%">
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
        </div>
      </div>
      <!--确定发票信息-->
      <div :class="{displayClass:confirmInvoiceInfo}">
        <div class="step_explain regular_font">
          <p class="regular_font">
            <!--currentInvoiceAmount-->
            您选取了<span class="invoice_font">{{selectReceipts}}</span>条单据开具发票，开票金额：<span class="invoice_font">¥{{currentInvoiceAmount}}</span>
          </p>
        </div>
        <p class="text_align_left padding_left10 regular_font">
          请核实发票信息是否正确，如果不正确请前往
          <el-button type="text" size="small" class="setting_invoice_info padding_top_bottom0"
                     @click="settingInvoiceInfo()"><u>设置发票信息</u></el-button>
          修改
        </p>
        <el-row>
          <el-col :span="4">
            <p class="regular_font">开具类型</p>
          </el-col>
          <el-col :span="18" class="text_align_left">
            <p class="content_font">{{accountType === 0?'企业':'普通用户'}}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <p class="regular_font">发票抬头</p>
          </el-col>
          <el-col :span="18" class="text_align_left">
            <p class="content_font">{{invoiceInfoHead}}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <p class="regular_font">发票类型</p>
          </el-col>
          <el-col :span="18" class="text_align_left">
            <p class="content_font">{{invoiceType === '0'?'企业增值税普通发票':'增值税专用发票'}}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <p class="regular_font">发票性质</p>
          </el-col>
          <el-col :span="6" class="text_align_left">
            <el-radio-group v-model="invoiceNature" class="margin_top15">
              <el-radio label="0">电子</el-radio>
              <el-radio label="1">纸质</el-radio>
            </el-radio-group>

          </el-col>
          <el-col :span="14" class="text_align_left">
            <p class="regular_font">*推荐使用电子发票，与纸质发票同等效用</p>
          </el-col>
        </el-row>
        <div>
          <el-row class="regular_font">
            <el-col :span="12" class="text_align_left padding_left10">
              <p>共{{addressNumber}}个地址，最多可添加5个</p>
            </el-col>
            <el-col :span="6" class="text_align_right">
              <p>本次开票金额：¥{{currentInvoiceAmount}}</p>
            </el-col>
            <el-col :span="6">
              <el-button size="medium" class="apply_invoice" @click="addAddress()">添加地址</el-button>
            </el-col>
          </el-row>
          <div class="padding_left10 padding_right10">
            <el-table
              ref="multipleTable"
              :data="invoiceAddressData"
              tooltip-effect="dark"
              style="width: 100%"
              :header-cell-style="tableHeaderColor">
              <el-table-column label="选择" width="70" center>
                <template slot-scope="scope">
                  <!--
                  &nbsp; 为空，不加这个radio的label会显示index数字，注意从0开始的；radio会全选的问题是label相同导致的
                  -->
                  <el-radio class="radio" v-model="selectAddress"  :label="scope.$index" @change.native="addressSelectionChange(scope.row)" >&nbsp;</el-radio>
                </template>
              </el-table-column>

              <el-table-column
                prop="receiver"
                label="收件人">
              </el-table-column>
              <el-table-column
                prop="phoneNumber"
                label="联系电话">
              </el-table-column>
              <el-table-column
                prop="address"
                label="地址">
              </el-table-column>
              <el-table-column
                prop="date"
                label="是否默认">
                <template slot-scope="scope">
                  {{scope.row.default
                  ===true?"是":"否"}}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <div class="del_goods">
                    <el-button @click="editInfo(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
                    <el-button @click="defaultClick(scope.row)" type="text" size="small">{{scope.row.default
                      ===true?"默认地址":"设为默认"}}
                    </el-button>
                  </div>

                  <!--<el-button @click="editInvoiceInfo(scope.row)" type="text" size="small">编辑</el-button>-->
                  <!--<el-button type="text" size="small" @click="deleteInvoiceInfo(scope.row)">删除</el-button>-->
                  <!--<el-button type="text" size="small" @click="setDefaultInvoiceAddress(scope.row)">设为默认</el-button>-->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-row>
          <el-col :span="6" class="margin_top15">
            <el-button size="medium" class="last_step margin_bottom15" @click="lastStep()">上一步</el-button>
          </el-col>
          <el-col :span="6" class="margin_top15">
            <el-button size="medium" class="apply_invoice margin_bottom15" @click="afterApplyInvoice()">索取发票</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--发票列表-->
    <div class="padding_left10 padding_right10 white_bg_color" :class="[{displayClass:orderListFlag}]">
      <el-table
        :data="orderListData"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="tableHeaderColor">
        <el-table-column
          label="申请时间"
          width="120" prop="createDate">
          <!--<template slot-scope="scope">{{scope.row.date }}</template>-->
        </el-table-column>
        <el-table-column
          prop="invoiceHead"
          label="发票抬头"
          width="120">
        </el-table-column>
        <el-table-column
          prop="invoiceMoney"
          label="发票总额"
          width="120">
          <template slot-scope="scope">￥{{scope.row.invoiceMoney }}</template>
        </el-table-column>
        <el-table-column
          prop="invoiceMaterial"
          label="发票类型"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.invoiceMaterial==="0"?"电子":"纸质" }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.status===0?"开票中":"已开票" }}</template>
        </el-table-column>
        <!--active-->
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <div class="del_goods">
              <el-button @click="detailClick(scope.row)" type="text" size="small">详细</el-button>
              <el-button @click="invalidInvoiceClick(scope.row)" type="text" size="small">作废</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--申请发票成功-->
    <div class="success_div" :class="{displayClass:invoiceApplySuccess}">
      <p class="apply_success_font padding_top30"><img src="../../../assets/firm/qyzx_tjjl_icon@2x.png" height="38"
                                                       width="38" class="apply_success_img"/>发票申请成功</p>
      <p class="regular_font">详细内容请前往发票列表查看</p>
      <el-button size="medium" class="apply_invoice margin_bottom15" @click="goInvoiceList()">立即前往</el-button>
    </div>
    <!--发票信息管理-->
    <!--<compent v-bind:is="invoiceInfoShow">-->
    <!--<invoice-info></invoice-info>-->
    <!--</compent>-->
    <div :class="[{displayClass:invoiceInfoShow},'margin_top15','white_bg_color']">
      <!--<invoice-info></invoice-info>-->
      <div class="white_bg_color">
        <el-row>
          <el-col :span="18">
            <el-form :model="invoiceInfo" label-width="130px" class="data_form" :rules="invoiceRules" ref="invoiceInfo">
              <el-form-item label="开具类型" prop="accountType">
                <el-radio-group v-model="invoiceInfo.accountType">
                  <el-radio :label= "0">企业</el-radio>
                  <el-radio :label= "1">普通用户</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="发票抬头" prop="invoiceName">
                <el-input v-model="invoiceInfo.invoiceName" autocomplete="off" placeholder="请输入发票抬头"></el-input>
              </el-form-item>
              <el-form-item label="发票类型" prop="invoiceType">
                <el-radio-group v-model="invoiceInfo.invoiceType">
                  <el-radio :label="0">企业增值税普通发票</el-radio>
                  <el-radio :label="1">增值税专用发票</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="税务登记证号">
                <el-input v-model="invoiceInfo.taxRegistrationNo" autocomplete="off" placeholder="请输入税务登记证号"></el-input>
              </el-form-item>
              <el-form-item label="基本开户银行名称">
                <el-input v-model="invoiceInfo.bankName" autocomplete="off" placeholder="请输入开户许可证上的开户行名称"></el-input>
              </el-form-item>
              <el-form-item label="开户银行账号">
                <el-input v-model="invoiceInfo.bankAccountNumber" autocomplete="off"
                          placeholder="请输入开户许可证上的银行账号"></el-input>
              </el-form-item>
              <el-form-item label="注册地址">
                <el-input v-model="invoiceInfo.registerAddress" autocomplete="off"
                          placeholder="请填写营业执照上的注册地址"></el-input>
              </el-form-item>
              <el-form-item label="注册固定电话">
                <el-input v-model="invoiceInfo.registeredLine" autocomplete="off" placeholder="请填写有效联系电话"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button size="medium" class="confirm_invoice_info" @click="confirmSetInvoiceInfo()">确定</el-button>
              </el-form-item>
            </el-form>
            <!--<div class="confirm_div">-->
            <!--<el-button size="medium" class="confirm_invoice_info" @click="confirmInfo()">确定</el-button>-->
            <!--</div>-->
          </el-col>
        </el-row>
      </div>
    </div>
    <!--添加收获地址的弹框-->
    <div>
      <el-dialog title="添加地址" :visible.sync="addAddressFormVisible" width="40%" center>
        <el-form :model="addInvoiceAddress">
          <el-form-item label="收货人" :label-width="formLabelWidth">
            <el-input v-model="addInvoiceAddress.receiver" autocomplete="off" placeholder="请确认收货人"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="formLabelWidth">
            <el-input v-model="addInvoiceAddress.tel" autocomplete="off" placeholder="请输入体检人手机号码"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" :label-width="formLabelWidth">
            <el-row :gutter="10">
              <el-col :span="7">
                <el-select v-model="addInvoiceAddress.province" placeholder="请选择省"
                           @change="selectProvinceEvent(addInvoiceAddress.province)">
                  <el-option
                    v-for="(value,key) in addressData['86']"
                    :key="key"
                    :label="value"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select v-model="addInvoiceAddress.city" placeholder="请选择市"
                           @change="selectCityEvent(addInvoiceAddress.city)">
                  <el-option
                    v-for="(value,key) in addressData[addInvoiceAddress.province]"
                    :key="key"
                    :label="value"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select v-model="addInvoiceAddress.county" placeholder="区县">
                  <el-option
                    v-for="(value,key) in addressData[addInvoiceAddress.city]"
                    :key="key"
                    :label="value"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item label="详细地址" :label-width="formLabelWidth">
            <el-input v-model="addInvoiceAddress.address" autocomplete="off" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="地址名称" :label-width="formLabelWidth">
            <el-input v-model="addInvoiceAddress.desc" autocomplete="off" placeholder="如：家、公司"></el-input>
            <el-checkbox v-model="checked">设为默认地址</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addAddressFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureAddInvoiceAddress()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--修改收获地址的弹框-->
    <div>
      <el-dialog title="修改收货地址" :visible.sync="modifyInvoiceInfo" width="40%" center>
        <el-form :model="editInvoiceAddress">
          <el-form-item label="收货人" :label-width="formLabelWidth">
            <el-input v-model="editInvoiceAddress.receiver" autocomplete="off" placeholder="请确认收货人"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="formLabelWidth">
            <el-input v-model="editInvoiceAddress.phoneNumber" autocomplete="off" placeholder="请输入体检人手机号码"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" :label-width="formLabelWidth">
            <el-row :gutter="10">
              <el-col :span="7">
                <el-select v-model="editInvoiceAddress.province" placeholder="请选择省">
                  <el-option
                    v-for="(value,key) in addressData['86']"
                    :key="key"
                    :label="value"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select v-model="editInvoiceAddress.city" placeholder="请选择市">
                  <el-option
                    v-for="(value,key) in addressData[editInvoiceAddress.province]"
                    :key="key"
                    :label="value"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select v-model="editInvoiceAddress.county" placeholder="区县">
                  <el-option
                    v-for="(value,key) in addressData[editInvoiceAddress.city]"
                    :key="key"
                    :label="value"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item label="详细地址" :label-width="formLabelWidth">
            <el-input v-model="editInvoiceAddress.address" autocomplete="off" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="地址名称" :label-width="formLabelWidth">
            <el-input v-model="editInvoiceAddress.name" autocomplete="off" placeholder="如：家、公司"></el-input>
            <el-checkbox v-model="editInvoiceAddress.default">设为默认地址</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modifyInvoiceInfo = false">取 消</el-button>
          <el-button type="primary" @click="sureModifyInvoiceInfo()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--发票详细信息-->
    <div v-if="showInvoiceDetail" class="white_bg_color margin_top15">
      <div style="height: 6px"></div>
      <div class="invoice_detail_div margin_top15">
        <div class="invoice_detail_bar">
          <p class="regular_font padding_left10 p_line_height">发票 #1, 发票号：<span>{{invoiceNumber}}</span>, 发票金额：¥
            {{invoiceMoney}}</p>
        </div>
        <div class="white_bg_color text_align_left padding_left10">
          <el-row>
            <el-col :span="12">
              <p class="regular_font">发票性质：<span class="regular_font">{{deInvoiceNature === 0?'电子':'纸质'}}</span>&emsp;&emsp;<u
                class="setting_invoice_info">下载</u></p>
            </el-col>
            <el-col :span="12">
              <p class="regular_font">发票状态：<span class="invoice_state_font">{{deInvoiceState===0?"开票中":"已开票"}}</span></p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <p class="regular_font">发票类型：<span class="regular_font">{{deInvoiceType === 0?'企业增值税普通发票':'增值税专用发票'}}</span></p>
            </el-col>
            <el-col :span="12">
              <p class="regular_font">发票抬头：<span class="regular_font">{{deInvoiceHead}}</span></p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <p class="regular_font">申请时间：<span class="regular_font">{{deApplyTime}}</span></p>
            </el-col>
            <el-col :span="12">
              <p><u class="setting_invoice_info" @click="returnInvoiceManage()">返回</u></p>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="margin_left10 margin_right10">
        <p class="regular_font text_align_left">当前发票共有<span>{{deOrderNum}}</span>个订单</p>
        <el-table
          :data="orderDetailList"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="tableHeaderColor">

          <el-table-column
            prop="orderNumber"
            label="订单编号">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品名称">
          </el-table-column>
          <el-table-column
            prop="payTime"
            label="订单支付时间"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="(scope.row.payTime === ''||scope.row.payTime === null ||scope.row.payTime === undefined)">———</span>
              <span v-else>{{scope.row.payTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="paymentAmount"
            label="金额"
            show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.paymentAmount}}</template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="createDate">
            <!--<template slot-scope="scope">{{scope.row.date }}</template>-->
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  // import InvoiceInfo from '../../firm/costmanagement/InvoiceInfoManage'
  import Verify from '../../../utils/utils';
  import swal from 'sweetalert2'; //alert框
  import {mapGetters} from 'vuex'

  export default {
    name: "InvoiceManagement",
    components: {
      // 'invoice-info': InvoiceInfo
    },
    data() {
      return {
        applyAndList: false,//发票申请和列表的导航
        orderKey: "1",
        isSelect: true, //选中步骤'1''2'
        invoiceFont: 'invoice_font',
        defaultFont: 'regular_font',
        selectStepBtn: 'select_step_btn',
        stepBtn: 'step_btn',
        isAble:true,
        borderColor: 'border_color',
        selectBorderColor: 'select_border_color',
        activeIndex: '1',
        orderNumber: '1',
        orderMoneyTotal: '200',
        selectReceipts: '10',
        // invoiceAmount: '1000',
        tableData: [],
        invoiceAddressData: [],
        orderListData: [],
        currentPage: 1,
        total: 1,
        accountType: '0',//开具类型
        invoiceInfoHead: '北京***公司',//发票抬头
        invoiceType: '企业增值税普通发票',
        invoiceInfoHead: '',//基本信息得到的发票抬头
        currentInvoiceAmount: 0,//当前开票金额
        multipleSelection: [],
        orderIds:[],//选中的订单id
        invoiceNature: '0',
        addressNumber: '1',
        selectAddress:'',
        invoiceAddressId:'',
        selectInvoiceOrder: false, //选择开票订单
        confirmInvoiceInfo: true, //确认发票信息和地址
        apply: false, //切换发票申请
        orderListFlag: true,//发票列表
        modifyInvoiceInfo: false,
        checked: true,
        addAddressFormVisible: false,
        addInvoiceAddress: {
          receiver: '',
          tel: '',
          province: '',
          city: '',
          region: '',
          address: '',
          desc: '',
        },
        editInvoiceAddress: [],
        formLabelWidth: '100px',
        invoiceInfoShow: true,//发票信息
        invoiceApplySuccess: true,//发票申请成功
        cities: [],
        //发票信息
        invoiceInfo: {
          accountType: '0',
          invoiceName: '',
          invoiceType: '0',//0企业增值税普通发票 1增值税专用发票
          taxRegistrationNo: '',
          bankName: '',
          bankAccountNumber: '',
          registerAddress: '',
          registeredLine: '',//注册固定电话
        },
        invoiceRules: {
          invoiceName: [
            {required: true, message: '请输入发票抬头', trigger: 'blur'},
            {min: 2, message: '长度在最小2个字符', trigger: 'blur'}
          ],
          // birth: [
          //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          // ],
        },
        //  发票详情
        invoiceNumber: 271311,
        invoiceMoney: 1220,
        deInvoiceNature: '电子',
        deInvoiceState: '已开票',
        deInvoiceType: '增值税普通发票',
        deInvoiceHead: 'XXXX科技有限公司',
        deApplyTime: '2019-01-28',
        deOrderNum: 100,
        showInvoiceDetail: false,
        orderDetailList:[],
        addressData: [],
      }
    },
    computed: {
      ...mapGetters(['asideNavTitle', 'invoiceInfoFlag'])
    },
    created() {
      this.getCityData();
      //获取发票地址
      this.getInvoiceAddressData();
      // 开通发票基本信息获取
      this.getInvoiceBaseInfo();
      // 可开具发票订单列表（发票管理界面主页）
      this.getInvoiceOrderList();
      //发票列表
      this.getOrderList();
      // console.log("invoiceInfoFlag=="+this.invoiceInfoFlag);
      // if (this.invoiceInfoFlag == true){
      //   this.confirmInfo();
      // }
    },
    methods: {
      selectProvinceEvent(key) {
        var numReg = /^[0-9]+$/;
        var numRe = new RegExp(numReg);
        if (key != undefined && numRe.test(key)) {
          var arr = [];
          for (let i in this.addressData[key]) {
            arr.push(i)
          }
          this.addInvoiceAddress.city = arr[0];
          var county = [];
          for (let j in this.addressData[this.addInvoiceAddress.city]) {
            county.push(j);
          }
          this.addInvoiceAddress.region = county[0];
          // this.detailAddress = this.addressData['86'][this.selectedProvince];
        }
      },
      selectCityEvent(val) {
        var numReg = /^[0-9]+$/;
        var numRe = new RegExp(numReg);
        if (val != undefined && numRe.test(val)) {
          var arr = [];
          for (let i in this.addressData[val]) {
            arr.push(i)
          }
          this.addInvoiceAddress.region = arr[0];
          // this.detailAddress += this.addressData[this.selectedProvince][this.selectedCity];
        }
      },
      //获取发票地址
      getInvoiceAddressData() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let listUrl = "/api/user/invoiceAddress/" + enterpriseId;
        this.$get(listUrl, {}).then(res => {
          if (res.data.code === 200) {
            this.invoiceAddressData = res.data.data.items;
            // console.log("发票地址 ==" + JSON.stringify(res));
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //获取发票基本信息
      getInvoiceBaseInfo() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let listUrl = "/api/enterprise/invoice/basic/" + enterpriseId;
        this.$get(listUrl, {}).then(res => {
          if (res.data.code === 200) {
            this.invoiceInfoHead = res.data.data.invoiceHead;
            this.accountType = res.data.data.accountType;
            this.invoiceType = res.data.data.invoiceType;
            //回显发票信息的数据
            this.invoiceInfo.accountType = res.data.data.accountType;
            this.invoiceInfo.invoiceName = res.data.data.invoiceHead;
            this.invoiceInfo.invoiceType = res.data.data.invoiceType;
            this.invoiceInfo.taxRegistrationNo = res.data.data.taxpayerId;
            this.invoiceInfo.bankName = res.data.data.bankName;
            this.invoiceInfo.bankAccountNumber = res.data.data.bankAccount;
            this.invoiceInfo.registerAddress = res.data.data.address;
            this.invoiceInfo.registeredLine = res.data.data.phoneNumber;
            // console.log("Base info data ==" + JSON.stringify(res));
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      // 获取可开发票的订单列表
      getInvoiceOrderList() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let listUrl = "/api/enterprise/invoice/orders/" + enterpriseId;
        this.$get(listUrl, {}).then(res => {
          if (res.data.code === 200) {
            this.orderNumber = res.data.data.data.total;
            this.orderMoneyTotal = res.data.data.invoice;
            this.tableData = res.data.data.data.items;
            for (const i in this.tableData) {
              let createDate = Verify.convertDate(this.tableData[i].createdAt);
              this.tableData[i]['createDate'] = createDate;
              this.tableData[i]['payAmount'] = Verify.toDecimal(this.tableData[i].paymentAmount);
              this.tableData[i]['availableInvoice'] = Verify.toDecimal(this.tableData[i].total);
              for (let j = 0; j < this.tableData[i].OrderItems.length; j++) {
                this.tableData[i]['productName'] = this.tableData[i].OrderItems[j].name;
              }
            }
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //获取发票列表
      getOrderList() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let listUrl = "/api/enterprise/invoices/" + enterpriseId;
        this.$get(listUrl, {
          accountId: enterpriseId
        }).then(res => {
          if (res.data.code === 200) {
            this.orderListData = res.data.data.items;
            for (const i in this.orderListData) {
              //invoiceDate 开票时间
              let createDate = Verify.convertDate(this.orderListData[i].invoiceDate);
              this.orderListData[i]['createDate'] = createDate;
            }
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //上一步
      lastStep() {
        this.invoiceInfoShow = true;
        this.confirmInvoiceInfo = true;
        this.selectInvoiceOrder = false;
        this.isSelect = true;
        this.invoiceInfoShow = true; //隐藏设置发票信息的页面
        this.invoiceApplySuccess = true; //隐藏发票申请成功
      },
      //添加地址
      addAddress() {
        this.addAddressFormVisible = true;
      },
      //确认添加地址
      sureAddInvoiceAddress() {
        if (!Verify.phoneNumberVerify(this.addInvoiceAddress.tel)) {
          alert("请输入合法的手机号码");
        } else if (Verify.validateIsNull(this.addInvoiceAddress.receiver) &&
          Verify.validateIsNull(this.addInvoiceAddress.province) &&
          Verify.validateIsNull(this.addInvoiceAddress.city) &&
          Verify.validateIsNull(this.addInvoiceAddress.region) &&
          // Verify.validateIsNull(this.addInvoiceAddress.address) &&
          Verify.validateIsNull(this.addInvoiceAddress.desc)) {
          let enterpriseId = localStorage.getItem("enterpriseId");
          let addUrl = "/api/user/invoiceAddress/" + enterpriseId;
          this.$post(addUrl, {
            receiver: this.addInvoiceAddress.receiver,
            phoneNumber: this.addInvoiceAddress.tel,
            province: this.addInvoiceAddress.province,
            city: this.addInvoiceAddress.city,
            county: this.addInvoiceAddress.region,
            address: this.addInvoiceAddress.address,//详细地址
            addressName: this.addInvoiceAddress.desc,//如家，公司
            default: this.checked,//1是 0否
          }).then(res => {
            console.log(JSON.stringify(res))
            if (res.data.code === 200) {
              this.addAddressFormVisible = false;
              this.getInvoiceAddressData();
              // console.log("invoice data==" + JSON.stringify(res.data));
            } else {
              swal("提示", res.data.msg, "error");
            }
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });
        } else {
          alert("请录入地址相关内容,注意录入的内容是否合法");
        }
      },
      //删除地址
      deleteClick(row) {
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
            let deleteAddressUrl = "/api/user/invoiceAddress/" + addressId;
            this.$del(deleteAddressUrl, {
              // addressId: addressId
            }).then((res) => {
              if (res.data.code === 200) {
                swal("提示", "已删除", "success");
              } else {
                swal("提示", res.data.msg, "error");
              }
              this.getInvoiceAddressData();
            })
          } else {
            swal("Cancelled", "", "");
          }
        });
      },
      //设置默认地址
      defaultClick(row) {
        // console.log("row==" + JSON.stringify(row));
        let str = "是否确定设为默认地址?";
        if (row.default = true) {
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
            // console.log(addressId + "===" + JSON.stringify(this.checked))
            let setDefaultAddUrl = "/api/user/invoiceAddress/" + addressId + "/default";
            this.$put(setDefaultAddUrl, {
              default: !this.checked,
            }).then((res) => {
              // console.log("adminId==" + JSON.stringify(res) + row + JSON.stringify(row));
              if (res.data.code === 200) {
                swal("提示", "设置成功", "success");
              } else {
                swal("提示", res.data.msg, "error");
              }
              this.getInvoiceAddressData();
            })
          } else {
            swal("Cancelled", "取消操作", "");
          }
        });
      },
      //编辑
      editInfo(row) {
        // console.log("123" + JSON.stringify(row));
        this.editInvoiceAddress = row;
        this.modifyInvoiceInfo = true;
      },
      //确认修改发票地址信息
      sureModifyInvoiceInfo() {
        // this.modifyInvoiceInfo = false;
        let addressId = this.editInvoiceAddress.addressId;
        let modifyAddressUrl = "/api/user/invoiceAddress/" + addressId;
        this.$put(modifyAddressUrl, {
          // addressId: addressId,
          receiver: this.editInvoiceAddress.receiver,
          phoneNumber: this.editInvoiceAddress.phoneNumber,
          province: this.editInvoiceAddress.province,
          city: this.editInvoiceAddress.city,
          county: this.editInvoiceAddress.county,
          address: this.editInvoiceAddress.address,//详细地址
          addressName: this.editInvoiceAddress.name,//如家，公司
          default: this.editInvoiceAddress.default,//1是 0否
        }).then((res) => {
          // console.log("修改==" + JSON.stringify(JSON.stringify(res.data)))
          if (res.data.code === 200) {
            swal("提示", "已修改", "success");
          } else {
            swal("提示", res.data.msg, "error");
          }
          this.modifyInvoiceInfo = false;
          this.getInvoiceAddressData();
        })
      },
      //设置发票信息
      settingInvoiceInfo() {
        this.applyAndList = true;//隐藏发票申请和发票列表的导航
        this.apply = true;//隐藏"1" 和"2"
        this.invoiceInfoShow = false;//显示设置发票信息的页面
        this.selectInvoiceOrder = true;//隐藏第'1'部选择开票订单的内容
        this.confirmInvoiceInfo = true;//隐藏第'2'步对应的内容
        this.isSelect = false;//第"2"步确定发票信息和地址未被选中
        this.invoiceApplySuccess = true; //隐藏发票申请成功
      },
      //确认设置发票信息
      confirmSetInvoiceInfo() {
        let enterpriseId = localStorage.getItem("enterpriseId");
        let listUrl = "/api/enterprise/invoice/basic/" + enterpriseId;
        this.$post(listUrl, {
          accountType: this.invoiceInfo.accountType,
          invoiceHead: this.invoiceInfo.invoiceName,
          invoiceType: this.invoiceInfo.invoiceType,//发票类型 0企业增值税普通发票 1增值税专用发票
          taxpayerId: this.invoiceInfo.taxRegistrationNo,//纳税人识别码
          bankAccount: this.invoiceInfo.bankAccountNumber,//开户银行账户  如果invoiceType=1 必须上传
          bankName: this.invoiceInfo.bankName,
          address: this.invoiceInfo.registerAddress,
          phoneNumber: this.invoiceInfo.registeredLine,
        }).then(res => {
          if (res.data.code === 200) {
            // debugger
            swal("提示", "修改成功", "success");
            this.confirmInfo();
          } else {
            swal("提示", res.data.msg, "error");
          }
          // console.log("res=="+JSON.stringify(res))
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });
      },
      //确认设置发票信息
      confirmInfo() {
        this.applyAndList = false; //显示发票申请和发票列表的导航
        this.apply = false;//显示"1" 和"2"
        this.confirmInvoiceInfo = true;//隐藏第'2'步对应的内容
        this.selectInvoiceOrder = false;//显示第'1'步选择开票订单
        this.isSelect = true;//第"2"步确定发票信息和地址未被选中
        this.invoiceInfoShow = true; //隐藏设置发票信息的页面
        this.invoiceApplySuccess = true; //隐藏发票申请成功
      },
      //发票订单
      invoiceOrder() {
        this.invoiceInfoShow = true;
        this.confirmInvoiceInfo = true;
        this.selectInvoiceOrder = false;
        this.isSelect = true;
        this.invoiceInfoShow = true; //隐藏设置发票信息的页面
        this.invoiceApplySuccess = true; //隐藏发票申请成功
      },
      //发票列表
      invoiceList() {
        this.applyAndList = false;//发票申请和发票列表的导航
        this.apply = false;//显示"1" 和"2"
        this.invoiceInfoShow = true;
        this.confirmInvoiceInfo = false;
        this.selectInvoiceOrder = true;
        this.isSelect = false;
        this.invoiceApplySuccess = true; //隐藏发票申请成功
      },

      //索取发票（跳转第二部）
      applyInvoice() {
        if (this.multipleSelection.length === 0) {
          this.$message('请勾选申请发票的订单');
        } else {
          this.applyAndList = false; //显示发票申请和发票列表的导航
          this.apply = false;//显示"1" 和"2"
          this.invoiceInfoShow = true; //隐藏设置发票信息的页面
          this.selectInvoiceOrder = true;//隐藏第'1'步选择开票订单
          this.confirmInvoiceInfo = false;//隐藏第'2'步对应的内容
          this.isSelect = false;//第"2"步确定发票信息和地址被选中
          this.invoiceApplySuccess = true; //隐藏发票申请成功
        }

      },
      //确认索取发票
      afterApplyInvoice(){
        if (!Verify.validateIsNull(this.invoiceAddressId)){
          this.$message('请勾选申请发票的地址');
        }else{
          let enterpriseId = localStorage.getItem("enterpriseId");
          let listUrl = "/api/enterprise/invoice/" + enterpriseId;
          this.$post(listUrl, {
            enterpriseId: enterpriseId,
            invoiceMaterial: this.invoiceNature,
            invoiceAddressId: this.invoiceAddressId,//发票类型 0企业增值税普通发票 1增值税专用发票
            invoiceMoney: this.currentInvoiceAmount,//纳税人识别码
            orderIds: this.orderIds,
          }).then(res => {
            if (res.data.code === 200) {
              this.applyAndList = true;//隐藏发票申请和发票列表的导航
              this.apply = true;//隐藏"1" 和"2"
              this.invoiceInfoShow = true;//隐藏设置发票信息的页面
              this.selectInvoiceOrder = true;//隐藏第'1'部选择开票订单的内容
              this.confirmInvoiceInfo = true;//隐藏第'2'步对应的内容
              this.isSelect = false;//第"2"步确定发票信息和地址未被选中
              this.invoiceApplySuccess = false; //显示发票申请成功
            } else {
              swal("提示", res.data.msg, "error");
            }
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });
        }

      },
      //索取发票成功后 前往发票列表查看
      goInvoiceList() {
        //索取发票的第二步
        // this.applyAndList = false; //显示发票申请和发票列表的导航
        // this.apply = false;//显示"1" 和"2"
        // this.invoiceInfoShow = true; //隐藏设置发票信息的页面
        // this.selectInvoiceOrder = true;//隐藏第'1'步选择开票订单
        // this.confirmInvoiceInfo = false;//隐藏第'2'步对应的内容
        // this.isSelect = false;//第"2"步确定发票信息和地址被选中
        // this.invoiceApplySuccess = true; //隐藏发票申请成功
        this.orderListFlag = true;//隐藏发票列表
        this.showInvoiceDetail = true;
        this.applyAndList = true; //隐藏发票申请和发票列表的导航
        this.apply = true;//隐藏"1" 和"2"
        this.invoiceInfoShow = true; //隐藏设置发票信息的页面
        this.selectInvoiceOrder = true;//隐藏第'1'步选择开票订单
        this.confirmInvoiceInfo = false;//隐藏第'2'步对应的内容
        this.invoiceApplySuccess = true; //隐藏发票申请成功
      },

      //导航切换
      handleSelect(key, keyPath) {
        if (keyPath == "2") {
          this.apply = true;
          this.orderListFlag = false;
        } else {
          this.apply = false;
          this.orderListFlag = true;
          // console.log(key, keyPath);
        }
        this.orderKey = keyPath;
      },
      editInvoiceInfo() {


      },
      //发票详细
      detailClick(rowData) {
          let listUrl = "/api/enterprise/invoice/" +rowData.invoiceId + '/detail';
          this.$get(listUrl, {}).then(res => {
            if (res.data.code === 200) {
              let baseInfo = res.data.data.resultInvoiceDetail;
              // this.invoiceNumber = baseInfo.;
              this.invoiceMoney = baseInfo.invoiceMoney;
              this.deInvoiceNature = baseInfo.invoiceMaterial;
              this.deInvoiceState = baseInfo.status;
              this.deApplyTime = Verify.convertDate(baseInfo.invoiceDate);
              this.deOrderNum = baseInfo.orderNumber;
              this.deInvoiceType = res.data.data.InvoiceProfile.invoiceType;
              this.deInvoiceHead = res.data.data.InvoiceProfile.invoiceHead;

              this.orderDetailList = res.data.data.paginate.items;
              for (let i=0;i<res.data.data.paginate.items.length;i++){
                if (Verify.validateIsNull(res.data.data.paginate.items[i].paidAt)) {
                  this.orderDetailList[i]['payTime'] = res.data.data.paginate.items[i].paidAt;
                }
                this.orderDetailList[i]['createDate'] = res.data.data.paginate.items[i].createdAt;

                for (let j=0;j<res.data.data.paginate.items[i].OrderItems.length;j++){
                  this.orderDetailList[i]['productName'] = res.data.data.paginate.items[i].OrderItems[j].name;
                }
              }
              //发票详情的视图
              // this.applyAndList = true;//隐藏发票申请和发票列表的导航
              // this.apply = true;//隐藏"1" 和"2"
              // this.invoiceInfoShow = true;//隐藏设置发票信息的页面
              // this.selectInvoiceOrder = true;//隐藏第'1'部选择开票订单的内容
              // this.confirmInvoiceInfo = true;//隐藏第'2'步对应的内容
              // this.isSelect = false;//第"2"步确定发票信息和地址未被选中
              // this.invoiceApplySuccess = false; //显示发票申请成功
              this.orderListFlag = true;//隐藏发票列表
              this.showInvoiceDetail = true;
              this.applyAndList = true; //隐藏发票申请和发票列表的导航
              this.apply = true;//隐藏"1" 和"2"
              this.invoiceInfoShow = true; //隐藏设置发票信息的页面
              this.selectInvoiceOrder = true;//隐藏第'1'步选择开票订单
              this.confirmInvoiceInfo = false;//隐藏第'2'步对应的内容
              this.invoiceApplySuccess = true; //隐藏发票申请成功
            } else {
              swal("提示", res.data.msg, "error");
            }
          }).catch(function (reason) {
            console.log(JSON.stringify(reason));
          });
      },
      //作废发票
      invalidInvoiceClick(rowData){
        let listUrl = "/api/enterprise/invoice/" +rowData.invoiceId + '/delete';
        this.$del(listUrl, {}).then(res => {
          if (res.data.code === 200) {
            swal("提示", "已作废", "success");
          } else {
            swal("提示", res.data.msg, "error");
          }
        }).catch(function (reason) {
          console.log(JSON.stringify(reason));
        });

      },
      //发票详细页的返回事件
      returnInvoiceManage() {
        this.showInvoiceDetail = false;
        this.orderListFlag = false;//显示发票列表
        this.applyAndList = false; //显示发票申请和发票列表的导航
        this.apply = true;//隐藏"1" 和"2"
        this.invoiceInfoShow = true; //隐藏设置发票信息的页面
        this.selectInvoiceOrder = false;//隐藏第'1'步选择开票订单
        this.confirmInvoiceInfo = false;//隐藏第'2'步对应的内容
        this.isSelect = true;//第"2"步确定发票信息和地址未被选中
        this.invoiceApplySuccess = true; //隐藏发票申请成功
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      //可开具发票的订单选择项
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.currentInvoiceAmount = 0;
        this.selectReceipts = val.length;
        for (let i = 0; i < val.length; i++) {
          let obj = val[i].id;
          this.orderIds.push(obj) ;
          this.currentInvoiceAmount += val[i].total;
        }
      },
      addressSelectionChange(val){
        this.invoiceAddressId = val.addressId;
      },
      // 修改table header的背景色
      tableHeaderColor({row, column, rowIndex, columnIndex}) {
        if (rowIndex === 0) {
          return 'background-color: #F6F6F6;color: #404040;font-weight: 500;'
        }
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

  /*选择发票信息"1""2"的样式*/
  .step_btn {
    background-color: #E6EBEE;
    color: #ffffff;
    width: 40px;
  }

  .select_step_btn {
    background-color: #33B2E8;
    color: #ffffff;
    width: 40px;
  }

  .striping {
    display: inline-block;
    position: relative;
    top: -6px;
    content: "";
    width: 100px;
    height: 0px;
  }

  .border_color {
    border: 1px solid #404040;
  }

  .select_border_color {
    border: 1px solid #33B2E8;
  }

  .invoice_font {
    color: #33B2E8;
    font-size: 14px;
  }

  .regular_font {
    color: #404040;
    font-size: 14px;
  }

  .select_color {
    color: #33B2E8;
  }

  .step_explain {
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

  .apply_invoice {
    color: #ffffff;
    background-color: #33B2E8;
    font-size: 17px;
  }

  .content_font {
    color: #333333;
    font-size: 14px;
  }

  .last_step {
    width: 120px;
    color: #404040;
    font-size: 17px;
  }

  .displayClass {
    display: none;
  }

  /*发票申请成功*/
  .success_div {
    height: 456px;
    margin-top: 15px;
    background-color: #ffffff;
  }

  .apply_success_img {
    vertical-align: middle;
  }

  .apply_success_font {
    font-size: 18px;
    color: #333333
  }

  /*发票信息*/
  .data_form {
    width: 450px;
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .confirm_invoice_info {
    width: 310px;
    background-color: #33B2E8;
    font-size: 17px;
    color: #FFFFFF;
  }

  /*发票详情*/
  .p_line_height {
    line-height: 32px;
    margin-top: 0px;
  }

  .invoice_detail_div {
    border: 1px solid rgba(204, 204, 204, 1);
    /*margin-left: 10px;*/
    /*margin-right: 10px;*/
    margin: 10px;
    /*padding-left: 0px;*/
  }

  .invoice_detail_bar {
    text-align: left;
    background-color: #F6F6F6;
    height: 36px;
  }

  .invoice_state_font {
    color: #5BC146;
    font-size: 14px;
  }
</style>
