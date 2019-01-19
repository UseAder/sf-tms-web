<template>
    <div>
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                  <el-form-item label="登记日期" prop="createTime">
                    <el-date-picker
                        v-model="searchForm.createTime"
                        type="daterange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="发货单位" prop="consignorName">
                    <el-input v-model="searchForm.consignorName" placeholder="发货单位"></el-input>
                  </el-form-item>
                  <el-form-item label="费用类型" prop="feeType">
                    <el-select v-model="searchForm.feeType"  multiple collapse-tags clearable placeholder="请选择">
                      <el-option
                        v-for="item in exceptionFeeType"
                        :key="item.value"
                        :label="item.item"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary" v-if="checkHasPermission('qtyfjs:read')" @click='handlesearch'>查询</el-button>
                    <el-button type="warning" v-if="checkHasPermission('qtyfjs:read')" @click="resetForm('searchForm')">重置</el-button>
                    <el-button type="primary" v-if="checkHasPermission('qtyfjs:create')" @click="showCreateBalance()">创建对账单</el-button>
                    <el-button type="primary" v-if="checkHasPermission('qtyfjs:read')" @click="exportFile()">导出</el-button>

                  </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border  @selection-change="handleSelectionChange">
              <el-table-column fixed type="selection" width="40" align='center' :selectable="checkSelectable"></el-table-column>
              <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
              <!-- <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                <template slot-scope="scope">
                  <div class="table-menu">
                    <el-menu  :collapse="true"  >
                      <el-submenu index="1" >
                        <template slot="title" >
                          <i class="el-icon-edit-outline"></i>
                        </template>
                        <el-menu-item-group> 
                          <el-menu-item index="1-2" @click="batchDuiz(scope.row)">对账</el-menu-item>
                          <el-menu-item index="1-6" >导出</el-menu-item>   
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column prop="waybillNo" label="运单号" width="150" align='center'>
                <template slot-scope="scope">
                    <el-button
                        @click="showWaybill(scope.row)"
                        type="text"
                        size="small"
                    >{{ scope.row.waybillNo }}</el-button>
                </template>    
              </el-table-column>
              <el-table-column prop="consignorName" label="发货单位" width="150" align='center'></el-table-column>
              <el-table-column prop="transferName" label="承运方" width="150" align='center'></el-table-column>
              <el-table-column prop="feeType" label="费用名称" min-width="100" align='center'>
                <template slot-scope="scope">
                  {{ exceptFeeType(scope.row.feeType)}}
                </template>
              </el-table-column>
              <el-table-column prop="ioType" label="收入/支出" min-width="100" align='center'>
                <template slot-scope="scope">
                  {{ exceptIoType(scope.row.ioType)}}
                </template>
              </el-table-column>
              <el-table-column prop="fee" label="费用" min-width="100" align='center' ></el-table-column>
              <el-table-column prop="balanceFee" label="已结费用" width="100" align='center'></el-table-column>
              <el-table-column prop="unBalanceFee" label="未结费用" width="100" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="unCheckBalanceFee" label="未对账费用" width="100" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="memo" label="费用备注" width="200" align='center'></el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180" align='center'></el-table-column>
              <el-table-column prop="createEmployeeName" label="创建人" width="100" align='center'></el-table-column>
            </el-table>
            <div class="main-table-page">
              <div class="main-table-page-left"> 
                <!-- <el-select v-model="batch.operateType" placeholder="批量操作">
                  <el-option value=" ">
                    <div class='J-batchDeletion' v-if="checkHasPermission('qtyfjs:create')" @click='showCreateBalance'>对账</div>
                  </el-option> 
               
                </el-select>
                <span>已选择{{batch.batchNum}}项</span> -->
              </div>
              <el-pagination background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="page.pageSizes"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="searchForm.pageNo"
                :total="page.total">
              </el-pagination>
            </div>
          </div>
        </div>        
        <otherCreateBalance @reloadList="reloadList" :pVisible.sync='createDialog.visible' :pFeeIds.sync='createDialog.feeIds' v-if="createDialog.visible"></otherCreateBalance>
         <waybillNo-component :showFlag.sync="openWaybill.visiable"
            :waybillNo="openWaybill.waybillNo" :statusText="openWaybill.statusText" 
            :waybillId="openWaybill.waybillId" v-if="openWaybill.visiable"></waybillNo-component>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import otherCreateBalance from './createBalance.vue'
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
  mixins: [Base,List],
  components: { 
    'otherCreateBalance':otherCreateBalance,
     "waybillNo-component": waybillNoComponent,
  },
  data() {
    return {
      searchForm: { //客户对账 查询   
        createTime:[],
        consignorName:'',
        feeType:[],
        createTimeBegin:'',
        createTimeEnd:'',
        pageSize: 10,
        pageNo: 1
      },
      tableData: [],//整车对账 表格
      multipleSelection: [], //多选 

      batch:{
        operateType:'',
        duizIds:[],//选择对账的id数组
        batchNum:0,//已选择n项
      },
      exceptionFeeType:[],

      createDialog: {
         visible:false,
         feeIds:'',
      },
      //运单详情框
      openWaybill: {
          waybillNo: "",
          waybillId: "",
          statusText: "",
          visiable: false
      },
    };
  },
  watch:{
    "searchForm.createTime": function (val, oldval) {
      if (val !== null) {
        this.searchForm.createTimeBegin = val[0];
        this.searchForm.createTimeEnd = val[1];
      }else{
        this.searchForm.createTimeBegin = null;
        this.searchForm.createTimeEnd = null;
      }
    },
  },
  methods: {
    //确认刷新
    reloadList: function (flag) {        
      if (flag) {
          this.querySpecialList()
      }
    },
    checkSelectable(row, index) {
      return row.unCheckBalanceFee != 0;
    },
    showWaybill(row) {
        this.openWaybill.waybillNo = row.waybillNo;
        this.openWaybill.waybillId = row.waybillId;
        this.openWaybill.statusText = this.waybillStatusTxt(row.waybillStatus);
        this.openWaybill.visiable = true;
    },
    /**
     * 显示对账界面
     */
    showCreateBalance() {

      let sd = this.multipleSelection.map(f=>f.id)
      if (sd.length == 0) {
          this.$message.error('请选择列表中的要对账结算的异费记录！');
          return;
      }

      this.createDialog.feeIds = sd
      this.createDialog.visible = true
    },
    exportFile(){
      let sd = this.multipleSelection.map(f=>f.id)
      if (sd.length == 0) {
          this.$message.error('请选择列表中的要对账结算的异费记录！');
          return;
      }
      this.searchForm.feeIds = sd
      api.post('/finance/balance/other/export/list', this.searchForm).then(data=>{
        if (data.code == '200') {
          this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
        }
      })
    },
    querySpecialList() {
      api.post('finance/balance/other/list', this.searchForm).then(data=>{
        if(data.code==="200"){
          this.tableData = data.data.records;
          this.page.total = data.data.total;  
        }
      })
    },
    handleSelectionChange(val) {
      var delsete=[]
      this.multipleSelection = val;
      for (const item of this.multipleSelection) {
          delsete.push(item.id)  
      }
      this.batch.batchNum=delsete.length
      this.batch.duizIds=delsete
    },
    //加载异费类型
    loadExceptionFeeType(){
        api.get('/system/dic/code?code=EXCEPTION_FEE_TYPE').then(data=>{
          if(data.code == "200"){
            this.exceptionFeeType = data.data;
          }
        })
    },
    exceptFeeType: function (type) {

      let param = this.exceptionFeeType.find((n) => (n.value == type));
      if (param === undefined) {
          return ""
      }
      return param.item
    }
  },
  created(){
    this.loadExceptionFeeType()
  }
};
</script>



